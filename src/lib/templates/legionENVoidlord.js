import defaultAbilitySettings from "../abilitySettings"
import defaultAuraSettings from "../auraSettings"

export default {
    displayName: "Legion: EN + Void Lord",
    abilitySettings: {
        ...defaultAbilitySettings,
        "void-eruption": {
            cooldown: 0,
            type: "cast",
            casttime: 2500,
            resource: 90,
            costsResource: true
        },
        "void-torrent": {
            cooldown: 60000,
            resource: 0,
            type: "channel",
            casttime: 4000,
            staticCastTime: true,
            ticks: 10,
        },
        "shadowfiend": {
            cooldown: 180000,
            resource: 0,
            type: "instant"
        }
    },
    auraSettings: {
        ...defaultAuraSettings,
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
            type: "static",
            duration: 8000,
            afterVoidformEntry: true,
            hasteRetention: 1,
            decayRate: 1000,
            hasteDecay: .01
        },
        "shadowfiend": {
            displayName: "Shadowfiend",
            baseDuration: 15000,
            ticks: 10,
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
        "void-torrent": {},
        "shadow-word-pain": {},
        "vampiric-touch": {},
        "devouring-plague": { disabled: true }
    }

}