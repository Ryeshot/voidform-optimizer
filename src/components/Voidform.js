import React, {useState, useEffect} from 'react';

const Voidform = (props) => {

    const {drainRate, drainStart, triggerEvent} = props
    const interval = 100

    const start = () => {
        let n = 0

        const timer = setInterval(() => {

          let sec = interval/1000
          let drain = (drainStart + drainRate*n)*sec

          console.log(drain)
    
          n += sec
    
          triggerEvent({
            type: "RESOURCE_UPDATE",
            payload: drain*-1
          })
    
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