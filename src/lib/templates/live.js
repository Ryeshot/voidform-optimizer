export default {
    abilitySettings: {
        "mind-flay": {
            cooldown: 0,
            resource: 12,
            hasted: true,
            casttime: 3000,
            ticks: 4,
            type: "channel",
        },
        "mind-sear": {
            cooldown: 0,
            resource: 5,
            hasted: true,
            casttime: 3000,
            ticks: 4,
            targetCount: 1,
            type: "channel",
        },
        "void-bolt": {
            cooldown: 4500,
            resource: 20,
            hasted: true,
            rankTwo: false,
            type: "instant",
            charges: 1,
            extension: 3000
        },
        "void-eruption": {
            cooldown: 0,
            type: "cast",
            casttime: 2000,
            resource: 90,
            costsResource: true
        },
        "mind-blast": {
            cooldown: 7500,
            resource: 12,
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
        "shadow-word-pain": {
            cooldown: 0,
            resource: 4,
            type: "instant"
        },
        "vampiric-touch": {
            cooldown: 0,
            resource: 6,
            type: "cast",
            casttime: 1500
        },
        "devouring-plague": {
            cooldown: 0,
            resource: 50,
            costsResource: true,
            type: "instant"
        }
    },
    auraSettings: {
        stats: {
            displayName: "Stats",
            haste: 0
        },
        voidform: {
            displayName: "Voidform",
            drainStart: 6,
            drainRate: .72,
            hasteStart: 0,
            hasteStack: .005,
            maxStacks: 0
        },
        lingeringInsanity: {
            displayName: "Lingering Insanity",
            type: "decay",
            duration: 60000,
            afterVoidformEntry: false,
            hasteRetention: 1,
            decayRate: 3000,
            hasteDecay: .01
        },
        "shadow-word-pain": {
            displayName: "Shadow Word: Pain",
            baseDuration: 16000,
            ticks: 8,
            resource: 0
        },
        "vampiric-touch": {
            displayName: "Vampiric Touch",
            baseDuration: 21000,
            ticks: 7,
            resource: 0
        },
        "devouring-plague": {
            displayName: "Devouring Plague",
            baseDuration: 12000,
            ticks: 4,
            resource: 0
        }
    },
    abilityConfig: {
        "mind-flay": {},
        "mind-sear": {},
        "void-bolt": {},
        "void-eruption": {},
        "mind-blast": {},
        "shadow-word-death": { disabled: true },
        "void-torrent": { disabled: true },
        "shadow-word-pain": {},
        "vampiric-touch": {},
        "devouring-plague": { disabled: true }
    }
}