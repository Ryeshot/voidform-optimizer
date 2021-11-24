import defaultAbilitySettings from "../abilitySettings"
import defaultAuraSettings from "../auraSettings"
import defaultEffectSettings from "../effectSettings"

export default {
    displayName: "Shadowlands",
    abilitySettings: {
        ...defaultAbilitySettings,
    },
    auraSettings: {
        ...defaultAuraSettings,
        "dark-thoughts": {
            displayName: "Dark Thoughts",
            baseDuration: 15000,
            maxStacks: 5
        }
    },
    effectSettings: {
        ...defaultEffectSettings
    },
    abilities: {
        "mind-flay": {},
        "mind-sear": {},
        "void-bolt": {},
        "void-eruption": {},
        "mind-blast": {},
        "shadow-word-death": {},
        "void-torrent": { disabled: true },
        "shadow-word-pain": {},
        "vampiric-touch": {},
        "devouring-plague": {},
        "shadowfiend": {}
    }
}