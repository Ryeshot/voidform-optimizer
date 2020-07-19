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
    },
    "void-eruption": {
        onEvent: {
            "CAST_SUCCESS": [{
                type: "TRIGGER",
                effects: [
                    "voidform-deactivate-void-eruption"
                ]
            }]
        }
    }
}

export default abilityEffects