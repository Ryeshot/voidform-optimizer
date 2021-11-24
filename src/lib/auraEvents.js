const auraEvents = {
    "voidform": {
        onEvent: {
            "AURA_START": ["AURA_BEGIN", "HASTE_UPDATE"],
            "AURA_UPDATE": [],
            "AURA_TIME_UPDATE": [],
            "AURA_END": ["AURA_END"]
        }
    },
    "lingeringInsanity": {
        onEvent: {
            "AURA_START": [],
            "AURA_UPDATE": [],
            "AURA_TIME_UPDATE": [],
            "AURA_END": []
        }
    },
    "shadow-word-pain": {
        onEvent: {
            "AURA_START": [],
            "AURA_UPDATE": [],
            "AURA_TIME_UPDATE": [],
            "AURA_END": []
        }
    },
    "vampiric-touch": {
        onEvent: {
            "AURA_START": [],
            "AURA_UPDATE": [],
            "AURA_TIME_UPDATE": [],
            "AURA_END": []
        }
    },
    "power-infusion": {
        onEvent: {
            "AURA_START": ["AURA_BEGIN", "HASTE_UPDATE"],
            "AURA_END": ["AURA_END", "HASTE_RESET"]
        }
    },
    "fae-blessings": {
        onEvent: {
            "AURA_START": ["AURA_BEGIN"],
            "AURA_END": ["AURA_END"]   
        }
    },
    "bloodlust": {
        onEvent: {
            "AURA_START": ["AURA_BEGIN", "HASTE_UPDATE"],
            "AURA_END": ["AURA_END", "HASTE_RESET"]
        }
    },
    "dark-thoughts": {
        onEvent: {
            "AURA_START": ["AURA_BEGIN"],
            "AURA_END": ["AURA_END"]
        }
    },
}

export default auraEvents