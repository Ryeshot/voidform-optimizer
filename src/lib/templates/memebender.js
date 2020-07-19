import beta from "./beta"

const {displayName, ...template} = beta

export default {
    displayName: "Memebender",
    ...template,
    effectSettings: {
        "void-bolt-cooldown-reduce-shadowfiend": {
            effectTime: 3000
        },
        "void-bolt-cooldown-reset": {},
        "void-bolt-cooldown-reduce-fae-blessings": {}
    },
    effects: {
        "void-bolt-cooldown-reduce-shadowfiend": { active: false },
        "void-bolt-cooldown-reset": { active: false },
        "void-bolt-cooldown-reduce-fae-blessings": { active: false }
    }
}