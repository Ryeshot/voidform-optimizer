import React, {useState, useEffect, useRef} from 'react';
import "./ProgressAbility.css"
import CooldownSweep from "./CooldownSweep"

const ProgressAbility = (props) => {

    const {name, cooldown, globalCooldown, globalCooldownStartTime, type, resource, startTime, castStartTime, castEndTime, icon, casttime, maxCharges, keybind, subscribe, unsubscribe, onExecute, onAbilityUpdate, triggerEvent, id} = props
    const interval = 50

    const size = 50

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

    startTimeRef.current = startTime
    castStartTimeRef.current = castStartTime
    castEndTimeRef.current = castEndTime
    cooldownRef.current = cooldown
    casttimeRef.current = casttime
    globalCooldownRef.current = globalCooldown
    globalCooldownStartTimeRef.current = globalCooldownStartTime
    chargesRef.current = charges

    let cooldownTimer
    let globalCooldownTimer
    let channelTimer

    useEffect(() => {
        subscribe({
            source: id,
            keybind,
            notify: () => startGlobalCooldown(),
            execute: useAbility
        })

        return (id) => {
            clearInterval(globalCooldownTimer)
            clearInterval(cooldownTimer)
            unsubscribe(id)
        }
    }, [])

    const startGlobalCooldown = () => {

        globalCooldownTimer = setInterval(() => {
            let now = Date.now()
            let cooldownState = {
                startTime: globalCooldownStartTimeRef.current || now,
                cooldown: globalCooldownRef.current
            }
            let remaining = (cooldownState.startTime + cooldownState.cooldown) - now

            if(cooldownState.startTime && startTimeRef.current) 
            {
                let cooldownRemaining = (startTimeRef.current + cooldownRef.current) - now

                clearInterval(remaining > cooldownRemaining ? cooldownTimer : globalCooldownTimer)
                return
            }

            if(remaining <= interval) {
                clearInterval(globalCooldownTimer)               
                //setProgress(0)
                return
            }
            setProgress(progress => remaining/cooldownState.cooldown)
        }, interval)
    }

    const startCooldown = () => {

        cooldownTimer = setInterval(() => {
            let now = Date.now()
            let cooldownState = {
                startTime: (startTimeRef.current || now),
                cooldown: cooldownRef.current
            }
            let remaining = (cooldownState.startTime + cooldownState.cooldown) - now

            //if a charge then set new start time to now (ABILITY_COOLDOWN_START)
            if(remaining <= interval) {
                clearInterval(cooldownTimer)

                setCharges(charges => charges+1)

                if(maxCharges && chargesRef.current < maxCharges) {
                    setProgress(1)
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
        triggerEvent({
            type: "RESOURCE_UPDATE",
            payload: resource
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
            executeInstant()
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
        //need to be able to clear this timeout (is that possible?)
        //if start time clear with 30% of remaining duration + castTImeref.current
        let channelTime = casttimeRef.current
        let now = Date.now()
        //let castEndTime = now + channelTime
        if(castStartTimeRef.current) {
            clearTimeout(channelTimer)
            let previousChannelTime = castEndTimeRef.current - castStartTimeRef.current
            let previousChannelRemaining = previousChannelTime - (now - castStartTimeRef.current)
            channelTime += Math.min(previousChannelRemaining, previousChannelTime * .3)
        }

        channelTimer = setTimeout(() => {
            console.log("Ending channel...")
            onAbilityUpdate({
                type: "ABILITY_CHANNEL_END",
                payload: {
                    name
                }
            })
        }, channelTime)

        onAbilityUpdate({
            type: "ABILITY_CHANNEL_START",
            payload: {
                name,
                duration: channelTime,
                time: now,
                //castEndTime
            }
        })
    }

    const useAbility = () => {
        if(globalCooldownRef.current) return

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

        onExecute(id, cooldownRef.current, type)
    }

    const executeInstant = () => {
        if(startTimeRef.current && charges === 0) return      
        setCharges(charges => charges-1)
        if(maxCharges && chargesRef.current < maxCharges - 1) return
        startCooldown()
    }

    const executeCast = () => {
        if(castStartTimeRef.current || charges === 0) return
        startCast()
    }

    const executeChannel = () => {
        startChannel()
        executeInstant()
    }

    return (
        <div className="progress-ability-container">
        <div className="progress-ability" onClick={useAbility}>
            <img className="ability-icon"
                className={charges > 0 ? "colored" : "desaturated"}
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