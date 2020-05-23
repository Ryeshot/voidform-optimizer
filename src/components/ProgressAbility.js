import React, {useState, useEffect, useRef} from 'react';
import "./ProgressAbility.css"

const ProgressAbility = (props) => {

    const {name, radius, stroke, cooldown, resource, startTime, icon, casttime, maxCharges, keybind, subscribe, unsubscribe, onExecute, onAbilityUpdate, triggerEvent, id} = props
    const interval = 50
    const normalizedRadius = radius - (stroke/2)
    const circumference = normalizedRadius * 2 * Math.PI

    const [charges, setCharges] = useState(maxCharges || 1)
    const [strokeDashoffset, setStrokeDashoffset] = useState(circumference)

    const calculateStrokeDashoffset = (progress, onCooldown, cooldown) => circumference + (!onCooldown ? 0 : (progress / cooldown)) * circumference

    const startTimeRef = useRef(startTime)
    const cooldownRef = useRef(cooldown)
    const casttimeRef = useRef(casttime)

    startTimeRef.current = startTime
    cooldownRef.current = cooldown
    casttimeRef.current = casttime

    useEffect(() => {
        subscribe({
            source: id,
            keybind,
            notify: () => startCooldown(true),
            execute: useAbility
        })

        return (id) => unsubscribe(id)
    })

    const startCooldown = (gcd) => {

        if(startTimeRef.current) return

        if(!gcd) setCharges(charges => charges-1)

        let timer = setInterval(() => {
            let now = Date.now()
            let progress = ((startTimeRef.current || now) + cooldownRef.current) - now

            if(progress <= interval) {
                clearInterval(timer)
                
                if(!gcd) {
                    onAbilityUpdate({
                        type: "ABILITY_COOLDOWN_END",
                        payload: {
                            name
                        }
                    })
                    setCharges(charges => charges+1)
                }
                setStrokeDashoffset(circumference)
                return
            }
            setStrokeDashoffset(calculateStrokeDashoffset(progress, true, cooldownRef.current))
        }, interval)

        if(!gcd) {
            onAbilityUpdate({
                type: "ABILITY_COOLDOWN_START",
                payload: {
                    name,
                    time: Date.now()
                }
            })
            triggerEvent({
                type: "RESOURCE_UPDATE",
                payload: resource
            })
        }
       
        // if(!gcd) {
        //     //only do cooldown actions if it has a cooldown
        //     if(cooldownRef.current) {
        //         onAbilityUpdate({
        //             type: "ABILITY_COOLDOWN_START",
        //             payload: {
        //                 name,
        //                 time: Date.now()
        //             }
        //         })
        //     }
        //     triggerEvent({
        //         type: "RESOURCE_UPDATE",
        //         payload: resource
        //     })
        // } 
    }

    const startCast = () => {
        setTimeout(() => {
            onAbilityUpdate({
                type: "ABILITY_CAST_END",
                payload: {
                    name
                }
            })
            startCooldown()
        }, casttimeRef.current)

        onAbilityUpdate({
            type: "ABILITY_CAST_START",
            payload: {
                name,
                time: Date.now()
            }
        })
    }

    const useAbility = () => {
        if(startTimeRef.current) return
        casttime ? startCast() : startCooldown()
        onExecute(id, cooldownRef.current)
    }

    return (
        <div className="progress-ability" onClick={useAbility}>
        <svg width={radius/2} height={radius/2}>
            <image
                className={charges > 0 ? "colored" : "desaturated"}
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