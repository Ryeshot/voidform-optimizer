import React, {useState, useEffect, useReducer, useRef} from 'react';
import Aura from "./Aura"

const DamageOverTime = (props) => {

    const {icon, name, displayName, startTime, baseDuration, maxDuration, ticks, resource, haste, hasted, triggerEvent} = props

    const interval = 100

    const [duration, setDuration] = useState(0)

    const startTimeRef = useRef(startTime)
    startTimeRef.current = startTime

    const maxDurationRef = useRef(maxDuration)
    maxDurationRef.current = maxDuration

    const hasteRef = useRef(haste)
    hasteRef.current = haste

    const calculateNextTickTime = (now) => {
        //console.log("Haste: " + hasteRef.current)
        return (baseDuration/ticks)/(hasted && hasteRef.current || 1) + now

    }

    useEffect(() => {
        let start = Date.now()
        let tickTime = calculateNextTickTime(start)

        triggerEvent({
            category: "AURA",
            type: "AURA_BEGIN",
            payload: {
                name,
                duration: baseDuration,
                time: start,
                tickTime
            }
        })

        const timer = setInterval(() => {

            const now = Date.now()

            if(now >= startTimeRef.current + maxDurationRef.current) {
                clearInterval(timer)
                triggerEvent({
                    type: "RESOURCE_UPDATE",
                    payload: {
                        resource
                    }
                })
                triggerEvent({
                    category: "AURA",
                    type: "AURA_END",
                    payload: {
                        name
                    }
                })
                return
            }

            if(now >= tickTime) {
                const endTime = startTimeRef.current + maxDurationRef.current
                tickTime = Math.min(calculateNextTickTime(now), endTime)

                triggerEvent({
                    type: "RESOURCE_UPDATE",
                    payload: {
                        resource
                    }
                })
                triggerEvent({
                    type: "AURA_TICK",
                    payload: {
                        name,
                        tickTime
                    }
                })
            }

            setDuration(duration => now - startTimeRef.current)

        }, interval)

        return () => clearInterval(timer)
    }, [])

    return <Aura icon={icon} displayName={displayName} duration={duration} maxDuration={maxDurationRef.current}/>
}

export default DamageOverTime