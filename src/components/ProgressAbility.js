import React, {useState, useEffect} from 'react';
import "./ProgressAbility.css"

const ProgressAbility = function (props) {

    //each ability needs its own separate timer

    const {name, radius, stroke, cooldown, startTime, icon, casttime, maxCharges, keybind, subscribe, unsubscribe, onExecute, onAbilityUpdate, id} = props
    const interval = 50
    const normalizedRadius = radius - (stroke/2)
    const circumference = normalizedRadius * 2 * Math.PI

    const [onCooldown, setOnCooldown] = useState(false)
    const [charges, setCharges] = useState(maxCharges || 1)
    //let [progress, setProgress] = useState(cooldown)
    const [strokeDashoffset, setStrokeDashoffset] = useState(circumference)

    const calculateStrokeDashoffset = (progress, onCooldown, cooldown) => circumference + (!onCooldown ? 0 : (progress / cooldown)) * circumference

    let timer

    useEffect(() => {
        subscribe({
            source: id,
            keybind,
            notify: startCooldown,
            execute: useAbility
        })

<<<<<<< Updated upstream
        return (id) => unsubscribe(id)
    })

    //start cooldown is the notify function for observer pattern
    //need to subscribe start cooldown to the ability bar
=======
        return (id) => {
            console.log("Inside rerender for: " + name)
            clearInterval(timer)
            unsubscribe(id)
        }
    }, [startTime])
>>>>>>> Stashed changes

    const startCooldown = (cooldown, source = id) => {

        //if source is id then this ability triggered the gcd event

        console.log(id + " is" + (startTime ? " " : " not ") + "on cooldown")

        if(startTime) return

<<<<<<< Updated upstream
        let d = new Date()
        let time = d.getTime()

        console.log("Start time for " + id + " is " + time)

        //progress is the gcd or the cooldown

        let progress = cooldown
=======
        //let progress = cooldown
>>>>>>> Stashed changes

        if(source == id) setCharges(charges => charges-1)

        let timer = setInterval(() => {
            let progress = (startTime + cooldown) - Date.now()
            console.log(startTime)
            console.log(progress)
            console.log(timer)
            if(progress <= interval) {
                clearInterval(timer)
                onAbilityUpdate({
                    type: "ABILITY_OFF_COOLDOWN",
                    payload: name
                })
                if(source == id) setCharges(charges => charges+1)
                setStrokeDashoffset(circumference)
            }
            setStrokeDashoffset(calculateStrokeDashoffset(progress, true, cooldown))
        }, interval)

        onAbilityUpdate({
            type: "ABILITY_ON_COOLDOWN",
            payload: name
        })  
    }

    const startCast = () => {
        if(startTime) return
        setTimeout(() => {
            onAbilityUpdate({
                type: "ABILITY_END_CAST",
                payload: name
            })
            startCooldown(cooldown)
        }, casttime)

        console.log("A cast is triggering the gcd: " + id)

        onAbilityUpdate({
            type: "ABILITY_START_CAST",
            payload: name
        })
    }

    //casting a spell uses its cooldown
    //triggers global

    //the ability bar is the subject
    //each ability calls the ability bar's gcd function
    //ability bar notifies a spell when it is cast by keyboard

    const useAbility = () => {
        if(startTime) return
        //if no cast time and has charges then trigger global
        //if cast time start cast

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