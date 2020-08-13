const abilityEvents = {
    "void-bolt": {
        onEvent: {
            "COOLDOWN_START": ["ABILITY_COOLDOWN_START"],
            "COOLDOWN_END": ["ABILITY_COOLDOWN_END"],
            "CAST_SUCCESS": ["ABILITY_CAST_SUCCESS", "RESOURCE_UPDATE", "DOT_EXTEND"],
            "CHARGE_UPDATE": ["ABILITY_CHARGE_UPDATE"]
        }
    },
    "mind-flay": {
        onEvent: {
            "COOLDOWN_START": [],
            "COOLDOWN_END": [],
            "CHANNEL_START": ["ABILITY_CHANNEL_START"],
            "CHANNEL_UPDATE": ["ABILITY_CHANNEL_UPDATE", "RESOURCE_UPDATE"],
            "CHANNEL_END": ["ABILITY_CHANNEL_END"]
        }
    },
    "mind-sear": {
        onEvent: {
            "COOLDOWN_START": [],
            "COOLDOWN_END": [],
            "CHANNEL_START": ["ABILITY_CHANNEL_START"],
            "CHANNEL_UPDATE": ["ABILITY_CHANNEL_UPDATE", "RESOURCE_UPDATE"],
            "CHANNEL_END": ["ABILITY_CHANNEL_END"]
        }
    },
    "void-eruption": {
        onEvent: {
            "CAST_START": ["ABILITY_CAST_START"],
            "CAST_SUCCESS": ["ABILITY_CAST_SUCCESS", "VOIDFORM_START"],
            "CHARGES_UPDATE": ["ABILITY_CHARGE_UPDATE"],
            "COOLDOWN_START": ["ABILITY_COOLDOWN_START"],
            "COOLDOWN_END": ["ABILITY_COOLDOWN_END"]
        }
    },
    "mind-blast": {
        onEvent: {
            "CAST_START": ["ABILITY_CAST_START"],
            "CAST_SUCCESS": ["ABILITY_CAST_SUCCESS", "RESOURCE_UPDATE"],
            "CHARGES_UPDATE": ["ABILITY_CHARGE_UPDATE"],
            "COOLDOWN_START": ["ABILITY_COOLDOWN_START"],
            "COOLDOWN_END": ["ABILITY_COOLDOWN_END"]
        }
    },
    "shadow-word-death": {
        onEvent: {
            "COOLDOWN_START": ["ABILITY_COOLDOWN_START"],
            "COOLDOWN_END": ["ABILITY_COOLDOWN_END"],
            "CAST_SUCCESS": ["ABILITY_CAST_SUCCESS", "RESOURCE_UPDATE"],
            "CHARGES_UPDATE": ["ABILITY_CHARGE_UPDATE"]
        }
    },
    "void-torrent": {
        onEvent: {
            "COOLDOWN_START": ["ABILITY_COOLDOWN_START"],
            "CHARGES_UPDATE": ["ABILITY_CHARGE_UPDATE"],
            "COOLDOWN_END": ["ABILITY_COOLDOWN_END"],
            "CHANNEL_START": ["ABILITY_CHANNEL_START", "INSANITY_DRAIN_PAUSE_START"],
            "CHANNEL_UPDATE": ["RESOURCE_UPDATE"],
            "CHANNEL_END": ["ABILITY_CHANNEL_END", "INSANITY_DRAIN_PAUSE_END"]
        }
    },
    "shadow-word-pain": {
        onEvent: {
            "CAST_SUCCESS": ["ABILITY_CAST_SUCCESS", "AURA_START", "RESOURCE_UPDATE"]
        }
    },
    "vampiric-touch": {
        onEvent: {
            "CAST_START": ["ABILITY_CAST_START"],
            "CAST_SUCCESS": ["ABILITY_CAST_SUCCESS", "AURA_START", "RESOURCE_UPDATE"]
        }
    },
    "devouring-plague": {
        onEvent: {
            "COOLDOWN_START": ["ABILITY_COOLDOWN_START"],
            "CHARGES_UPDATE": ["ABILITY_CHARGE_UPDATE"],
            "COOLDOWN_END": ["ABILITY_COOLDOWN_END"],
            "CAST_START": ["ABILITY_CAST_START"],
            "CAST_SUCCESS": ["ABILITY_CAST_SUCCESS", "AURA_START", "RESOURCE_UPDATE"]
        }
    },
    "shadowfiend": {
        onEvent: {
            "COOLDOWN_START": ["ABILITY_COOLDOWN_START"],
            "COOLDOWN_END": ["ABILITY_COOLDOWN_END"],
            "CAST_SUCCESS": ["ABILITY_CAST_SUCCESS", "AURA_START", "RESOURCE_UPDATE"],
            "CHARGES_UPDATE": ["ABILITY_CHARGE_UPDATE"]
        }
    },
    "power-infusion": {
        onEvent: {
            "COOLDOWN_START": ["ABILITY_COOLDOWN_START"],
            "COOLDOWN_END": ["ABILITY_COOLDOWN_END"],
            "CAST_SUCCESS": ["ABILITY_CAST_SUCCESS", "AURA_START"],
            "CHARGES_UPDATE": ["ABILITY_CHARGE_UPDATE"]
        }
    },
    "fae-blessings": {
        onEvent: {
            "COOLDOWN_START": ["ABILITY_COOLDOWN_START"],
            "COOLDOWN_END": ["ABILITY_COOLDOWN_END"],
            "CAST_SUCCESS": ["ABILITY_CAST_SUCCESS", "AURA_START"],
            "CHARGES_UPDATE": ["ABILITY_CHARGE_UPDATE"]
        }
    },
    "bloodlust": {
        onEvent: {
            "COOLDOWN_START": ["ABILITY_COOLDOWN_START"],
            "COOLDOWN_END": ["ABILITY_COOLDOWN_END"],
            "CAST_SUCCESS": ["ABILITY_CAST_SUCCESS", "AURA_START"],
            "CHARGES_UPDATE": ["ABILITY_CHARGE_UPDATE"]
        }
    }
}

export default abilityEvents