import React, {useState, useEffect, useRef} from 'react';
import "./ProgressAbility.css"
import CooldownSweep from "./CooldownSweep"

const ProgressAbility = (props) => {

    const {name, cooldown, globalCooldown, globalCooldownStartTime, type, resource, startTime, castStartTime, castEndTime, icon, casttime, ticks, baseChannelTime, maxCharges, keybind, subscribe, unsubscribe, onExecute, onAbilityUpdate, triggerEvent, id} = props
    const interval = 20

    const size = 50
    const lag = 50

    const [charges, setCharges] = useState(maxCharges || 1)
    const [progress, setProgress] = useState(0)

    const startTimeRef = useRef(startTime)
    const castStartTimeRef = useRef(castStartTime)
    const castEndTimeRef = useRef(castEndTime)
    const cooldownRef = useRef(cooldown)
    const casttimeRef = useRef(casttime)
    const globalCooldownRef = useRef(globalCooldown)
    const globalCooldownStartTimeRef = useRef(globalCooldownStartTime)
    const chargesRef = useRef(maxCharges || 1)
    const channelTimer = useRef()
    const cooldownTimer = useRef()
    const globalCooldownTimer = useRef()
    const ticksRef = useRef(ticks)
    const baseChannelTimeRef = useRef(baseChannelTime)

    startTimeRef.current = startTime
    castStartTimeRef.current = castStartTime
    castEndTimeRef.current = castEndTime
    cooldownRef.current = cooldown
    casttimeRef.current = casttime
    globalCooldownRef.current = globalCooldown
    globalCooldownStartTimeRef.current = globalCooldownStartTime
    chargesRef.current = charges
    ticksRef.current = ticks
    baseChannelTimeRef.current = baseChannelTime

    useEffect(() => {
        subscribe({
            source: id,
            keybind,
            notify: () => startGlobalCooldown(),
            execute: executeAbility
        })

        return () => {
            clearInterval(globalCooldownTimer.current)
            clearInterval(cooldownTimer.current)
            unsubscribe(id)
        }
    }, [])

    const startGlobalCooldown = () => {

        if(startTimeRef.current) {
            let start = Date.now()
            let remaining = (startTimeRef.current + cooldownRef.current) - start

            if(remaining > globalCooldownRef.current) return
        }

        globalCooldownTimer.current = setInterval(() => {
            if(startTimeRef.current) return

            let now = Date.now()
            let cooldownState = {
                startTime: globalCooldownStartTimeRef.current || now,
                cooldown: globalCooldownRef.current
            }
            let remaining = (cooldownState.startTime + cooldownState.cooldown) - now

            if(remaining <= interval + lag) {
                clearInterval(globalCooldownTimer.current)               
                //setProgress(0)
                return
            }
            setProgress(progress => remaining/cooldownState.cooldown)
        }, interval)
    }

    const startCooldown = () => {

        cooldownTimer.current = setInterval(() => {
            let now = Date.now()
            let cooldownState = {
                startTime: (startTimeRef.current || now),
                cooldown: cooldownRef.current
            }
            let remaining = (cooldownState.startTime + cooldownState.cooldown) - now

            if(remaining <= interval + lag) {
                setCharges(charges => charges+1)

                clearInterval(cooldownTimer.current)
                if(maxCharges && chargesRef.current < maxCharges) {
                    startCooldown()
                    return
                }
                
                onAbilityUpdate({
                    type: "ABILITY_COOLDOWN_END",
                    payload: {
                        name
                    }
                })

                setProgress(0)

                return
            }
            setProgress(progress => remaining/cooldownState.cooldown)

        }, interval)

        onAbilityUpdate({
            type: "ABILITY_COOLDOWN_START",
            payload: {
                name,
                time: Date.now()
            }
        })
    }

    const startCast = () => {
        setTimeout(() => {
            onAbilityUpdate({
                type: "ABILITY_CAST_END",
                payload: {
                    name
                }
            })
            
            onAbilityUpdate({
                type: "ABILITY_CAST_SUCCESS",
                payload: {
                    name
                }
            })
    
            if(resource) {
                triggerEvent({
                    type: "RESOURCE_UPDATE",
                    payload: resource
                })
            }

            if(name === "void-eruption") {
                triggerEvent({
                    type: "VOIDFORM_START"
                })
            }

            if(cooldownRef.current) {
                setCharges(charges => charges-1)
                startCooldown()
            }

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
        let channelTime = casttimeRef.current
        let now = Date.now()
        let currentTicks = ticksRef.current
        let pandemicTime = 0
        if(castStartTimeRef.current) {
            clearInterval(channelTimer.current)
            let previousChannelTime = castEndTimeRef.current - castStartTimeRef.current
            let previousChannelRemaining = previousChannelTime - (now - castStartTimeRef.current)
            let previousChannelFrequency = (baseChannelTimeRef.current/currentTicks)        
            pandemicTime = Math.min(previousChannelRemaining, baseChannelTimeRef.current * .3)
            let remainingTicks = Math.floor(pandemicTime/previousChannelFrequency)
            console.log(remainingTicks)
            currentTicks += remainingTicks
        }

        let channelFrequency = Math.round((channelTime+pandemicTime)/currentTicks)

        channelTimer.current = setInterval(() => {

            let now = Date.now()

            if(resource){
                triggerEvent({
                    type: "RESOURCE_UPDATE",
                    payload: resource/currentTicks
                })
            }

            if(now >= castEndTimeRef.current) {
                clearInterval(channelTimer.current)

                onAbilityUpdate({
                    type: "ABILITY_CHANNEL_END",
                    payload: {
                        name
                    }
                })

                if(name === "void-torrent") {
                    triggerEvent({
                        type: "INSANITY_DRAIN_PAUSE_END"
                    })
                }
                return
            }

        }, channelFrequency)

        onAbilityUpdate({
            type: "ABILITY_CHANNEL_START",
            payload: {
                name,
                duration: channelTime + pandemicTime,
                time: now,
                baseChannelTime: channelTime
            }
        })

        if(name === "void-torrent") {
            triggerEvent({
                type: "INSANITY_DRAIN_PAUSE_START"
            })
        }

    }

    const executeAbility = () => {
        if(globalCooldownRef.current) return

        console.log(type)
        switch(type) {
            case "instant":
                executeInstant()
                break;
            case "cast":
                executeCast()
                break;
            case "channel":
                executeChannel()
                break;
        }
    }

    const executeInstant = () => {
        console.log(chargesRef.current)
        if(startTimeRef.current && chargesRef.current === 0) return      
        setCharges(charges => charges-1)
        onAbilityUpdate({
            type: "ABILITY_CAST_SUCCESS",
            payload: {
                name
            }
        })

        if(resource) {
            triggerEvent({
                type: "RESOURCE_UPDATE",
                payload: resource
            })
        }

        onExecute(id, cooldownRef.current, type)
        if(maxCharges && chargesRef.current < maxCharges - 1) return
        startCooldown()
    }

    const executeCast = () => {
        if(castStartTimeRef.current || chargesRef.current === 0) return
        startCast()
        onExecute(id, cooldownRef.current, type)
    }

    const executeChannel = () => {
        if(startTimeRef.current) return
        startChannel()
        //ability has a cooldown
        if(cooldownRef.current) {
            startCooldown()
        }
        onExecute(id, cooldownRef.current, type)
    }

    {console.log("Inside ability render")}

    return (
        <div className="progress-ability-container">
        <div className="progress-ability" onClick={executeAbility}>
            <img className="ability-icon"
                className={(charges > 0 && maxCharges) || (!startTimeRef.current)? "colored" : "desaturated"}
                src={icon}
                width={size}
                height={size}
            />
            <div className="charge-text">{maxCharges > 1 ? charges : ""}</div>
            {startTimeRef.current || globalCooldownRef.current ? 
            <CooldownSweep size={size} progress={progress}/>
            : null}
        </div>
        <div>{keybind.match(/[a-zA-Z]/) ? keybind.toUpperCase() : keybind}</div>
        </div>
    )
}

export default ProgressAbility;