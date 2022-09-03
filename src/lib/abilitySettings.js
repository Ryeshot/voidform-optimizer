export default {
    "mind-flay": {
        cooldown: 0,
        resource: 18,
        hasted: true,
        casttime: 4500,
        ticks: 6,
        type: "channel",
    },
    "mind-sear": {
        cooldown: 0,
        resource: 6,
        hasted: true,
        casttime: 4500,
        ticks: 6,
        targetCount: 1,
        type: "channel",
    },
    "void-bolt": {
        cooldown: 4500,
        resource: 12,
        hasted: true,
        rankTwo: false,
        type: "instant",
        charges: 1,
        extension: 3000
    },
    "void-eruption": {
        cooldown: 90000,
        type: "cast",
        casttime: 1500,
        resourceCost: 0,
    },
    "mind-blast": {
        cooldown: 7500,
        resource: 8,
        hasted: true,
        type: "cast",
        casttime: 1500,
        charges: 1,
        cdr: 0
    },
    "shadow-word-death": {
        cooldown: 20000,
        resource: 0,
        hasted: true,
        type: "instant",
        charges: 1,
    },
    "void-torrent": {
        cooldown: 30000,
        resource: 60,
        type: "channel",
        casttime: 3000,
        staticCastTime: true,
        ticks: 4,
        requireVoidform: false
    },
    "shadow-word-pain": {
        cooldown: 0,
        resource: 4,
        type: "instant"
    },
    "vampiric-touch": {
        cooldown: 0,
        resource: 5,
        type: "cast",
        casttime: 1500
    },
    "devouring-plague": {
        costType: "static",
        cooldown: 0,
        resource: 0,
        resourceCost: 50,
        requireNoVoidform: false,
        type: "instant"
    },
    "shadowfiend": {
        cooldown: 180000,
        resource: 0,
        type: "instant"
    },
    "power-infusion": {
        cooldown: 120000,
        type: "instant",
        ignoreGcd: true
    },
    "fae-blessings": {
        cooldown: 90000,
        type: "instant"
    },
    "bloodlust": {
        cooldown: 300000,
        ignoreGcd: true,
        type: "instant"
    }
}