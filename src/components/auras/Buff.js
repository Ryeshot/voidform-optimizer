import React, {useState, useEffect, useRef} from 'react';
import Aura from "./Aura"
import {auraEventHandler} from "../../utils/eventHandler"

//import 

const interval = 100

const startBuff = (setDuration, startTimeRef, baseDuration, stacks, eventHandler, payload) => {
    const {name, maxStacks} = payload
    const timer = setInterval(() => {

        const now = Date.now()

        if(now >= startTimeRef.current + baseDuration || (maxStacks && stacks.current <= 0)) {
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

    const {icon, name, displayName, startTime, stacks, setting, triggerEvent, effectHandler} = props
    const {baseDuration, maxStacks} = setting

    const [duration, setDuration] = useState(0)

    const startTimeRef = useRef(startTime)
    startTimeRef.current = startTime

    const stacksRef = useRef(stacks)
    stacksRef.current = stacks

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

        const timer = startBuff(setDuration, startTimeRef, baseDuration, stacksRef, eventHandler, {name, maxStacks})

        return () => clearInterval(timer)
    }, [])

    return <Aura icon={icon} displayName={displayName} duration={duration} maxDuration={baseDuration} stacks={stacks} />
}

export default Buff
export {startBuff}