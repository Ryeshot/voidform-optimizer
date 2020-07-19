const auraEffects = {
    "fae-blessings": {
        onEvent: {
            "AURA_START": [{
                type: "ACTIVATE",
                effects: [
                    "void-bolt-cooldown-reduce-fae-blessings",
                    "void-bolt-cooldown-reduce-shadowfiend"
                ]
            }],
            "AURA_END": [{
                type: "DEACTIVATE",
                effects: [
                    "void-bolt-cooldown-reduce-fae-blessings",
                    "void-bolt-cooldown-reduce-shadowfiend"
                ]
            }]
        }
    }
}

export default auraEffects