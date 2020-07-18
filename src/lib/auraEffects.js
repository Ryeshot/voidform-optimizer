const auraEffects = {
    "fae-blessings": {
        onEvent: {
            "AURA_START": [{
                type: "ACTIVATE",
                effects: [
                    "void-bolt-cooldown-reduce-fae-blessings"
                ]
            }],
            "AURA_END": [{
                type: "DEACTIVATE",
                effects: [
                    "void-bolt-cooldown-reduce-fae-blessings"
                ]
            }]
        }
    }
}

export default auraEffects