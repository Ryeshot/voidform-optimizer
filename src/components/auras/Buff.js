import React, {useState, useEffect, useReducer, useRef} from 'react';
import Aura from "./Aura"
import {auraEventHandler} from "../../utils/eventHandler"

//import 

const Buff = (props) => {

    const {icon, name, displayName, startTime, setting, triggerEvent} = props
    const {baseDuration} = setting

    const interval = 100

    const [duration, setDuration] = useState(0)

    const startTimeRef = useRef(startTime)
    startTimeRef.current = startTime

    useEffect(() => {
        const eventHandler = auraEventHandler(name, triggerEvent)
        const start = Date.now()

        eventHandler.handleEvent("AURA_START", {
            name,
            source: name,
            duration: baseDuration,
            time: start,
            ...setting
        })

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

            setDuration(duration => now - startTimeRef.current)

        }, interval)

        return () => clearInterval(timer)
    }, [])

    return <Aura icon={icon} displayName={displayName} duration={duration} maxDuration={baseDuration}/>
}

export default Buff