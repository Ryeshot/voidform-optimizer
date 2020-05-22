import React, {useState, useEffect} from 'react';

const Voidform = (props) => {

    const {drainRate, drainStart, haste, stackHaste, triggerEvent} = props
    const interval = 100

    const start = () => {
        let n = 0
        let frequency = Math.round(1000/interval)
        let i = 0

        const timer = setInterval(() => {

          let sec = interval/1000
          let drain = (drainStart + drainRate*n)*sec
    
          n += sec
          i++
    
          triggerEvent({
            type: "RESOURCE_UPDATE",
            payload: drain*-1
          })

          if(i % frequency == 0) {
              //gain a stack of vf
              //let stack = Math.round(i/frequency)

              triggerEvent({
                  type: "HASTE_UPDATE",
                  payload: stackHaste
              })
          }

          //console.log(n)
    
        }, interval)

        return timer
    }

    useEffect(() => {
        let timer = start()

        return () => clearInterval(timer)
    }, [])
    
    return null
}

export default Voidform