import React, {useState, useEffect} from 'react';
import "./ProgressAbility.css"

const ProgressAbility = (props) => {

    const {name, radius, stroke, cooldown, resource, startTime, icon, casttime, maxCharges, keybind, subscribe, unsubscribe, onExecute, onAbilityUpdate, triggerEvent, id} = props
    const interval = 50
    const normalizedRadius = radius - (stroke/2)
    const circumference = normalizedRadius * 2 * Math.PI

    const [charges, setCharges] = useState(maxCharges || 1)
    const [strokeDashoffset, setStrokeDashoffset] = useState(circumference)

    const calculateStrokeDashoffset = (progress, onCooldown, cooldown) => circumference + (!onCooldown ? 0 : (progress / cooldown)) * circumference

    useEffect(() => {
        subscribe({
            source: id,
            keybind,
            notify: startCooldown,
            execute: useAbility
        })

        return (id) => unsubscribe(id)
    }, [startTime])

    const startCooldown = (cooldown, source = id) => {

        //console.log("Inside start cooldown")

        //console.log(`Start time for ${name} is ${startTime}`)

        if(startTime) return

        let progress = cooldown

        if(source === id) setCharges(charges => charges-1)

        let timer = setInterval(() => {
            if(progress <= interval) {
                clearInterval(timer)
                onAbilityUpdate({
                    type: "ABILITY_COOLDOWN_END",
                    payload: name
                })
                if(source === id) setCharges(charges => charges+1)
                setStrokeDashoffset(circumference)
            }
            progress = progress-interval
            setStrokeDashoffset(calculateStrokeDashoffset(progress, true, cooldown))
        }, interval)

        onAbilityUpdate({
            type: "ABILITY_COOLDOWN_START",
            payload: name
        }) 

        if(resource && source === id) triggerEvent({
            type: "RESOURCE_UPDATE",
            payload: resource
        })
    }

    const startCast = () => {
        setTimeout(() => {
            onAbilityUpdate({
                type: "ABILITY_CAST_END",
                payload: name
            })
            startCooldown(cooldown)
        }, casttime)

        //console.log("A cast is triggering the gcd: " + id)

        onAbilityUpdate({
            type: "ABILITY_CAST_START",
            payload: name
        })
    }

    const useAbility = () => {
        //console.log("Preparing to use ability: " + id)
        if(startTime) return
        casttime ? startCast() : startCooldown(cooldown)
        onExecute(id)
    }

    return (
        <div className="progress-ability" onClick={useAbility}>
        <svg width={radius/2} height={radius/2}>
            <image
                className={charges > 0 ? "full" : "desaturated"}
                href={icon}
                width={radius/2}
                height={radius/2}
            />
            <text
                className="charge-text"
                x="35"
                y="45"
                fill="white"
            >
                {maxCharges > 1 ? charges : ""}
            </text>
            {/* <div className="charge-text"></div> */}
            <circle 
                fill="transparent"
                strokeWidth={stroke}
                strokeOpacity={.7}
                strokeDasharray={circumference + " " + circumference}
                strokeDashoffset={strokeDashoffset}
                stroke={"rgb(0,0,0)"}
                cx={radius/4}
                cy={radius/4}
                r={normalizedRadius} />
        </svg>
        <div>{keybind.match(/[a-zA-Z]/) ? keybind.toUpperCase() : keybind}</div>
        </div>
    )
}

export default ProgressAbility;