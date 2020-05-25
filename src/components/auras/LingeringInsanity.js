import React, {useState, useEffect, useReducer, useRef} from 'react';
import Aura from "./Aura"

const LingeringInsanity = (props) => {

    const { type , settings, haste, stacks, inVoidform, triggerEvent} = props

    const interval = 100
    const displayName = "Lingering Insanity"
    const icon = "images/lingering-insanity.jpg"
    const defaultMaxDuration = 60000

    const [maxDuration, setMaxDuration] = useState(defaultMaxDuration)
    const [duration, setDuration] = useState(0)

    const stacksRef = useRef(stacks)
    stacksRef.current = stacks

    const inVoidformRef = useRef(inVoidform)
    inVoidformRef.current = inVoidform

    const startStatic = () => {

        const { duration, afterVoidformEntry, hasteRetention } = settings

        let startTime = Date.now()
        let currentMaxDuration = maxDuration
        let voidformEntered = false

        triggerEvent({
            type: "LINGERING_INSANITY_START",
            payload: haste * hasteRetention
        })

        if(!afterVoidformEntry) {
            setMaxDuration(maxDuration => duration)
            currentMaxDuration = duration
        }

        const timer = setInterval(() => {

            const now = Date.now()

            if(now >= startTime + currentMaxDuration) {

                clearInterval(timer)
                triggerEvent({
                    type: "LINGERING_INSANITY_END"
                })

                return
            }

            if(afterVoidformEntry && !voidformEntered && inVoidformRef.current) {
                voidformEntered = true
                setMaxDuration(maxDuration => duration)
                currentMaxDuration = duration
                setDuration(duration => 0)
                startTime = Date.now()

                return
            }

            setDuration(duration => now - startTime)

        }, interval)

    }

    const startDecay = () => {

        const { rate, hasteDecay } = settings

        const frequency = Math.round(rate/interval)
        let i = 0

        const startTime = Date.now()

        console.log("Starting stacks: " + stacks)

        const timer = setInterval(() => {

            i++

            const now = Date.now()

            if(stacksRef.current === 0) {
                clearInterval(timer)
                triggerEvent({
                    type: "LINGERING_INSANITY_END"
                })
                return
            }

            //lose stack
            if(i % frequency === 0) {
                triggerEvent({
                    type: "LINGERING_INSANITY_UPDATE",
                    payload: hasteDecay * -1
                })
            }

            setDuration(duration => now - startTime)

        }, interval)

    }

    useEffect(() => {
        switch(type) {
            case "static":
                startStatic()
                break
            case "decay":
                startDecay()
                break
        }
    }, [])

    return <Aura icon={icon} displayName={displayName} duration={duration} maxDuration={maxDuration} stacks={stacks}/>
}

export default LingeringInsanity