import React, {useState, useEffect, useReducer} from 'react';
import ProgressAbility from "./ProgressAbility"
import abilities from "../utils/abilities"
import "./AbilityBar.css"

const AbilityBar = (props) => {

    const gcdLength = 1500
    const {haste, triggerEvent} = props
    let observers = []

    useEffect(() => {
        document.addEventListener('keypress', handleKeyPress, {once: true})
        return () => document.removeEventListener('keypress', handleKeyPress)
    }, [])

    const [cooldowns, triggerCooldown] = useReducer((oldState, action) => {
        const name = action.payload
        const state = JSON.parse(JSON.stringify(oldState))

        let now = Date.now()

        switch(action.type) {
            case "ABILITY_COOLDOWN_START":
                state[name] = {
                    startTime: now
                }
                break
            case "ABILITY_COOLDOWN_END":
                state[name] = {
                    startTime: 0
                }
                break
            case "ABILITY_CAST_START":
                state[name] = {
                    startTime: now
                }
                break
            case "ABILITY_CAST_END":
                state[name] = {
                    startTime: 0
                }
                break
        }

        return state
    }, {})

    const handleKeyPress = (e) => {

        //console.log("Key pressed: " + e.key)

        observers.forEach(o => {
            if(o.keybind === e.key) {
                //console.log("Pressing ability: " + o.source)
                o.execute()
            }
        })

        setTimeout(() => {
            document.addEventListener("keypress", handleKeyPress, {once: true})
        }, 200)
    }

    const calculateCooldown = (cooldown) => {
        return cooldown/(1+haste)
    }

    const triggerGlobalCooldown = (source) => {
        //calculate haste

        let gcd = calculateCooldown(gcdLength)

        observers.forEach(o => {
            if(o.source === source) return
            o.notify(gcd, source)
        })
    }

    const subscribe = (observer) => {
        if(observers.find(o => o.source === observer.source)) return
        observers.push(observer)
    }

    const unsubscribe = (source) => {
        observers = observers.filter(o => o.source !== source)
    }

    const getStartTime = (k) => {

        let time = (cooldowns[k] && cooldowns[k].startTime) || 0

        //console.log(`Start time for ${k} is ${time}`)

        return time
    }

    return (
        <div className="ability-bar">
        {Object.keys(abilities)
        .map((k,i) => <ProgressAbility
            name={k}
            key={i}
            radius={100} 
            stroke={100} 
            cooldown={abilities[k].hasted ? calculateCooldown(abilities[k].cooldown) : abilities[k].cooldown}
            resource={abilities[k].resource}
            startTime={getStartTime(k)}
            maxCharges={abilities[k].charges} 
            keybind={abilities[k].keybind}
            icon = {abilities[k].icon}
            casttime = {calculateCooldown(abilities[k].casttime)}
            subscribe={subscribe}
            unsubscribe={unsubscribe}
            onExecute={triggerGlobalCooldown}
            onAbilityUpdate={triggerCooldown}
            triggerEvent={triggerEvent}
            id={i}
            />)}
        </div>
    )
}

export default AbilityBar