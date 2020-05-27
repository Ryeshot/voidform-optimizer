const abilities = {
    "mind-flay": {
        cooldown: 0,
        resource: 12,
        hasted: true,
        casttime: 3000,
        ticks: 4,
        type: "channel",
        keybind: "e",
        icon: "images/mind-flay.jpg"
    },
    "void-bolt": {
        cooldown: 4500,
        resource: 20,
        hasted: true,
        type: "instant",
        charges: 1,
        keybind: "1",
        icon: "images/void-bolt.jpg"
    },
    "void-eruption": {
        cooldown: 0,
        type: "cast",
        keybind: "1",
        casttime: 2000,
        icon: "images/void-eruption.jpg"
    },
    "mind-blast": {
        cooldown: 7500,
        resource: 12,
        hasted: true,
        type: "cast",
        casttime: 1500,
        charges: 3,
        keybind: "r",
        icon: "images/mind-blast.jpg"
    },
    "shadow-word-death": {
        cooldown: 9000,
        resource: 15,
        type: "instant",
        charges: 2,
        keybind: "2",
        icon: "images/shadow-word-death.jpg"
    },
    "void-torrent": {
        cooldown: 45000,
        resource: 30,
        type: "channel",
        keybind: "3",
        casttime: 4000,
        ticks: 10,
        icon: "images/void-torrent.jpg"
    }
}

export default abilities