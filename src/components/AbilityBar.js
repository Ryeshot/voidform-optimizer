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
    const [voidformEntered, setVoidformEntered] = useState(false)

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
                console.log("Starting gcd...")
                newState.globalCooldown = payload.gcd
                newState.globalCooldownStartTime = payload.time
                break
            case "GLOBAL_COOLDOWN_END":
                console.log("Ending gcd...")
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
        const remaining = globalCooldownRef.current ? globalCooldownRef.current - (now - globalCooldownStartTimeRef.current) : 0

        if(remaining > spellQueueWindow) return

        observersRef.current.forEach(o => {
            if(o.keybind === e.key) {
                queueAbility(o.source, o.execute, remaining)
            }
        })
    }

    const calculateCooldown = (cooldown) => {
        return cooldown/hasteRef.current
    }

    const triggerGlobalCooldown = () => {
        let gcd = Math.max(calculateCooldown(gcdLength), gcdLength/2)

        triggerCooldown({
            type: "GLOBAL_COOLDOWN_START",
            payload: {
                gcd,
                time: Date.now()
            }
        })

        // setTimeout(() => {
        //     observersRef.current.forEach(o => o.notify())
        // }, 0)
    }

    const notifyGlobalCooldown = () => {
        observersRef.current.forEach(o => o.notify())
    }

    const subscribe = (observer) => {
        setObservers(o => [...o, observer])
    }

    const unsubscribe = (source) => {
        setObservers(obs => obs.filter(o => o.source !== source))
    }

    const getAbilityCooldown = (k) => {
        const ability = abilitySettings[k]
        let cooldown = ability.cooldown

        if(inVoidformRef.current && k === "mind-blast") {
            let cdr = ability.cdr 
            if(!voidformEntered) {
                setVoidformEntered(true)
                const now = Date.now()
                const startTime = state.cooldowns[k].startTime
                const remaining = startTime ? now - startTime : cooldown
                cdr *= remaining/cooldown
            }
            cooldown -= cdr
        }

        if(!inVoidformRef.current && voidformEntered)
            setVoidformEntered(false)

        return ability.hasted ? calculateCooldown(cooldown) : cooldown
    }

    const queueAbility = (name, execute, remaining) => {

        clearTimeout(spellQueueTimer.current)

        console.log("End time for ability queue: " + (Date.now() + remaining + 50))

        spellQueueTimer.current = setTimeout(() => {
            console.log("Timer ended: " + spellQueueTimer.current)
            // triggerCooldown({
            //     type: "EXECUTE_PENDING",
            //     payload: {
            //         name
            //     }
            // })
            execute()
        }, remaining + 50)

        //console.log(remaining)

        //console.log("Queueing timer: " + spellQueueTimer.current)
        //console.log("For ability: " + name)
    }

    return (
        <div className="ability-bar-container">
        {state.casting ? <CastBar {...state.casting}/> : null}
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
                    executeStatus={state.status[k]}
                    settings={abilitySettings[k]}
                    cooldown={getAbilityCooldown(k)}
                    globalCooldown={state.globalCooldown}
                    globalCooldownStartTime={state.globalCooldownStartTime}
                    casttime={calculateCooldown(abilitySettings[k].casttime)}
                    casting={state.casting && state.casting.time && state.casting.direction}
                    subscribe={subscribe}
                    unsubscribe={unsubscribe}
                    onExecute={triggerGlobalCooldown}
                    onAbilityUpdate={triggerCooldown}
                    triggerEvent={triggerEvent}
                    reset={reset}
                />
            })}
            </div>        
        {state.globalCooldown? <GlobalCooldown duration={state.globalCooldown} triggerEvent={triggerCooldown} onBegin={notifyGlobalCooldown}/> : null}
        </div>
    )
}

export default AbilityBar