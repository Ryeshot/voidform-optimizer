import defaultAbilitySettings from "../abilitySettings"
import defaultAuraSettings from "../auraSettings"

export default {
    displayName: "Yvaelle's Shadowlands",
    abilitySettings: {
        ...defaultAbilitySettings,
        "void-eruption": {
            ...defaultAbilitySettings["void-eruption"],
            resource: 0
        },
        "mind-blast": {
            ...defaultAbilitySettings["mind-blast"],
            cooldown: 7500,
            resource: 15,
            charges: 2
        }
    },
    auraSettings: {
        ...defaultAuraSettings,
        stats: {
            ...defaultAuraSettings.stats,
            haste: .35
        },
        voidform: {
            ...defaultAuraSettings.voidform,
            drainStart: 5,
            drainRate: 0,
            hasteStart: .15,
            hasteStack: 0,
            gainInsanity: false
        },
        lingeringInsanity: {
            ...defaultAuraSettings.lingeringInsanity,
            type: "static",
            duration: 0
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
        "devouring-plague": { disabled: true },
        "shadowfiend": { disabled: true },
        "power-infusion": { disabled: true }
    }
}