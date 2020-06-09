const defaultAbilitySettings = {
    "mind-flay": {
        cooldown: 0,
        resource: 12,
        hasted: true,
        casttime: 3000,
        ticks: 4,
        type: "channel",
    },
    "void-bolt": {
        cooldown: 4500,
        resource: 20,
        hasted: true,
        rankTwo: false,
        type: "instant",
        charges: 1,
        extension: 10000
    },
    "void-eruption": {
        cooldown: 0,
        type: "cast",
        casttime: 2000,
        threshold: 90
    },
    "mind-blast": {
        cooldown: 7500,
        resource: 12,
        hasted: true,
        type: "cast",
        casttime: 1500,
        charges: 2,
        cdr: 1500
    },
    "shadow-word-death": {
        cooldown: 9000,
        resource: 15,
        type: "instant",
        charges: 1,
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
    }
}

export default defaultAbilitySettings