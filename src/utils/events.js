const events = {
    "CAST": [
        "ABILITY_CAST_SUCCESS",
        "ABILITY_COOLDOWN_START",
        "ABILITY_COOLDOWN_END",
        "ABILITY_CAST_START",
        "ABILITY_CAST_END",
        "ABILITY_CHANNEL_START",
        "ABILITY_CHANNEL_UPDATE",
        "ABILITY_CHANNEL_END"
    ],
    "RESOURCE": [
        "RESOURCE_UPDATE",
        "INSANITY_DRAIN_PAUSE_START",
        "INSANITY_DRAIN_PAUSE_END"
    ],
    "AURA": [
        "VOIDFORM_START",
        "VOIDFORM_UPDATE",
        "VOIDFORM_END",
        "LINGERING_INSANITY_START",
        "LINGERING_INSANITY_UPDATE",
        "LINGERING_INSANITY_END"
    ],
    "STAT": ["HASTE_UPDATE"]
}

export default events