const GlobalCooldown = {

    start: (duration, triggerEvent) => {
        console.log("End time for gcd: " + (Date.now() + duration))

        triggerEvent({
            type: "GLOBAL_COOLDOWN_START",
            payload: {
                gcd: duration,
                time: Date.now()

            }
        })

        setTimeout(() => {
            console.log("Gcd ended")
            triggerEvent({
                type: "GLOBAL_COOLDOWN_END"
            })    
        }, duration);
    }
}

export default GlobalCooldown