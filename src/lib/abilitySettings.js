const defaultAbilitySettings = {
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
        hasted: false,
        type: "instant",
        charges: 1,
    },
    "void-torrent": {
        cooldown: 45000,
        resource: 30,
        type: "channel",
        casttime: 4000,
        staticCastTime: true,
        ticks: 10,
        requireVoidform: false
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
    },
    "shadowfiend": {
        cooldown: 180000,
        resource: 3,
        type: "instant"
    },
    "power-infusion": {
        cooldown: 120000,
        type: "instant"
    },
    "bloodlust": {
        cooldown: 300000,
        ignoreGcd: true,
        type: "instant"
    }
}

export default defaultAbilitySettings