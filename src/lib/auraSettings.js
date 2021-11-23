const defaultAuraSettings = {
    stats: {
        displayName: "Passive",
        haste: 0,
        startingInsanity: 0
    },
    voidform: {
        displayName: "Voidform",
        type: "static",
        drainStart: 0,
        drainRate: 0,
        hasteStart: 0,
        hasteStack: 0,
        maxStacks: 0,
        gainInsanity: true,
        baseDuration: 15000
    },
    lingeringInsanity: {
        displayName: "Lingering Insanity",
        type: "static",
        duration: 0,
        afterVoidformEntry: false,
        hasteRetention: 1,
        decayRate: 3000,
        hasteDecay: .01,
        enbaled: false
    },
    "shadow-word-pain": {
        displayName: "Shadow Word: Pain",
        baseDuration: 16000,
        ticks: 8,
        resource: 0,
        hasted: true,
        type: "pandemic"
    },
    "vampiric-touch": {
        displayName: "Vampiric Touch",
        baseDuration: 21000,
        ticks: 7,
        resource: 0,
        hasted: true,
        type: "pandemic"
    },
    "devouring-plague": {
        displayName: "Devouring Plague",
        baseDuration: 6000,
        ticks: 2,
        resource: 0,
        hasted: true,
        type: "rolling"
    },
    "shadowfiend": {
        displayName: "Shadowfiend",
        baseDuration: 15000,
        ticks: 10,
        resource: 3
    },
    "power-infusion": {
        displayName: "Power Infusion",
        baseDuration: 20000,
        haste: .25,
        resourceGen: 0
    },
    "bloodlust": {
        displayName: "Bloodlust",
        baseDuration: 40000,
        haste: .3
    },
    "dark-thoughts": {
        displayName: "Dark Thoughts",
        baseDuration: 15000,
        maxStacks: 1
    }
}

export default defaultAuraSettings