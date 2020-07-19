import defaultAbilitySettings from "../abilitySettings"
import defaultAuraSettings from "../auraSettings"

export default {
    displayName: "Legion: Antorus",
    abilitySettings: {
        ...defaultAbilitySettings,
        "void-eruption": {
            ...defaultAbilitySettings["void-eruption"],
            casttime: 1500,
            resourceCost: 65
        },
        "mind-blast": {
            cooldown: 7500,
            resource: 12,
            hasted: true,
            type: "cast",
            casttime: 1500,
            charges: 2,
            cdr: 1500
        },
        "void-torrent": {
            cooldown: 60000,
            resource: 0,
            type: "channel",
            casttime: 4000,
            staticCastTime: true,
            ticks: 10,
            requireVoidform: true
        },
        "shadowfiend": {
            cooldown: 60000,
            resource: 6,
            type: "instant"
        }
    },
    auraSettings: {
        ...defaultAuraSettings,
        stats: {
            ...defaultAuraSettings.stats,
            displayName: "Stats",
            haste: .4
        },
        voidform: {
            displayName: "Voidform",
            drainStart: 6,
            drainRate: .66,
            hasteStart: 0,
            hasteStack: .01,
            maxStacks: 0
        },
        lingeringInsanity: {
            displayName: "Lingering Insanity",
            type: "decay",
            duration: 60000,
            afterVoidformEntry: false,
            hasteRetention: 1,
            decayRate: 1000,
            hasteDecay: .01
        },
        "shadowfiend": {
            displayName: "Shadowfiend",
            baseDuration: 24000,
            ticks: 16,
            resource: 6
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
        "devouring-plague": { disabled: true },
        "power-infusion": { disabled: true }
    }

}