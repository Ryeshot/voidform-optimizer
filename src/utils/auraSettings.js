const defaultAuraSettings = {
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
        static: {
            duration: 60,
            afterVoidformEntry: false,
            hasteRetention: 1
        },
        decay: {
            rate: 3000,
            haste: .01
        }
    }
}

export default defaultAuraSettings