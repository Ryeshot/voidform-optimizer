import {Base64} from "js-base64"
import abilitySettings from "../lib/abilitySettings"
import auraSettings from "../lib/auraSettings"

const parseAbility = (ability, key) => {
    let abilitySetting = abilitySettings[key]
    let result = Object.keys(abilitySetting).reduce((obj, k) => {
        let userSetting = ability[k]
        //might want to look at options
        let setting = abilitySetting[k]

        //if(userSetting === null || userSetting === undefined) throw new Error("Missing ability setting in input " + k)

        if(userSetting && typeof userSetting !== typeof setting) throw new Error("Ability setting has invalid format")
        
        obj[k] = userSetting !== undefined ? userSetting : setting

        return obj
    }, {})

    return result
}

const parseAbilitySettings = (abilities) => {
    let result = {}

    Object.keys(abilitySettings).forEach(a => {
        let ability = abilities[a] || abilitySettings[a]

        result[a] = parseAbility(ability, a)
    })

    return result
}

const parseAura = (aura, key) => {
    let auraSetting = auraSettings[key]

    let result = Object.keys(auraSetting).reduce((obj, k) => {
        let userSetting = aura[k]
        let setting = auraSetting[k]

        //if(userSetting === null || auraSetting === undefined) throw new Error("Missing aura setting in input " + k)
        if(userSetting && typeof userSetting !== typeof setting) throw new Error(`Aura setting has invalid format`)

        obj[k] = userSetting !== undefined ? userSetting : setting

        return obj
    }, {})

    return result
}

const parseAuraSettings = (auras) => {
    let result = {}
    Object.keys(auraSettings).forEach(a => {
        let aura = auras[a] || auraSettings[a]

        //if(!aura) throw new Error("Missing aura in input")

        result[a] = parseAura(aura, a)
    })

    return result
}

export const importSettings = (settings, includeKeybinds, includeSpellOrder) => {

    try {
        let parsedSettings = JSON.parse(Base64.decode(settings))

        console.log(parsedSettings.auraSettings)

        let abilitySettings = parseAbilitySettings(parsedSettings.abilitySettings)
        let auraSettings = parseAuraSettings(parsedSettings.auraSettings)
        let abilityConfig = formatAbilityConfig(parsedSettings.abilityConfig, includeKeybinds, includeSpellOrder)

        return {
            abilitySettings,
            auraSettings,
            abilityConfig
        }
    }

    catch(e) {
        throw new Error("An error occurred while parsing input data.\nReason: " + e.message)
    }
}

const formatSingleAbilitySetting = (setting) => {
    let result = Object.keys(setting).reduce((obj, k) => {
        obj[k] = setting[k]
        return obj
    }, {})

    return result
}

const formatAbilitySettingsForExport = (settings) => {
    let result = Object.keys(settings).reduce((obj, k) => {
        let ability = settings[k]
        let formattedAbility = formatSingleAbilitySetting(ability)
        obj[k] = formattedAbility
        return obj
    }, {})

    return result
}

const formatAbilityConfig = (settings, includeKeybinds, includeSpellOrder) => {
    let result = Object.keys(settings).reduce((result, k) => {
        let {keybind, disabled, index} = settings[k]

        result[k] = {disabled: !!disabled}
        if(includeKeybinds && keybind) result[k].keybind = keybind
        if(includeSpellOrder && index) result[k].index = index
        
        return result
    }, {})

    return result
}

export const exportSettings = (currentSettings) => {
    let formattedAbilitySettings = formatAbilitySettingsForExport(currentSettings.abilitySettings)
    let formattedAbilityConfig = formatAbilityConfig(currentSettings.abilities, true, true)

    let combined =  {
        abilitySettings: formattedAbilitySettings,
        auraSettings: currentSettings.auraSettings,
        abilityConfig: formattedAbilityConfig
    }

    let result = Base64.encode(JSON.stringify(combined))

    return result
}