import React, {useEffect} from 'react';

const GlobalCooldown = (props) => {

    const {duration, triggerEvent} = props

    useEffect(() => {
        setTimeout(() => {
            triggerEvent({
                type: "GLOBAL_COOLDOWN_END"
            })    
        }, duration);
    }, [])

    return null
}

export default GlobalCooldown