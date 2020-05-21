import React, {useState, useEffect} from 'react';
import "./ProgressAbility.css"

const ProgressAbility = function (props) {

    //each ability needs its own separate timer

    const {radius, stroke, cooldown, icon, casttime, maxCharges, keybind, subscribe, unsubscribe, onExecute, id} = props
    const interval = 50
    const normalizedRadius = radius - (stroke/2)
    const circumference = normalizedRadius * 2 * Math.PI

    const [casting, setCasting] = useState(false)
    const [onCooldown, setOnCooldown] = useState(false)
    const [charges, setCharges] = useState(maxCharges || 1)
    //let [progress, setProgress] = useState(cooldown)
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
    })

    //start cooldown is the notify function for observer pattern
    //need to subscribe start cooldown to the ability bar

    const startCooldown = (progress, source = id) => {

        //start time means the spell itself is on cooldown

        console.log(id + " is" + (onCooldown ? " " : " not ") + "on cooldown")

        if(onCooldown) return

        let d = new Date()
        let time = d.getTime()
        let cooldown = progress

        console.log("Start time for " + id + " is " + time)

        //progress is the gcd or the cooldown
        
        setOnCooldown(onCooldown => true)

        if(source == id) setCharges(charges => charges-1)

        let timer = setInterval(() => {
            if(progress <= interval) {
                clearInterval(timer)
                setOnCooldown(onCooldown => false)
                if(source == id) setCharges(charges => charges+1)
                setStrokeDashoffset(circumference)
            }
            progress = progress-interval
            setStrokeDashoffset(calculateStrokeDashoffset(progress, true, cooldown))
        }, interval)

        //if the spell that triggered the global cooldown was this one and it is instant
        //console.log("An insant ability triggered the gcd: " + source)
            
    }

    const startCast = () => {
        setCasting(casting => true)
        setTimeout(() => {
            startCooldown(cooldown)
            setCasting(casting => false)
        }, casttime)

        console.log("A cast is triggering the gcd: " + id)

    }

    //casting a spell uses its cooldown
    //triggers global

    //the ability bar is the subject
    //each ability calls the ability bar's gcd function
    //ability bar notifies a spell when it is cast by keyboard

    const useAbility = () => {
        if(casting || onCooldown) return

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