export const globalEffects = {
    "RESOURCE_UPDATE": [{
        type: "TRIGGER",
        effects: [
            "calculate-resource"
        ]
    }]
}

export const auraEffects = {
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

export const abilityEffects = {
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