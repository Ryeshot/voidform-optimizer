const editableField = (value) => ({editable: true, value})
const uneditableField = (value) => ({editable: false, value})

const abilitySettings = {
    "mind-flay": {
        cooldown: uneditableField(0),
        resource: editableField(12),
        hasted: uneditableField(true),
        casttime: editableField(3000),
        ticks: editableField(4),
        type: uneditableField("channel")
    },
    "void-bolt": {
        cooldown: editableField(4500),
        resource: editableField(20),
        rankTwo: editableField(false),
        hasted: editableField(true),
        charges: editableField(1),
        type: uneditableField("instant")
    },
    "void-eruption": {
        casttime: editableField(2000),
        threshold: editableField(90),
        type: uneditableField("cast")
    },
    "mind-blast": {
        cooldown: editableField(7500),
        resource: editableField(12),
        hasted: editableField(true),
        casttime: editableField(1500),
        charges: editableField(2),
        type: uneditableField("cast")
    },
    "shadow-word-death": {
        cooldown: editableField(9000),
        resource: editableField(15),
        charges: editableField(2),
        type: uneditableField("instant"),
    },
    "void-torrent": {
        cooldown: editableField(45000),
        resource: editableField(30),
        casttime: editableField(4000),
        ticks: editableField(10),
        type: uneditableField("channel")
    }
}

export default abilitySettings