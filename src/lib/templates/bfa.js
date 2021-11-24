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
            charges: 2
        }
    },
    auraSettings: {
        ...defaultAuraSettings,
        "voidform": {
            ...defaultAuraSettings["voidform"],
            hasteStack: 0,
        },
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
        "shadow-word-death": { disabled: true },
        "void-torrent": { disabled: true },
        "shadow-word-pain": {},
        "vampiric-touch": {},
        "devouring-plague": { disabled: true },
        "shadowfiend": {},
        "power-infusion": { disabled: true }
    }
}