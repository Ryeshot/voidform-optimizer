const whatIs = {
    cooldown: "The amount of time, in seconds, it takes for an ability to be able to be recast.",
    charges: "The number of times an ability may be cast while it is on cooldown.",
    hasted: "An ability that is hasted has its cooldown reduced by haste.",
    resourceCast: "The amount of resource an ability will generate upon a successful cast.",
    resourceChannel: "The amount of resource an ability will generate over its complete channel period.",
    castTime: "The amount of time, in seconds, it takes for an ability to be executed.",
    channelTime: "The amount of time, in seconds, it takes for an ability's channel to complete.",
    ticks: "The number of times a channel generates resources over its duration.",
    voidBoltRankTwo: "An extra rank coming to Void Bolt in Shadowlands. It allows Void Bolt to be cast during Mind Flay, without canceling it.",
    voidformThreshold: "The amount of Insanity that is required to cast Void Eruption out of Voidform.",
    voidformStartingDrain: "The starting amount of Insanity being drained every second while in Voidform.",
    voidformDrainRate: "The amount of increasing Insanity drained every second while in Voidform.",
    voidformStartingHaste: "The amount of haste, in percent, that is granted at the start of Voidform.",
    voidformHasteStack: "The amount of haste, in percent, that every stack of Voidform grants.",
    voidformMaximumStacks: "The maximum number of Voidform stacks. Note that reaching the maximum does not stop drain from increasing.",
    lingeringInsanityType: "Lingering Insanity has two types.\nStatic - The length of the aura and haste from stacks are constant.\nDecay - Haste stacks are lost over the aura's duration at a certain rate.",
    lingeringInsanityDuration: "An option for type 'Static'. This is the amount of time, in seconds, that the aura will last.",
    lingeringInsanityAfterVoidformEntry: "An option for type 'Static'. If enabled, then the duration for Lingering Insanity will only start after entering Voidform.",
    lingeringInsanityHasteRetention: "An option for type 'Static. The amount of haste, in percent, that is retained from the final stacks of the previous Voidform.",
    lingeringInsanityDecayRate: "An option for type 'Decay'. The amount of time, in seconds it takes for one stack of the aura to be lost.",
    lingeringInsanityHasteDecay: "An option for type 'Decay'. The amount of haste, in percent, that is removed every time the aura loses a stack."
}

const commonOptions = {
    cooldown: {
        key: "cooldown",
        displayName: "Cooldown",
        type: "time",
        whatIs: whatIs.cooldown
    },
    charges: {
        key: "charges",
        displayName: "Charges",
        type: "number",
        whatIs: whatIs.charges
    },
    hasted: {
        key: "hasted",
        displayName: "Hasted",
        whatIs: whatIs.hasted
    },
    resourceCast: {
        key: "resource",
        displayName: "Resource",
        type: "number",
        whatIs: whatIs.resourceCast
    },
    resourceChannel: {
        key: "resource",
        displayName: "Resource",
        type: "number",
        whatIs: whatIs.resourceChannel
    },
    castTime: {
        key: "casttime",
        displayName: "Cast Time",
        type: "time",
        whatIs: whatIs.castTime
    },
    channelTime: {
        key: "casttime",
        displayName: "Channel Time",
        type: "time",
        whatIs: whatIs.channelTime
    },
    ticks: {
        key: "ticks",
        displayName: "Ticks",
        type: "number",
        whatIs: whatIs.ticks
    }
}


export const abilityOptions = {
    "void-bolt": [
        commonOptions.cooldown,
        commonOptions.hasted,
        commonOptions.charges,
        commonOptions.resourceCast,
        {
            key: "rankTwo",
            displayName: "Rank 2",
            whatIs: whatIs.voidBoltRankTwo
        }
    ],
    "void-eruption": [
        commonOptions.castTime,
        {
            key: "threshold",
            displayName: "Insanity Threshold",
            whatIs: whatIs.voidformThreshold
        }
    ],
    "mind-flay": [
        commonOptions.channelTime,
        commonOptions.resourceChannel,
        commonOptions.ticks
    ],
    "mind-blast": [
        commonOptions.cooldown,
        commonOptions.charges,
        commonOptions.castTime,
        commonOptions.hasted,
        commonOptions.resourceCast
    ],
    "shadow-word-death": [
        commonOptions.cooldown,
        commonOptions.charges,
        commonOptions.castTime,
        commonOptions.hasted,
        commonOptions.resourceCast
    ],
    "void-torrent": [
        commonOptions.cooldown,
        commonOptions.channelTime,
        commonOptions.resourceChannel,
        commonOptions.ticks
    ]
}

export const auraOptions = {
    "voidform": [
        {
            key: "drainStart",
            displayName: "Starting Insanity Drain",
            whatIs: whatIs.voidformStartingDrain
        },
        {
            key: "drainRate",
            displayName: "Insanity Drain Rate",
            whatIs: whatIs.voidformDrainRate
        },
        {
            key: "hasteStart",
            displayName: "Voidform Starting Haste",
            whatIs: whatIs.voidformStartingHaste
        },
        {
            key: "hasteStack",
            displayName: "Voidform Haste Per Stack",
            whatIs: whatIs.voidformHasteStack
        },
        {
            key: "maxStacks",
            displayName: "Maximum Voidform Stacks",
            whatIs: whatIs.voidformMaximumStacks
        }
    ],
    "lingeringInsanity": [
        {
            key: "type",
            displayName: "Aura Type",
            whatIs: whatIs.lingeringInsanityType
        },
        {
            key: "duration",
            displayName: "Aura Duration",
            whatIs: whatIs.lingeringInsanityDuration
        },
        {
            key: "afterVoidformEntry",
            displayName: "After Voidform Entry",
            whatIs: whatIs.lingeringInsanityAfterVoidformEntry
        },
        {
            key: "hasteRetention",
            displayName: "Haste Retained",
            whatIs: whatIs.lingeringInsanityHasteRetention
        },
        {
            key: "decayRate",
            displayName: "Stack Decay Rate",
            whatIs: whatIs.lingeringInsanityDecayRate
        },
        {
            key: "hasteDecay",
            displayName: "Haste Decay Amount",
            whatIs: whatIs.lingeringInsanityHasteDecay
        }
    ]
}