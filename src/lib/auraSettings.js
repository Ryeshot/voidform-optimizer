const defaultAuraSettings = {
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
}

export default defaultAuraSettings