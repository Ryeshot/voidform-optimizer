import React, {useState, useEffect, useReducer, useRef} from 'react';
import ProgressAbility from "./ProgressAbility"
import GlobalCooldown from "./GlobalCooldown"
import CastBar from "./CastBar"
import abilities from "../utils/abilities"
import "./AbilityBar.css"

const AbilityBar = (props) => {

    const gcdLength = 1500
    const {abilitySettings, haste, triggerEvent} = props

    const hasteRef = useRef(haste)
    hasteRef.current = haste

    const abilitySettingsRef = useRef(abilitySettings)
    abilitySettingsRef.current = abilitySettings

    const defaultCooldowns = () => {
        const cooldowns = {}
        Object.keys(abilities).forEach(k => {
            if(abilitySettingsRef.current[k].disabled) return
            cooldowns[k] = {
                startTime: 0,
                onGlobalCooldown: false
            }
        })

        return cooldowns
    }

    const defaultAbilities = () => {
        const defaultAbilities = {}

        Object.keys(abilities).forEach(k => {
            if(abilitySettingsRef.current[k].disabled) return

            defaultAbilities[k] = {
                ...abilitySettings[k],
                ...abilities[k]
            }
        })

        return defaultAbilities
    }

    const [currentAbilities, setCurrentAbilities] = useState(defaultAbilities())
    const [observers, setObservers] = useState([])

    const observersRef = useRef(observers)
    observersRef.current = observers

    const defaultState = {
        globalCooldown: 0,
        cooldowns: defaultCooldowns()
    }

    useEffect(() => {
        console.log("Inside use effect")
        document.addEventListener("keypress", handleKeyPress, {once: true})

        return () => document.removeEventListener("keypress", handleKeyPress)
    }, [abilitySettings])

    const [state, triggerCooldown] = useReducer((oldState, action) => {
        const newState = JSON.parse(JSON.stringify(oldState))
        const payload = action.payload

        switch(action.type) {
            case "ABILITY_COOLDOWN_START":
                // console.log(action.type)
                // console.log(action.payload)
                var {name, time} = payload
                newState.cooldowns[name].startTime = time
                if(newState.casting && name !== newState.casting.name) delete newState.casting
                break
            case "ABILITY_COOLDOWN_END":
                var {name, time} = payload
                newState.cooldowns[name].startTime = 0
                break
            // case "ABILITY_COOLDOWN_UPDATE":
            //     var {name, cooldown} = payload
            //     newState.cooldowns[name].cooldown = cooldown
            //     break
            case "ABILITY_CAST_START":
                // console.log(action.type)
                // console.log(action.payload)
                var {name, time, duration} = payload
                newState.cooldowns[name].castStartTime = time
                newState.cooldowns[name].castEndTime = time + duration
                newState.casting = {
                    duration,
                    name,
                    direction: 1,
                    time
                }
                break
            case "ABILITY_CAST_END":
                var {name} = payload
                // console.log(action.type)
                // console.log(action.payload)
                newState.cooldowns[name].castStartTime = 0
                newState.cooldowns[name].castEndTime = 0
                if(newState.casting && name === newState.casting.name) delete newState.casting
                break
            case "ABILITY_CHANNEL_START":
                console.log(action.type)
                console.log(action.payload)
                var {name, time, duration, castEndTime} = payload
                newState.cooldowns[name].castStartTime = time
                newState.cooldowns[name].castEndTime = time + duration
                newState.casting = {
                    duration,
                    name,
                    direction: 0,
                    time
                }
                break
            case "ABILITY_CHANNEL_END":
                var {name} = payload
                // console.log(action.type)
                // console.log(action.payload)
                newState.cooldowns[name].castStartTime = 0
                newState.cooldowns[name].castEndTime = 0
                if(newState.casting && name === newState.casting.name) delete newState.casting
                break
            case "GLOBAL_COOLDOWN_START":
                //console.log(newState)
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

    const handleKeyPress = (e) => {

        observersRef.current.forEach(o => {
            if(o.keybind === e.key) {
                o.execute()
            }
        })

        setTimeout(() => {
            document.addEventListener("keypress", handleKeyPress, {once: true})
        }, 200)
    }

    const calculateCooldown = (cooldown) => {
        return cooldown/hasteRef.current
    }

    const triggerGlobalCooldown = (source, cooldown, type) => {
        let gcd = Math.max(calculateCooldown(gcdLength), gcdLength/2)

        triggerCooldown({
            type: "GLOBAL_COOLDOWN_START",
            payload: {
                source,
                gcd,
                cooldown,
                type,
                time: Date.now()
            }
        })

        observersRef.current.forEach(o => o.notify())
    }

    const subscribe = (observer) => {
        setObservers(o => [...o, observer])
    }

    const unsubscribe = (source) => {
        setObservers(obs => obs.filter(o => o.source !== source))
    }

    const getAbilityCooldown = (k) => {
        const ability = currentAbilities[k]

        return ability.hasted ? calculateCooldown(ability.cooldown) : ability.cooldown
    }

    return (
        <div className="ability-bar">
        <div className="progress-bar-container">{state.casting ? <CastBar {...state.casting}/> : null}</div>        
        {Object.keys(currentAbilities)
        .map((k,i) => <ProgressAbility
            name={k}
            key={i}
            cooldown={getAbilityCooldown(k)}
            globalCooldown={state.globalCooldown}
            globalCooldownStartTime={state.globalCooldownStartTime}
            type={currentAbilities[k].type}
            resource={currentAbilities[k].resource}
            startTime={state.cooldowns[k].startTime}
            castStartTime={state.cooldowns[k].castStartTime}
            castEndTime={state.cooldowns[k].castEndTime}
            maxCharges={currentAbilities[k].charges} 
            keybind={currentAbilities[k].keybind}
            icon={currentAbilities[k].icon}
            casttime = {calculateCooldown(currentAbilities[k].casttime)}
            subscribe={subscribe}
            unsubscribe={unsubscribe}
            onExecute={triggerGlobalCooldown}
            onAbilityUpdate={triggerCooldown}
            triggerEvent={triggerEvent}
            id={k}
        />)}
        {state.globalCooldown? <GlobalCooldown duration={state.globalCooldown} triggerEvent={triggerCooldown}/> : null}
        </div>
    )
}

export default AbilityBar