import React from 'react';
import CooldownSweep from "../CooldownSweep"
import "./Aura.css"

const auraRefreshRate = 100
const endAura = (timer, name, eventHandler) => {
    clearInterval(timer)
    eventHandler.handleEvent("AURA_END", {
        name,
        source: name
    })
}

const startAura = (onAuraRefresh, getAuraEndtime, eventHandler, name, updateEvents) => {
    let refreshCount = 0
    const timer = setInterval(() => {
        const now = Date.now()
        refreshCount++

        if(now >= getAuraEndtime()){
            endAura(timer, name, eventHandler)
            return
        }

        updateEvents.forEach(({ eventName, getPayload, interval }) => {
            const auraRefreshFrequency = Math.round(interval / auraRefreshRate)
            if(refreshCount % auraRefreshFrequency !== 0) return
            eventHandler.handleEvent(eventName, { name, ...getPayload() })
        })

        onAuraRefresh(now)
    }, auraRefreshRate)

    return timer
}

export const createAuraTimer = (name, eventHandler) => {
    const events = {}
    const builder = {
        setStartingEvent: (eventName, getPayload) => {
            events.starting = { eventName, getPayload }
            return builder
        },
        addUpdateEvent: (eventName, getPayload, { interval }) => {
            events.update = [...(events.update || []), { eventName, getPayload, interval }]
            return builder
        },
        start: (setDuration, startTimeRef, duration) => {
            const getAuraEndtime = () => startTimeRef.current + duration
            const onAuraRefresh = (now) => setDuration(_ => now - startTimeRef.current)
            const timer = startAura(onAuraRefresh, getAuraEndtime, eventHandler, name, events.update || [])
            eventHandler.handleEvent(events.starting.eventName, {
                name,
                ...events.starting.getPayload()
            })
            return timer
        }
    }
    return builder
}

const Aura = (props) => {

    const {icon, displayName, duration, maxDuration, stacks} = props

    const size = 30
    const progress = duration && ((maxDuration-duration)/maxDuration)

    return (
        <div className="aura">
            <img
                src={icon}
                width={size}
                height={size}
            >
            </img>
            <div className="aura-text">{stacks > 0 ? stacks : ""}</div>
            {duration ? <CooldownSweep size={30} progress={progress} inverse={true}/> : null}
            {props.children}
        </div>
    )
}

export default Aura