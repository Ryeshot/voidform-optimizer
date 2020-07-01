import defaultAbilitySettings from "../abilitySettings"
import defaultAuraSettings from "../auraSettings"

export default {
    displayName: "Shadowlands Alpha",
    abilitySettings: {
        ...defaultAbilitySettings,
        "void-eruption": {
            cooldown: 0,
            type: "cast",
            casttime: 2000,
            resource: 90,
            costsResource: true
        },
        "mind-blast": {
            cooldown: 8000,
            resource: 12,
            hasted: true,
            type: "cast",
            casttime: 1500,
            charges: 1,
            cdr: 1500
        },
        "shadow-word-death": {
            ...defaultAbilitySettings["shadow-word-death"],
            cooldown: 20000,
            resource: 0,
            hasted: true,
        }
    },
    auraSettings: {
        ...defaultAuraSettings,
        "devouring-plague": {
            displayName: "Devouring Plague",
            baseDuration: 12000,
            ticks: 4,
            resource: 0
        }
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