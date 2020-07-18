const abilityEffects = {
    "void-bolt": {
        onEvent: {
            "CAST_SUCCESS": [{
                type: "TRIGGER",
                effects: [
                    "void-bolt-cooldown-reset",
                    "void-bolt-cooldown-reduce-fae-blessings",
                    "void-bolt-cooldown-reduce-shadowfiend"
                ]
            }]
        }
    }
}

export default abilityEffects