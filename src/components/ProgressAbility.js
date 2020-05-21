import React, {useState} from 'react';
import "./ProgressAbility.css"

const ProgressAbility = (props) => {

    //each ability needs its own separate timer

    const {radius, stroke, cooldown, icon, casttime, keybind} = props
    const interval = 50
    const normalizedRadius = radius - (stroke/2)
    const circumference = normalizedRadius * 2 * Math.PI

    let casting = false
    let [startTime, setStartTime] = useState(0)
    //let [progress, setProgress] = useState(cooldown)
    let [strokeDashoffset, setStrokeDashoffset] = useState(circumference)

    const calculateStrokeDashoffset = (progress, time) => circumference + (time === 0 ? 0 : (progress / cooldown)) * circumference

    //start cooldown is the notify function for observer pattern
    //need to subscribe start cooldown to the ability bar

    const handleKeyPress = (e) => {
        console.log("Key pressed!")

        e.preventDefault()

        console.log(e)
    }

    const startCooldown = () => {

        //start time means the spell itself is on cooldown
        if(startTime !== 0 ) return

        let d = new Date()
        let time = d.getTime()

        //progress is the gcd or the cooldown

        let progress = cooldown

        setStartTime(time)

        let timer = setInterval(() => {
            if(progress <= interval) {
                clearInterval(timer)
                setStartTime(0)
                setStrokeDashoffset(circumference)
            }
            progress = progress-interval
            setStrokeDashoffset(calculateStrokeDashoffset(progress, time))
        }, interval)
    }

    const startCast = () => {
        if(casting || startTime !== 0) return
        casting = true
        setTimeout(() => {
            startCooldown()
            casting = false
        }, casttime)
    }

    //casting a spell uses its cooldown
    //triggers global

    //the ability bar is the subject
    //each ability calls the ability bar's gcd function
    //ability bar notifies a spell when it is cast by keyboard

    const useAbility = () => {
        casttime ? startCast() : startCooldown()
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