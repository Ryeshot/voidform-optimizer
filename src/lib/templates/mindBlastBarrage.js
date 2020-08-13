import beta from "./beta"

const {displayName, ...template} = beta

export default {
    displayName: "Mind Blast Barrage",
    ...template,
    abilities: {
        ...template.abilities,
        "fae-blessings": { disabled: true }
    },
    effectSettings: {
        "dark-thoughts": {
            effectTime: 15000,
            effectChance: .1
        }
    },
    effects: {
        "dark-thoughts": { active: true }
    }
}