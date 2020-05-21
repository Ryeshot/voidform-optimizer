import React, {useState, useEffect} from 'react';
import "./ProgressAbility.css"

const ProgressAbility = (props) => {

    //each ability needs its own separate timer

    const {radius, stroke, cooldown, icon, casttime, keybind, subscribe, unsubscribe, onCast, id} = props
    const interval = 50
    const normalizedRadius = radius - (stroke/2)
    const circumference = normalizedRadius * 2 * Math.PI

    const [casting, setCasting] = useState(false)
    const [onCooldown, setOnCooldown] = useState(false)
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

    const startCooldown = (source, progress) => {

        //start time means the spell itself is on cooldown

        console.log(id + " is" + (onCooldown ? " " : " not ") + "on cooldown")

        if(onCooldown) return

        let d = new Date()
        let time = d.getTime()
        let cooldown = progress

        console.log("Start time for " + id + " is " + time)

        //progress is the gcd or the cooldown

        setOnCooldown(true)

        let timer = setInterval(() => {
            if(progress <= interval) {
                clearInterval(timer)
                setOnCooldown(false)
                setStrokeDashoffset(circumference)
            }
            progress = progress-interval
            setStrokeDashoffset(calculateStrokeDashoffset(progress, true, cooldown))
        }, interval)

        //if the spell that triggered the global cooldown was this one and it is instant
        if(source === id && !casttime) {
            console.log("An insant ability triggered the gcd: " + source)
            
            onCast(source)
        }
    }

    const startCast = () => {
        if(casting || onCooldown) return
        setCasting(true)
        setTimeout(() => {
            startCooldown(id, cooldown)
            setCasting(false)
        }, casttime)

        console.log("A cast is triggering the gcd: " + id)

        onCast(id)
    }

    //casting a spell uses its cooldown
    //triggers global

    //the ability bar is the subject
    //each ability calls the ability bar's gcd function
    //ability bar notifies a spell when it is cast by keyboard

    const useAbility = () => {
        casttime ? startCast() : startCooldown(id, cooldown)
    }

    return (
        <div className="progress-ability" onClick={useAbility}>
        <svg width={radius/2} height={radius/2}>
            <image
                href={icon}
                width={radius/2}
                height={radius/2}
            />
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
        </div>
    )

}

export default ProgressAbility;