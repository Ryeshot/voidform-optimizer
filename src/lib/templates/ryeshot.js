import defaultAbilitySettings from "../abilitySettings"
import defaultAuraSettings from "../auraSettings"

export default {
    displayName: "Ryeshot's Shadowlands",
    abilitySettings: {
        ...defaultAbilitySettings,
        "void-bolt": {
            ...defaultAbilitySettings["void-bolt"],
            resource: 15
        },
        "mind-blast": {
            ...defaultAbilitySettings["mind-blast"],
            cooldown: 7500,
            resource: 25,
            charges: 2,
            cdr: 0
        },
        "shadow-word-death": {
            ...defaultAbilitySettings["shadow-word-death"],
            cooldown: 20000,
            resource: 0,
            hasted: true
        },
        "devouring-plague": {
            ...defaultAbilitySettings["devouring-plague"],
            costType: "dump",
            resource: 100
        }
    },
    auraSettings: {
        ...defaultAuraSettings,
        stats: {
            ...defaultAuraSettings.stats,
            haste: .15,
            startingInsanity: 30
        },
        voidform: {
            ...defaultAuraSettings.voidform,
            drainRate: .66,
            hasteStart: .1,
            hasteStack: .01
        },
        lingeringInsanity: {
            ...defaultAuraSettings.lingeringInsanity,
            type: "static",
            duration: 0
        },
        "devouring-plague": {
            ...defaultAuraSettings["devouring-plague"],
            baseDuration: 6000,
            ticks: 6,
            resource: 5,
            hasted: false
        }
    },
    abilities: {
        "mind-flay": {},
        "mind-sear": { disabled: true },
        "void-bolt": {},
        "void-eruption": {},
        "mind-blast": {},
        "shadow-word-death": { disabled: true },
        "void-torrent": { disabled: true },
        "shadow-word-pain": {},
        "vampiric-touch": {},
        "devouring-plague": {},
        "shadowfiend": { disabled: true },
        "power-infusion": { disabled: true }
    }
}