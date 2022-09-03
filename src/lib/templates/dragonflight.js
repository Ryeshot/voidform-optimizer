import defaultAbilitySettings from "../abilitySettings"
import defaultAuraSettings from "../auraSettings"

export default {
    displayName: "Dragonflight",
    abilitySettings: {
        ...defaultAbilitySettings,
        "void-bolt": {
            ...defaultAbilitySettings["void-bolt"],
            cooldown: 9000
        },
        "void-eruption": {
            ...defaultAbilitySettings["void-eruption"],
            cooldown: 120000
        },
        "mind-blast": {
            ...defaultAbilitySettings["mind-blast"],
            cooldown: 7500,
            charges: 2
        },
        "vampiric-touch": {
            ...defaultAbilitySettings["vampiric-touch"],
            resource: 5
        }
    },
    auraSettings: {
        ...defaultAuraSettings,
        stats: {
            ...defaultAuraSettings.stats,
            haste: .15
        }
    },
    abilities: {
        "mind-flay": {},
        "mind-sear": { disabled: true },
        "void-bolt": {},
        "void-eruption": {},
        "mind-blast": {},
        "shadow-word-death": {},
        "void-torrent": {},
        "shadow-word-pain": {},
        "vampiric-touch": {},
        "devouring-plague": {},
        "shadowfiend": {},
        "power-infusion": {}
    }
}