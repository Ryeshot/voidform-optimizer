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

        console.log("Ability triggered an event: " + name, action.type)

        switch(action.type) {
            case "ABILITY_COOLDOWN_START":
                var {name, time} = payload
                newState.cooldowns[name].startTime = time
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
                var {name, time} = payload
                newState.cooldowns[name].startTime = time
                break
            case "ABILITY_CAST_END":
                var {name, time} = payload
                newState.cooldowns[name].startTime = 0
                break
            case "GLOBAL_COOLDOWN_START":
                newState.globalCooldown = payload.gcd
                Object.keys(newState.cooldowns).forEach(k => {
                    //need to determine if any abilities currently on cooldown have a cooldown less than the global
                    let cooldown = getAbilityCooldown(k)
                    let startTime = newState.cooldowns[k]
                    let isSource = k === payload.source
                    let cooldownMoreThanGcd = (startTime + cooldown) > payload.time + payload.gcd
                  
                    //source which triggered the global has a cooldown
                    if(isSource && payload.cooldown) return
                    if(!isSource && cooldownMoreThanGcd) return                
                    newState.cooldowns[k].onGlobalCooldown = true
                    newState.cooldowns[k].startTime = payload.time
                })
                console.log("Old state")
                console.log(oldState)
                console.log("New state")
                console.log(newState.cooldowns)
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

    var getAbilityCooldown = (k) => {
        const ability = abilities[k]
        
        if(state.cooldowns[k].onGlobalCooldown) return state.globalCooldown

        return ability.hasted ? calculateCooldown(ability.cooldown) : ability.cooldown
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
            startTime={cooldowns[abilities[k]] || 0}
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