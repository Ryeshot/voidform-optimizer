import React, {useState, useEffect, useReducer, useRef} from 'react';
import Aura from "./Aura"

const LingeringInsanity = (props) => {

    const { type, startTime, haste, stacks, inVoidform, triggerEvent, ...settings} = props

    const interval = 100
    const name = "lingeringInsanity"
    const displayName = "Lingering Insanity"
    const icon = "images/lingering-insanity.jpg"
    const defaultMaxDuration = 60000

    const [maxDuration, setMaxDuration] = useState(defaultMaxDuration)
    const [duration, setDuration] = useState(0)

    const stacksRef = useRef(stacks)
    stacksRef.current = stacks

    const inVoidformRef = useRef(inVoidform)
    inVoidformRef.current = inVoidform

    const startTimeRef = useRef(startTime)
    startTimeRef.current = startTime

    const hasteRef = useRef(haste)
    hasteRef.current = haste

    const initialize = (afterVoidformEntry, hasteRetention, stacks, duration) => {
        let currentMaxDuration = afterVoidformEntry ? defaultMaxDuration : duration
        let voidformEntered = false

        setMaxDuration(maxDuration => currentMaxDuration)

        triggerEvent({
            type: "LINGERING_INSANITY_START",
            payload: {
                haste: hasteRef.current * hasteRetention,
                stacks: Math.ceil(stacks * hasteRetention)
            }
        })

        return {
            currentMaxDuration,
            voidformEntered
        }

    }

    const startStatic = () => {

        const { duration, afterVoidformEntry, hasteRetention } = settings
        
        let state = initialize(afterVoidformEntry, hasteRetention, stacksRef.current, duration)

        const timer = setInterval(() => {

            const now = Date.now()

            //just left voidform
            if(state.voidformEntered && !inVoidformRef.current) {
                state = initialize(afterVoidformEntry, hasteRetention, stacksRef.current, duration)

                return
            }

            //timed out
            if(now >= startTimeRef.current + state.currentMaxDuration) {
                clearInterval(timer)
                triggerEvent({
                    type: "LINGERING_INSANITY_END"
                })

                return
            }

            if(!state.voidformEntered && inVoidformRef.current) 
            {
                state.voidformEntered = true

                if(afterVoidformEntry) {
                    triggerEvent({
                        type: "AURA_REFRESH",
                        payload: {
                            name,
                            time: now
                        }
                    })
                    setMaxDuration(maxDuration => duration)
                    state.currentMaxDuration = duration
                    setDuration(duration => 0)
                    return
                }
           }            

            setDuration(duration => now - startTimeRef.current)

        }, interval)

        return timer
    }

    const calculateDecayStacks = (voidformHaste, hasteDecay) => {
        return Math.ceil(voidformHaste/hasteDecay)
    }

    const startDecay = () => {

        const { decayRate, hasteDecay } = settings

        let i = 0

        let state = initialize(true, 1, calculateDecayStacks(hasteRef.current, hasteDecay))

        const timer = setInterval(() => {

            i += interval

            const now = Date.now()

            if(state.voidformEntered && !inVoidformRef.current) {
                state = initialize(true, 1, calculateDecayStacks(hasteRef.current, hasteDecay))
                i = 0

                return
            }

            if(stacksRef.current <= 0) {
                clearInterval(timer)
                triggerEvent({
                    type: "LINGERING_INSANITY_END"
                })

                return
            }

            //lose stack
            if(i % decayRate === 0) {
                triggerEvent({
                    type: "LINGERING_INSANITY_UPDATE",
                    payload: hasteDecay * -1
                })
            }

            if(!state.voidformEntered && inVoidformRef.current) state.voidformEntered = true

            setDuration(duration => now - startTimeRef.current)

        }, interval)

        return timer
    }

    useEffect(() => {
        let timer

        switch(type) {
            case "static":
                timer = startStatic()
                break
            case "decay":
                timer = startDecay()
                break
        }

        return () => clearInterval(timer)

    }, [])

    return <Aura icon={icon} displayName={displayName} duration={duration} maxDuration={maxDuration} stacks={stacks}/>
}

export default LingeringInsanity