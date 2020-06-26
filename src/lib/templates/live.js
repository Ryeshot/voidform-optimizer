import defaultAbilitySettings from "../abilitySettings"
import defaultAuraSettings from "../auraSettings"

export default {
    displayName: "Live",
    abilitySettings: {
        ...defaultAbilitySettings,
        "void-eruption": {
            cooldown: 0,
            type: "cast",
            casttime: 1500,
            resource: 90,
            costsResource: true
        },
        "mind-blast": {
            cooldown: 9000,
            resource: 15,
            hasted: true,
            type: "cast",
            casttime: 1500,
            charges: 1,
            cdr: 1500
        },
        "shadow-word-death": {
            cooldown: 9000,
            resource: 15,
            type: "instant",
            charges: 2,
        },
        "void-torrent": {
            cooldown: 45000,
            resource: 30,
            type: "channel",
            casttime: 4000,
            ticks: 10,
        },
        "shadowfiend": {
            cooldown: 180000,
            resource: 3,
            type: "instant"
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
        "shadowfiend": {}
    }
}