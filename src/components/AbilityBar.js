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

    const [hasReset, setHasReset] = useState(reset)

    useEffect(() => {
        triggerCooldown({
            type: "RESET"
        })

        return () => setHasReset(reset)
    }, [reset])

    useEffect(() => {
        const name = "mind-blast"
        const ability = abilitySettings[name]
        const duration = getAbilityCooldown(name)
        let cdr = ability.cdr * (inVoidform && -1 || 1)
        ability.cooldown += cdr

        const startTime = state.cooldowns[name].startTime
        if(!startTime || hasReset === reset) return
        cdr = getAbilityCooldown(name) - duration
        const now = Date.now()
        const remaining = (startTime + duration) - now
        const remainingPercent = remaining/duration
        const remainingCdr = remainingPercent * cdr

        triggerCooldown({
            type: "ABILITY_COOLDOWN_START",
            payload: {
                name,
                time: startTime + remainingCdr - cdr
            }
        })

    }, [inVoidform])

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress)
        document.addEventListener("keypress", handleKeyPress)

        return () => {
            document.removeEventListener("keydown", handleKeyPress)
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
                var {name, displayName, time, duration, baseChannelTime, currentTicks} = payload
                var ability = newState.cooldowns[name]

                newState.cooldowns[name] = {
                    ...ability,
                    castStartTime: time,
                    castEndTime: time + duration,
                    baseChannelTime,
                    currentTicks
                }

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
                newState.cooldowns[name].currentTicks--
                break
            case "ABILITY_CHANNEL_END":
                var {name} = payload
                var ability = newState.cooldowns[name]

                newState.cooldowns[name] = {
                    ...ability,
                    castStartTime: 0,
                    castEndTime: 0,
                    currentTicks: 0
                }
                if(newState.casting && name === newState.casting.name) delete newState.casting
                break
            case "GLOBAL_COOLDOWN_START":
                newState.globalCooldown = payload.gcd
                newState.globalCooldownStartTime = payload.time
                break
            case "GLOBAL_COOLDOWN_END":
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
                e.preventDefault()
                const abilityCooldownRemaining = o.getRemainingCooldown()
                const globalCooldownRemaining = globalCooldownRef.current ? globalCooldownRef.current - (now - globalCooldownStartTimeRef.current) : 0
                const remaining = o.ignoresGcd ? 0 : Math.max(abilityCooldownRemaining, globalCooldownRemaining)

                if(remaining > spellQueueWindow) return

                queueAbility(o.source, o.execute, remaining + 15)
            }
        })
    }

    const handleClick = (name, getRemainingCooldown, execute, ignoresGcd) => {
        const now = Date.now()

        const abilityCooldownRemaining = getRemainingCooldown()
        const globalCooldownRemaining = globalCooldownRef.current ? globalCooldownRef.current - (now - globalCooldownStartTimeRef.current) : 0
        const remaining = ignoresGcd ? 0 : Math.max(abilityCooldownRemaining, globalCooldownRemaining)

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

    const makeGroupChunks = (size) => (chunks, curr, i) => {
        const index = Math.floor(i/size)
        chunks[index] = [...chunks[index] || [], curr]
        return chunks
    }

    const disabledAbilities = (k) => {
        if(abilities[k].disabled) return false
        if(k === "void-bolt" && !inVoidformRef.current) return false
        if(k === "void-eruption" && inVoidformRef.current) return false

        return true
    }

    const buildAbilityBar = (abilities) => {
        return Object.keys(abilities)
            .filter(disabledAbilities)
            .sort((k1, k2) => abilities[k1].index - abilities[k2].index)
            //.reduce(makeGroupChunks(8), [])
    }

    return (
    <div className="ability-bar-container">
        <div className="progress-bar-container">
            {state.casting ? <CastBar {...state.casting}/> : null}
        </div>
        <div className="ability-bar">
            {buildAbilityBar(abilities)
            .map(k => {
                return <ProgressAbility
                    name={k}
                    key={`ability-${k}`}
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