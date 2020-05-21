import React, {useState, useReducer} from 'react';
import ProgressAbility from "./ProgressAbility"
import abilities from "../utils/abilities"
import "./AbilityBar.css"

const AbilityBar = (props) => {

    const gcdLength = 1500
    const {haste} = props
    let observers = []

    const [cooldowns, triggerCooldown] = useReducer((state, action) => {
        const name = action.payload
        const ability = abilities[name]

        let now = Date.now()
        console.log(now)

        console.log("Old state")
        console.log(state)

        switch(action.type) {
            case "ABILITY_COOLDOWN_START":
                console.log("Ability triggered an event: " + name, action.type)
                state[name] = {
                    startTime: now
                }
                break
            case "ABILITY_COOLDOWN_END":
                console.log("Ability triggered an event: " + name, action.type)
                state[name] = {
                    startTime: 0
                }
                break
            case "ABILITY_CAST_START":
                console.log("Ability triggered an event: " + name, action.type)
                state[name] = {
                    startTime: now
                }
                break
            case "ABILITY_CAST_END":
                console.log("Ability triggered an event: " + name, action.type)
                state[name] = {
                    startTime: 0
                }
                break
        }

        console.log("New state")
        console.log(state)

        return state
    }, {})

    const calculateCooldown = (cooldown) => {
        return cooldown/(1+haste)
    }

    const triggerGlobalCooldown = (source) => {
        //calculate haste

        let gcd = calculateCooldown(gcdLength)

        observers.forEach(o => {
            //console.log("Ability source is: " + source)
            //an ability can't trigger global cooldown while it's on cooldown
            if(o.source === source) return
            //console.log("Notifying child gcd triggered: " + o.source)
            o.notify(gcd, source)
        })
    }

    const subscribe = (observer) => {
        if(observers.find(o => o.source === observer.source)) return
        //console.log("Subscribing " + observer.source)
        observers.push(observer)

        //set up key press
        document.onkeypress = (e) => {
            observers.forEach(o => {
                if(o.keybind === e.key) o.execute()
            })
        }
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
            cooldown={abilities[k].hasted ? calculateCooldown(abilities[k].cooldown) : abilities[k].cooldown}
            startTime={(cooldowns[abilities[k]] && cooldowns[abilities[k]].startTime) || 0}
            maxCharges={abilities[k].charges} 
            keybind={abilities[k].keybind}
            icon = {abilities[k].icon}
            casttime = {calculateCooldown(abilities[k].casttime)}
            subscribe={subscribe}
            unsubscribe={unsubscribe}
            onExecute={triggerGlobalCooldown}
            onAbilityUpdate={triggerCooldown}
            id={i}
            />)}
        </div>
    )
}

export default AbilityBar