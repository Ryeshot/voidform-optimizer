import React, {useEffect} from 'react';

const GlobalCooldown = (props) => {

    const {duration, triggerEvent, onBegin} = props

    useEffect(() => {
        console.log("End time for gcd: " + (Date.now() + duration))
        onBegin()
        setTimeout(() => {
            console.log("Gcd ended")
            triggerEvent({
                type: "GLOBAL_COOLDOWN_END"
            })    
        }, duration);
    }, [])

    return null
}

export default GlobalCooldown