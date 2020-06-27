const GlobalCooldown = {

    start: (duration, triggerEvent) => {
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