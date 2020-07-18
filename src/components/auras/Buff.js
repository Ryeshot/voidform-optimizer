import React, {useState, useEffect, useRef} from 'react';
import Aura from "./Aura"
import {auraEventHandler} from "../../utils/eventHandler"

//import 

const interval = 100

const startBuff = (setDuration, startTimeRef, baseDuration, eventHandler, payload) => {
    const {name} = payload
    const timer = setInterval(() => {

        const now = Date.now()

        if(now >= startTimeRef.current + baseDuration) {
            clearInterval(timer)

            eventHandler.handleEvent("AURA_END", {
                name,
                source: name
            })

            return
        }

        setDuration(_ => now - startTimeRef.current)

    }, interval)

    return timer
}

const Buff = (props) => {

    const {icon, name, displayName, startTime, setting, triggerEvent, effectHandler} = props
    const {baseDuration} = setting

    const [duration, setDuration] = useState(0)

    const startTimeRef = useRef(startTime)
    startTimeRef.current = startTime

    useEffect(() => {
        const eventHandler = auraEventHandler(name, triggerEvent, effectHandler)
        const start = Date.now()

        eventHandler.handleEvent("AURA_START", {
            name,
            source: name,
            duration: baseDuration,
            time: start,
            ...setting
        })

        const timer = startBuff(setDuration, startTimeRef, baseDuration, eventHandler, {name})

        return () => clearInterval(timer)
    }, [])

    return <Aura icon={icon} displayName={displayName} duration={duration} maxDuration={baseDuration}/>
}

export default Buff
export {startBuff}