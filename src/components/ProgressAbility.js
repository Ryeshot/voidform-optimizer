import React, {useState, useEffect, useRef} from 'react';
import "./ProgressAbility.css"
import CooldownSweep from "./CooldownSweep"

const ProgressAbility = (props) => {

    const {name, cooldown, onGlobalCooldown, type, resource, startTime, icon, casttime, maxCharges, keybind, subscribe, unsubscribe, onExecute, onAbilityUpdate, triggerEvent, id} = props
    const interval = 50

    const radius = 100
    const stroke = 100

    const [charges, setCharges] = useState(maxCharges || 1)
    const [progress, setProgress] = useState(0)

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

    //two separate timers, one for gcd one for the actual cooldown?

    const startCooldown = (gcd) => {

        if(startTimeRef.current) return

        if(!gcd && cooldownRef.current) setCharges(charges => charges-1)

        let timer = setInterval(() => {
            let now = Date.now()
            let remaining = ((startTimeRef.current || now) + cooldownRef.current) - now

            if(remaining <= interval) {
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
                setProgress(0)
                return
            }
            setProgress(progress => remaining/cooldownRef.current)

            onAbilityUpdate({
                type: "ABILITY_COOLDOWN_UPDATE",
                payload: {
                    name,
                    cooldown: cooldownRef.current
                }
            })
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
                duration: casttimeRef.current,
                time: Date.now()
            }
        })
    }

    const startChannel = () => {
        setTimeout(() => {
            onAbilityUpdate({
                type: "ABILITY_CHANNEL_END",
                payload: {
                    name
                }
            })
        }, casttimeRef.current)

        onAbilityUpdate({
            type: "ABILITY_CHANNEL_START",
            payload: {
                name,
                duration: casttimeRef.current,
                time: Date.now()
            }
        })
    }

    const useAbility = () => {
        if(startTimeRef.current) return
        //channels immediately start cooldown
        if(type === "channel") {
            startChannel()
            startCooldown()
            onExecute(id, cooldownRef.current, type)
            return
        }

        casttime ? startCast() : startCooldown()
        onExecute(id, cooldownRef.current, type)
    }

    return (
        <div className="progress-ability-container">
        <div className="progress-ability" onClick={useAbility}>
            <img 
                className={(charges > 0 || onGlobalCooldown) ? "colored" : "desaturated"}
                src={icon}
                width={radius/2}
                height={radius/2}
            />
            <div className="charge-text">{maxCharges > 1 ? charges : ""}</div>
            {startTimeRef.current ? 
            <CooldownSweep size={radius/2} radius={radius} stroke={stroke} progress={progress}/>
            : null}
        </div>
        <div>{keybind.match(/[a-zA-Z]/) ? keybind.toUpperCase() : keybind}</div>
        </div>
    )
}

export default ProgressAbility;