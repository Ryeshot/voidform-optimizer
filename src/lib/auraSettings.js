const defaultAuraSettings = {
    voidform: {
        displayName: "Voidform",
        drainStart: 6,
        drainRate: 1.44,
        hasteStart: 0,
        hasteStack: .02,
        maxStacks: 0
    },
    lingeringInsanity: {
        displayName: "Lingering Insanity",
        type: "decay",
        duration: 10000,
        afterVoidformEntry: true,
        hasteRetention: 1,
        decayRate: 3000,
        hasteDecay: .01
    },
    shadowWordPain: {
        displayName: "Shadow Word: Pain"
    },
    vampiricTouch: {
        displayName: "Vampiric Touch"
    }
}

export default defaultAuraSettings