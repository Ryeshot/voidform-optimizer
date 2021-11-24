const events = {
    "SPELL": [
        "ABILITY_CAST_SUCCESS",
        "ABILITY_COOLDOWN_START",
        "ABILITY_COOLDOWN_END",
        "ABILITY_CAST_START",
        "ABILITY_CHANNEL_START",
        "ABILITY_CHANNEL_UPDATE",
        "ABILITY_CHANNEL_END",
        "ABILITY_CHARGE_UPDATE"
    ],
    "RESOURCE": [
        "RESOURCE_UPDATE"
    ],
    "AURA": [
        "VOIDFORM_START",
        "VOIDFORM_UPDATE",
        "VOIDFORM_END",
        "INSANITY_DRAIN_PAUSE_START",
        "INSANITY_DRAIN_PAUSE_END",
        "LINGERING_INSANITY_START",
        "LINGERING_INSANITY_UPDATE",
        "LINGERING_INSANITY_END",
        "AURA_START",
        "AURA_BEGIN",
        "AURA_END",
        "AURA_REFRESH",
        "AURA_STACK_UPDATE"
    ],
    "STAT": [
        "HASTE_UPDATE", 
        "HASTE_RESET"
    ],
    "EFFECT": [
        "EFFECT_ACTIVATE",
        "EFFECT_DEACTIVATE"
    ]
}

export default events