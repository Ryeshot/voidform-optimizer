import React, {useState, useEffect, useReducer, useRef} from 'react';
import Aura from "./Aura"

const DamageOverTime = (props) => {

    const {icon, name, displayName, startTime, maxDuration, triggerEvent} = props

    const interval = 100

    const [duration, setDuration] = useState(0)

    const startTimeRef = useRef(startTime)
    startTimeRef.current = startTime

    useEffect(() => {
        const timer = setInterval(() => {

            const now = Date.now()

            if(now >= startTimeRef.current + maxDuration) {
                clearInterval(timer)
                triggerEvent({
                    type: "AURA_END",
                    payload: {
                        name
                    }
                })
                return
            }

            setDuration(duration => now - startTimeRef.current)

        }, interval)

        return () => clearInterval(timer)
    }, [])

    return <Aura icon={icon} displayName={displayName} duration={duration} maxDuration={maxDuration}/>
}

export default DamageOverTime