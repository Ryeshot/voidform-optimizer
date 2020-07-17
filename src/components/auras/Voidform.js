import React, { useState, useEffect, useRef } from 'react';
import Aura from "./Aura"
import {startBuff} from "./Buff"
import {auraEventHandler} from "../../utils/eventHandler"

const Voidform = (props) => {

    const { type, startTime, drainRate, drainStart, hasteStack, hasteStart, maxStacks, baseDuration, paused, active, triggerEvent } = props
    const interval = 100
    const displayName = "Voidform"
    const name = "voidform"
    const icon = "images/voidform.jpg"

    const [stacks, setStacks] = useState(type === "insanity" ? 1 : 0)
    const [duration, setDuration] = useState(0)

    const pausedRef = useRef(paused)
    pausedRef.current = paused

    const startTimeRef = useRef(startTime)
    startTimeRef.current = startTime

    const start = () => {
        let n = 0
        let frequency = Math.round(1000 / interval)

        let i = 0

        triggerEvent({
            type: "HASTE_UPDATE",
            payload: {
                source: name,
                haste: hasteStart + hasteStack
            }
        })

        const timer = setInterval(() => {
            let sec = interval / 1000
            let drain = (drainStart + drainRate * n) * sec

            i++

            if (!pausedRef.current) {
                n += sec
                triggerEvent({
                    type: "RESOURCE_UPDATE",
                    payload: {
                        resource: drain * -1
                    }
                })
            }

            if (i % frequency === 0 && (!maxStacks || i / frequency < maxStacks)) {
                //gain a stack of vf
                triggerEvent({
                    type: "VOIDFORM_UPDATE",
                    payload: hasteStack
                })
                setStacks(stacks => stacks + 1)
            }

        }, interval)

        return timer
    }

    useEffect(() => {
        let timer

        switch(type) {
            case "insanity":
                timer = start()
                break
            case "static":
                const time = Date.now()
                const eventHandler = auraEventHandler(name, triggerEvent)

                eventHandler.handleEvent("AURA_START", {
                    name,
                    source: name,
                    duration: baseDuration,
                    time,
                    haste: hasteStart
                })

                timer = startBuff(setDuration, startTimeRef, baseDuration, eventHandler, {name})
            default:
        }

        return () => {
            clearInterval(timer)

            triggerEvent({
                type: "VOIDFORM_END",
                payload: {
                    time: Date.now(),
                    startingHaste: hasteStart
                }
            })

            triggerEvent({
                type: "RESOURCE_UPDATE",
                payload: {
                    resource: 0
                }
            })
        }
    }, [active])

    return <Aura icon={icon} displayName={displayName} stacks={stacks} duration={duration} maxDuration={baseDuration} />
}

export default Voidform