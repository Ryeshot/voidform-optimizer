import React, {useState, useEffect, useReducer, useRef} from 'react';
import ProgressAbility from "./ProgressAbility"
import GlobalCooldown from "./GlobalCooldown"
import abilities from "../utils/abilities"
import "./AbilityBar.css"

const AbilityBar = (props) => {

    const gcdLength = 1500
    const {haste, triggerEvent} = props
    let observers = []

    const hasteRef = useRef(haste)
    hasteRef.current = haste

    const defaultCooldowns = () => {
        const cooldowns = {}
        Object.keys(abilities).forEach(k => {
            cooldowns[k] = {
                startTime: 0,
                onGlobalCooldown: false
            }
        })

        return cooldowns
    }

    const getAbilityCooldown = (k) => {
        const ability = abilities[k]
        
        if(state.cooldowns[k].onGlobalCooldown) return state.globalCooldown

        return ability.hasted ? calculateCooldown(ability.cooldown) : ability.cooldown
    }

    const defaultState = {
        globalCooldown: 0,
        cooldowns: defaultCooldowns()
    }

    useEffect(() => {
        document.addEventListener("keypress", handleKeyPress, {once: true})
        return () => document.removeEventListener("keypress", handleKeyPress)
    }, [])

    const [state, triggerCooldown] = useReducer((oldState, action) => {
        const newState = JSON.parse(JSON.stringify(oldState))
        const payload = action.payload

        switch(action.type) {
            case "ABILITY_COOLDOWN_START":
                var {name, time} = payload
                newState.cooldowns[name].startTime = time
                break
            case "ABILITY_COOLDOWN_END":
                var {name, time} = payload
                newState.cooldowns[name].startTime = 0
                break
            case "ABILITY_COOLDOWN_UPDATE":
                var {name, cooldown} = payload
                newState.cooldowns[name].cooldown = cooldown
                break
            case "ABILITY_CAST_START":
                var {name, time} = payload
                newState.cooldowns[name].startTime = time
                break
            case "ABILITY_CAST_END":
                var {name, time} = payload
                newState.cooldowns[name].startTime = 0
                break
            case "GLOBAL_COOLDOWN_START":
                //console.log(newState)
                newState.globalCooldown = payload.gcd
                Object.keys(newState.cooldowns).forEach(k => {
                    //need to determine if any abilities currently on cooldown have a cooldown less than the global
                    let cooldown = newState.cooldowns[k].cooldown
                    let startTime = newState.cooldowns[k].startTime
                    let isSource = k === payload.source
                    let cooldownMoreThanGcd = (startTime + cooldown) > payload.time + payload.gcd
                  
                    //source which triggered the global has a cooldown
                    if(isSource && payload.cooldown) return
                    if(!isSource && cooldownMoreThanGcd) return                
                    newState.cooldowns[k].onGlobalCooldown = true
                    newState.cooldowns[k].startTime = payload.time
                })
                // console.log("Old state")
                // console.log(oldState)
                // console.log("New state")
                // console.log(newState.cooldowns)
                break
            case "GLOBAL_COOLDOWN_END":
                newState.globalCooldown = 0
                Object.keys(newState.cooldowns).filter(k => newState.cooldowns[k].onGlobalCooldown).forEach(k => {
                    newState.cooldowns[k].onGlobalCooldown = false
                    newState.cooldowns[k].startTime = 0
                })
                break
            default:
                console.error(`Invalid action provided: ${action.type}`)
        }

        return newState

    }, defaultState)

    const handleKeyPress = (e) => {

        observers.forEach(o => {
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

    const triggerGlobalCooldown = (source, cooldown) => {
        let gcd = Math.max(calculateCooldown(gcdLength), gcdLength/2)

        observers.forEach(o => o.notify())

        triggerCooldown({
            type: "GLOBAL_COOLDOWN_START",
            payload: {
                source,
                gcd,
                cooldown,
                time: Date.now()
            }
        })
    }

    const subscribe = (observer) => {
        if(observers.find(o => o.source === observer.source)) return
        observers.push(observer)
    }

    const unsubscribe = (source) => {
        observers = observers.filter(o => o.source !== source)
    }

    return (
        <div className="ability-bar">
        {Object.keys(abilities)
        .map((k,i) => <ProgressAbility
            name={k}
            key={i}
            radius={100} 
            stroke={100} 
            cooldown={getAbilityCooldown(k)}
            resource={abilities[k].resource}
            startTime={state.cooldowns[k].startTime}
            maxCharges={abilities[k].charges} 
            keybind={abilities[k].keybind}
            icon = {abilities[k].icon}
            casttime = {calculateCooldown(abilities[k].casttime)}
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