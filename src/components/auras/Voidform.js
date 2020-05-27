import React, {useState, useEffect, useRef} from 'react';
import Aura from "./Aura"

const Voidform = (props) => {

    const {drainRate, drainStart, stackHaste, baseHaste, maxStacks, paused, triggerEvent} = props
    const interval = 100
    const displayName = "Voidform"
    const icon = "images/voidform.jpg"

    const [stacks, setStacks] = useState(1)

    const pausedRef = useRef(paused)
    pausedRef.current = paused

    const start = () => {
        let n = 0
        let frequency = Math.round(1000/interval)
        let i = 0

        if(baseHaste) triggerEvent({
            type: "HASTE_UPDATE",
            payload: {
                source: "voidform",
                haste: baseHaste
            }
        })

        const timer = setInterval(() => {

          let sec = interval/1000
          let drain = (drainStart + drainRate*n)*sec
    
          n += sec
          i++
    
          if(!pausedRef.current)
          triggerEvent({
            type: "RESOURCE_UPDATE",
            payload: {
                resource: drain*-1
            }
          })

          if(i % frequency === 0 && i/frequency <= maxStacks) {
              //gain a stack of vf
              triggerEvent({
                  type: "VOIDFORM_UPDATE",
                  payload: stackHaste
              })
              setStacks(stacks => stacks+1)
          }
    
        }, interval)

        return timer
    }

    useEffect(() => {
        let timer = start()

        return () => {
            clearInterval(timer)

            // triggerEvent({
            //     type: "LINGERING_INSANITY_START"
            // })

            triggerEvent({
                type: "VOIDFORM_END",
                payload: Date.now()
            })
        }
    }, [])
    
    return <Aura icon={icon} displayName={displayName} stacks={stacks}/>
}

export default Voidform