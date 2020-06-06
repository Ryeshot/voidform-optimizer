import React, {useState, useEffect, useReducer, useRef} from 'react';
import ProgressAbility from "./ProgressAbility"
import GlobalCooldown from "./GlobalCooldown"
import CastBar from "./CastBar"
import "./AbilityBar.css"

const AbilityBar = (props) => {

    const gcdLength = 1500
    const {abilitySettings, abilities, haste, canEnterVoidform, inVoidform, triggerEvent, keyEventsPaused} = props

    const hasteRef = useRef(haste)
    hasteRef.current = haste

    const canEnterVoidformRef = useRef(canEnterVoidform)
    canEnterVoidformRef.current = canEnterVoidform

    const inVoidformRef = useRef(inVoidform)
    inVoidformRef.current = inVoidform 

    const defaultCooldowns = () => {
        const cooldowns = {}
        Object.keys(abilities).forEach(k => {
            if(abilitySettings[k] && abilitySettings[k].disabled) return
            cooldowns[k] = {
                startTime: 0,
                onGlobalCooldown: false
            }
        })

        return cooldowns
    }

    const [observers, setObservers] = useState([])

    const observersRef = useRef(observers)
    observersRef.current = observers

    const defaultState = {
        globalCooldown: 0,
        cooldowns: defaultCooldowns()
    }

    useEffect(() => {
        document.addEventListener("keypress", handleKeyPress)

        return () => {
            document.removeEventListener("keypress", handleKeyPress)
        }
    }, [abilities, keyEventsPaused, abilitySettings])

    const [state, triggerCooldown] = useReducer((oldState, action) => {
        const newState = JSON.parse(JSON.stringify(oldState))
        const payload = action.payload

        switch(action.type) {
            case "ABILITY_CAST_SUCCESS":
                var {name} = payload
                if(abilitySettings["void-bolt"].rankTwo && newState.casting && name === "void-bolt" && newState.casting.name === "mind-flay") {
                    break
                }
                if(newState.casting && name !== newState.casting.name) {
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
            case "ABILITY_CAST_END":
                var {name} = payload
                newState.cooldowns[name].castStartTime = 0
                newState.cooldowns[name].castEndTime = 0
                if(newState.casting && name === newState.casting.name) delete newState.casting
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

    const handleKeyPress = (e) => {

        if(keyEventsPaused || globalCooldownRef.current) return

        observersRef.current.forEach(o => {
            if(o.keybind === e.key) {
                o.execute()
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

        return ability.hasted ? calculateCooldown(ability.cooldown) : ability.cooldown
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
                    settings={abilitySettings[k]}
                    cooldown={getAbilityCooldown(k)}
                    globalCooldown={state.globalCooldown}
                    globalCooldownStartTime={state.globalCooldownStartTime}
                    casttime={calculateCooldown(abilitySettings[k].casttime)}
                    casting={!!(state.casting && state.casting.time && state.casting.direction)}
                    subscribe={subscribe}
                    unsubscribe={unsubscribe}
                    onExecute={triggerGlobalCooldown}
                    onAbilityUpdate={triggerCooldown}
                    triggerEvent={triggerEvent}
                    id={k}
                />
            })}
            </div>        
        {state.globalCooldown? <GlobalCooldown duration={state.globalCooldown} triggerEvent={triggerCooldown}/> : null}
        </div>
    )
}

export default AbilityBar