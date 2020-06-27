import React, {useState, useEffect, useReducer, useRef} from 'react';
import ProgressAbility from "./ProgressAbility"
import GlobalCooldown from "./GlobalCooldown"
import CastBar from "./CastBar"
import {spellQueueWindow} from "../lib/constants"
import "./AbilityBar.css"

const AbilityBar = (props) => {

    const gcdLength = 1500
    const {abilitySettings, abilities, haste, inVoidform, triggerEvent, keyEventsPaused, reset} = props

    const hasteRef = useRef(haste)
    hasteRef.current = haste

    const inVoidformRef = useRef(inVoidform)
    inVoidformRef.current = inVoidform 

    const spellQueueTimer = useRef()

    const defaultCooldowns = () => {
        const cooldowns = {}
        Object.keys(abilities).forEach(k => {
            if(abilitySettings[k] && abilitySettings[k].disabled) return
            cooldowns[k] = {
                startTime: 0
            }
        })

        return cooldowns
    }

    const [observers, setObservers] = useState([])

    const observersRef = useRef(observers)
    observersRef.current = observers

    const defaultState = {
        globalCooldown: 0,
        cooldowns: defaultCooldowns(),
        status: {}
    }

    useEffect(() => {
        triggerCooldown({
            type: "RESET"
        })
    }, [reset])

    useEffect(() => {
        const name = "mind-blast"
        const ability = abilitySettings[name]
        const cdr = ability.cdr * (inVoidform && -1 || 1)
        ability.cooldown += cdr

    }, [inVoidform])

    useEffect(() => {
        document.addEventListener("keypress", handleKeyPress)

        return () => {
            document.removeEventListener("keypress", handleKeyPress)
        }
    }, [keyEventsPaused])

    const [state, triggerCooldown] = useReducer((oldState, action) => {
        const newState = JSON.parse(JSON.stringify(oldState))
        const payload = action.payload

        switch(action.type) {
            case "RESET":
                return defaultState
            case "EXECUTE_PENDING":
                var {name} = payload
                newState.status[name] = "PENDING"
                break
            case "EXECUTE_END":
                var {name} = payload
                newState.status[name] = ""
                break
            case "ABILITY_CAST_SUCCESS":
                var {name} = payload
                if(abilitySettings["void-bolt"].rankTwo && newState.casting && name === "void-bolt" && newState.casting.name === "mind-flay") {
                    break
                }
                newState.cooldowns[name].castStartTime = 0
                newState.cooldowns[name].castEndTime = 0

                if(newState.casting) {
                    newState.cooldowns[newState.casting.name].castStartTime = 0
                    newState.cooldowns[newState.casting.name].castEndTime = 0
                    delete newState.casting
                }
                break
            case "ABILITY_COOLDOWN_START":
                var {name, time} = payload
                newState.cooldowns[name].startTime = time
                break
            case "ABILITY_COOLDOWN_END":
                var {name} = payload
                newState.cooldowns[name].startTime = 0
                break
            case "ABILITY_CAST_START":
                var {name, displayName, time, duration} = payload
                newState.cooldowns[name].castStartTime = time
                newState.cooldowns[name].castEndTime = time + duration
                if(newState.casting) {
                    newState.cooldowns[newState.casting.name].castStartTime = 0
                    newState.cooldowns[newState.casting.name].castEndTime = 0
                }
                newState.casting = {
                    duration,
                    name,
                    displayName,
                    direction: 1,
                    time
                }
                break
            case "ABILITY_CHANNEL_START":
                var {name, displayName, time, duration, baseChannelTime} = payload
                newState.cooldowns[name].castStartTime = time
                newState.cooldowns[name].castEndTime = time + duration
                newState.cooldowns[name].baseChannelTime = baseChannelTime
                if(newState.casting && name !== newState.casting.name) {
                    newState.cooldowns[newState.casting.name].castStartTime = 0
                    newState.cooldowns[newState.casting.name].castEndTime = 0
                }
                newState.casting = {
                    duration,
                    name,
                    displayName,
                    direction: 0,
                    time
                }
                break
            case "ABILITY_CHANNEL_UPDATE":
                var {name} = payload
                newState.cooldowns[name].ticks--
                break
            case "ABILITY_CHANNEL_END":
                var {name} = payload
                newState.cooldowns[name].castStartTime = 0
                newState.cooldowns[name].castEndTime = 0
                newState.cooldowns[name].ticks = 0
                if(newState.casting && name === newState.casting.name) delete newState.casting
                break
            case "GLOBAL_COOLDOWN_START":
                newState.globalCooldown = payload.gcd
                newState.globalCooldownStartTime = payload.time
                break
            case "GLOBAL_COOLDOWN_END":
                newState.globalCooldown = 0
                newState.globalCooldownStartTime = 0
                break
            default:
                console.error(`Invalid action provided: ${action.type}`)
        }

        return newState

    }, defaultState)

    const globalCooldownRef = useRef(state.globalCooldown)
    globalCooldownRef.current = state.globalCooldown

    const globalCooldownStartTimeRef = useRef(state.globalCooldownStartTime)
    globalCooldownStartTimeRef.current = state.globalCooldownStartTime

    const handleKeyPress = (e) => {
        if(keyEventsPaused) return
        
        const now = Date.now()

        observersRef.current.forEach(o => {
            if(o.keybind === e.key) {
                const abilityCooldownRemaining = o.getRemainingCooldown()
                const globalCooldownRemaining = globalCooldownRef.current ? globalCooldownRef.current - (now - globalCooldownStartTimeRef.current) : 0
                const remaining = Math.max(abilityCooldownRemaining, globalCooldownRemaining)

                if(remaining > spellQueueWindow) return

                queueAbility(o.source, o.execute, remaining + 15)
            }
        })
    }

    const handleClick = (name, getRemainingCooldown, execute) => {
        const now = Date.now()

        const abilityCooldownRemaining = getRemainingCooldown()
        const globalCooldownRemaining = globalCooldownRef.current ? globalCooldownRef.current - (now - globalCooldownStartTimeRef.current) : 0
        const remaining = Math.max(abilityCooldownRemaining, globalCooldownRemaining)

        if(remaining > spellQueueWindow) return

        queueAbility(name, execute, remaining + 15)
    }

    const calculateCooldown = (cooldown) => {
        return cooldown/hasteRef.current
    }

    const triggerGlobalCooldown = () => {
        let gcd = Math.max(calculateCooldown(gcdLength), gcdLength/2)

        GlobalCooldown.start(gcd, triggerCooldown)

        setTimeout(() => {
            observersRef.current.forEach(o => o.notify())
        }, 0)
    }

    const subscribe = (observer) => {
        setObservers(o => [...o, observer])
    }

    const unsubscribe = (source) => {
        setObservers(obs => obs.filter(o => o.source !== source))
    }

    const getAbilityCooldown = (k) => {
        const ability = abilitySettings[k]
        const cooldown = ability.cooldown

        return ability.hasted ? calculateCooldown(cooldown) : cooldown
    }

    const getAbilityCastTime = (k) => {
        const ability = abilitySettings[k]
        const casttime = ability.casttime

        return ability.staticCastTime ? casttime : calculateCooldown(casttime)
    }

    const queueAbility = (name, execute, remaining) => {

        clearTimeout(spellQueueTimer.current)

        spellQueueTimer.current = setTimeout(() => {
            if(!observersRef.current.find(o => o.source === name)) return
            execute()
        }, remaining)
    }

    return (
        <div className="ability-bar-container">
        <div className="progress-bar-container">
            {state.casting ? <CastBar {...state.casting}/> : null}
        </div>
        <div className="ability-bar">
            {Object.keys(abilities)
            .map((k,i) => {
                if(abilities[k].disabled) return
                if(k === "void-bolt" && !inVoidformRef.current) return
                if(k === "void-eruption" && inVoidformRef.current) return
                return <ProgressAbility
                    name={k}
                    key={i}
                    {...abilities[k]}
                    {...state.cooldowns[k]}
                    settings={abilitySettings[k]}
                    cooldown={getAbilityCooldown(k)}
                    globalCooldown={state.globalCooldown}
                    globalCooldownStartTime={state.globalCooldownStartTime}
                    casttime={getAbilityCastTime(k)}
                    casting={state.casting && state.casting.time && state.casting.direction}
                    subscribe={subscribe}
                    unsubscribe={unsubscribe}
                    onExecute={triggerGlobalCooldown}
                    onAbilityUpdate={triggerCooldown}
                    onClick={handleClick}
                    triggerEvent={triggerEvent}
                    reset={reset}
                />
            })}
            </div>        
        </div>
    )
}

export default AbilityBar