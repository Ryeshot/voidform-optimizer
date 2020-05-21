import React, {useState} from 'react';
import ProgressAbility from "./ProgressAbility"
import abilities from "../utils/abilities"
import "./AbilityBar.css"

const AbilityBar = (props) => {

    const gcdLength = 1500
    const haste = .5
    let observers = []
    let [globalCooldown, setGlobalCooldown] = useState(gcdLength)

    const calculateCooldown = (cooldown) => {
        return cooldown/(1+haste)
    }

    const triggerGlobalCooldown = (source) => {
        //calculate haste

        console.log(observers)

        let gcd = calculateCooldown(gcdLength)

        observers.forEach(o => {
            console.log("Ability source is: " + source)
            //an ability can't trigger global cooldown while it's on cooldown
            if(o.source === source) return
            console.log("Notifying child gcd triggered: " + o.source)
            o.notify(gcd, source)
        })
    }

    const subscribe = (observer) => {
        if(observers.find(o => o.source === observer.source)) return
        console.log("Subscribing " + observer.source)
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
            key={i}
            radius={100} 
            stroke={100} 
            cooldown={calculateCooldown(abilities[k].cooldown)}
            maxCharges={abilities[k].charges} 
            keybind={abilities[k].keybind}
            icon = {abilities[k].icon}
            casttime = {abilities[k].casttime}
            subscribe={subscribe}
            unsubscribe={unsubscribe}
            onExecute={triggerGlobalCooldown}
            id={i}
            />)}
        </div>
    )
}

export default AbilityBar