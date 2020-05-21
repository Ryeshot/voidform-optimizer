import React, {useState} from 'react';
import ProgressAbility from "./ProgressAbility"
import abilities from "../utils/abilities"
import "./AbilityBar.css"

const AbilityBar = (props) => {

    const gcdLength = 1500

    //let [globalCooldown, setGlobalCooldown] = useState(gcdLength)

    const calculateCooldown = (cooldown) => {
        return cooldown
    }

    // const triggerGlobalCooldown = () => {
    //     let time = new Date().getTime()

    //     //calculate haste

    //     setGlobalCooldown(time + gcdLength)
    // }

    return (
        <div className="ability-bar">
        {Object.keys(abilities)
        .map(k => <ProgressAbility 
            radius={100} 
            stroke={100} 
            cooldown={calculateCooldown(abilities[k].cooldown)} 
            icon = {abilities[k].icon}
            casttime = {abilities[k].casttime}
            />)}
        </div>
    )
}

export default AbilityBar