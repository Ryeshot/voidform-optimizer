import defaultAbilitySettings from "../abilitySettings"
import defaultAuraSettings from "../auraSettings"

export default {
    displayName: "Shadowlands Alpha",
    abilitySettings: {
        ...defaultAbilitySettings,
        "mind-blast": {
            ...defaultAbilitySettings["mind-blast"],
            cooldown: 8000
        },
        "shadow-word-death": {
            ...defaultAbilitySettings["shadow-word-death"],
            cooldown: 20000,
            resource: 0,
            hasted: true,
        }
    },
    auraSettings: {
        ...defaultAuraSettings
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