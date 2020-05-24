const abilitySettings = {
    "mind-flay": {
        cooldown: 0,
        resource: editableField(12),
        hasted: uneditableFIeld(true),
        castTime: editableField(3000),
        type: uneditableField("channel")
    },
    "void-bolt": {
        cooldown: editableField(4500),
        resource: editableField(20),
        rankTwo: editableField(false),
        hasted: editableField(true),
        type: uneditableField("instant"),
        charges: editableField(1)
    },
    "void-eruption": {
        castTime: editableField(2000),
        threshold: editableField(90),
        type: uneditableField("cast")
    },
    "mind-blast": {
        cooldown: editableField(7500),
        resource: editableField(12),
        hasted: editableField(true),
        type: uneditableField("cast"),
        casttime: editableField(1500),
        charges: editableField(1)
    },
    "shadow-word-death": {
        cooldown: editableField(9000),
        resource: editableField(15),
        type: uneditableField(15),
        charges: editableField(2)
    }
}

const editableField = (value) => {editable: true, value}
const uneditableField = (value) => {editable: false, value}

export default abilitySettings