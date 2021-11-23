import defaultAbilitySettings from "../abilitySettings"
import defaultAuraSettings from "../auraSettings"

export default {
    displayName: "Battle for Azeroth",
    abilitySettings: {
        ...defaultAbilitySettings,
        "void-eruption": {
            ...defaultAbilitySettings["void-eruption"],
            casttime: 1500,
            resourceCost: 60,
        },
        "mind-blast": {
            ...defaultAbilitySettings["mind-blast"],
            cooldown: 9000,
            resource: 15,
            charges: 2
        },
        "shadow-word-death": {
            ...defaultAbilitySettings["shadow-word-death"],
            charges: 2
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
        "shadow-word-death": { disabled: true },
        "void-torrent": { disabled: true },
        "shadow-word-pain": {},
        "vampiric-touch": {},
        "devouring-plague": { disabled: true },
        "shadowfiend": {},
        "power-infusion": { disabled: true }
    }
}