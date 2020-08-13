import defaultAbilitySettings from "../abilitySettings"
import defaultAuraSettings from "../auraSettings"

export default {
    displayName: "Shadowlands Alpha",
    abilitySettings: {
        ...defaultAbilitySettings,
        "vampiric-touch": {
            ...defaultAbilitySettings["vampiric-touch"],
            resource: 5
        },
        "void-bolt": {
            ...defaultAbilitySettings["void-bolt"],
            resource: 15
        },
        "mind-flay": {
            ...defaultAbilitySettings["mind-flay"],
            casttime: 4500,
            ticks: 6,
            resource: 18
        },
        "mind-sear": {
            ...defaultAbilitySettings["mind-sear"],
            casttime: 4500,
            ticks: 6,
            resource: 7.5
        },
        "mind-blast": {
            ...defaultAbilitySettings["mind-blast"],
            cooldown: 7500,
            resource: 8
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
            ...defaultAuraSettings["devouring-plague"],
            displayName: "Devouring Plague",
            baseDuration: 6000,
            ticks: 2
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