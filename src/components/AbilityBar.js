import React, {useState, useEffect, useReducer, useRef} from 'react';
import ProgressAbility from "./ProgressAbility"
import GlobalCooldown from "./GlobalCooldown"
import CastBar from "./CastBar"
import abilities from "../utils/abilities"
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

    // const abilitySettingsRef = useRef(abilitySettings)
    // abilitySettingsRef.current = abilitySettings

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

    //const [currentAbilities, setCurrentAbilities] = useState(defaultAbilities())
    const [observers, setObservers] = useState([])

    const observersRef = useRef(observers)
    observersRef.current = observers

    const defaultState = {
        globalCooldown: 0,
        cooldowns: defaultCooldowns()
    }

    useEffect(() => {
        document.addEventListener("keypress", handleKeyPress)

        return () => document.removeEventListener("keypress", handleKeyPress)
    }, [abilities, keyEventsPaused])

    const [state, triggerCooldown] = useReducer((oldState, action) => {
        const newState = JSON.parse(JSON.stringify(oldState))
        const payload = action.payload

        switch(action.type) {
            case "ABILITY_CAST_SUCCESS":
                var {name} = payload
                if(newState.casting && name === "void-bolt" && newState.casting.name === "mind-flay") {
                    console.log("Mind flay currently being channeled")
                    console.log("Void bolt cast")
                    console.log("Void bolt rank 2 engage!")
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
                var {name, time, duration} = payload
                newState.cooldowns[name].castStartTime = time
                newState.cooldowns[name].castEndTime = time + duration
                if(newState.casting) {
                    newState.cooldowns[newState.casting.name].castStartTime = 0
                    newState.cooldowns[newState.casting.name].castEndTime = 0
                }
                newState.casting = {
                    duration,
                    name,
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
                var {name, time, duration, baseChannelTime} = payload
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

        //console.log(e.key)

        if(globalCooldownRef.current || keyEventsPaused) return

        observersRef.current.forEach(o => {
            console.log(o.keybind)
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
        <div className="progress-bar-container">{state.casting ? <CastBar {...state.casting}/> : null}</div>
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
                type={abilitySettings[k].type}
                cooldown={getAbilityCooldown(k)}
                globalCooldown={state.globalCooldown}
                globalCooldownStartTime={state.globalCooldownStartTime}
                resource={abilitySettings[k].resource}
                maxCharges={abilitySettings[k].charges} 
                casttime ={calculateCooldown(abilitySettings[k].casttime)}
                ticks={abilitySettings[k].ticks}
                subscribe={subscribe}
                unsubscribe={unsubscribe}
                onExecute={triggerGlobalCooldown}
                onAbilityUpdate={triggerCooldown}
                triggerEvent={triggerEvent}
                id={k}
            />})}
            </div>        
        {state.globalCooldown? <GlobalCooldown duration={state.globalCooldown} triggerEvent={triggerCooldown}/> : null}
        </div>
    )
}

export default AbilityBar