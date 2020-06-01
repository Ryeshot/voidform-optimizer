const defaultAuraSettings = {
    voidform: {
        displayName: "Voidform",
        drainStart: 6,
        drainRate: .72,
        hasteStart: 0,
        hasteStack: .02,
        maxStacks: 0
    },
    lingeringInsanity: {
        displayName: "Lingering Insanity",
        type: "static",
        static: {
            duration: 0,
            afterVoidformEntry: false,
            hasteRetention: 1
        },
        decay: {
            rate: 3000,
            haste: .01
        }
    },
    shadowWordPain: {

    },
    vampiricTouch: {
        
    }
}

export default defaultAuraSettings