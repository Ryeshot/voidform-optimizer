import abilitySettings from "./abilitySettings"
import auraSettings from "./auraSettings"

const parseAbility = (ability, key) => {
    let abilitySetting = abilitySettings[key]
    let result = Object.keys(abilitySetting).reduce((obj, k) => {
        let userSetting = ability[k]
        let setting = abilitySetting[k]

        if(!userSetting) throw new Error("Missing ability setting in input")
        if(setting.editable) throw new Error("Invalid setting provided")
        if(typeof userSetting !== typeof setting[k].value) throw new Error("Ability setting has invalid format")
        
        obj[k] = {
            value: userSetting,
            editable: true
        }
    }, {})

    return {...result, ...setting}
}

const parseAbilitySettings = (abilities) => {
    let result = {}

    Object.keys(abilitySettings).forEach(a => {
        let ability = abilities[a]
        //either default or throw

        if(!ability) throw new Error("Missing ability in input")

        result[a] = parseAbility(ability, a)
    })

    return result
}

const parseAura = (aura, key) => {
    let auraSetting = auraSettings[key]

    let result = Object.keys(auraSetting).reduce((obj, k) => {
        let userSetting = aura[k]
        let setting = auraSetting[k]

        if(!userSetting) throw new Error("Missing aura setting in input")
        if(typeof userSetting !== typeof setting) throw new Error("Aura setting has invalid format")
    }, {})

    return result
}

const parseAuraSettings = (auraa) => {
    let result = {}
    Object.keys(auraSettings).forEach(a => {
        let aura = auras[a]

        if(!aura) throw new Error("Missing aura in input")

        result[a] = parseAura(aura, a)
    })

    return result
}

const importSettings = (settings) => {

    try {
        let parsedSettings = JSON.parse(settings)

        let parsedAbilitySettings = parseAbilitySettings(parsedSettings.abilitySettings)
        let parsedAuraSettings = parseAuraSettings(parsedSettings.auraSettings)

        return {
            abilitySettings: parsedAbilitySettings, 
            auraSettings: parsedAuraSettings
        }
    }

    catch(e) {
        throw new Error("An error occurred while parsing input data.")
    }
}

const formatSingleAbilitySetting = (setting) => {
    let result = Object.keys(setting).reduce((obj, k) => {
        if(!setting[k].editable) return
        obj[k] = setting[k].value
    }, {})

    return result
}

const formatAbilitySettingsForExport = (settings) => {
    let result = Object.keys(settings).reduce((obj, k) => {
        let ability = settings[k]
        let formattedAbility = formatSingleAbilitySetting(ability)
        obj[k] = formattedAbility
    }, {})

    return result
}

const exportSettings = (currentSettings) => {
    let formattedAbilitySettings = formatAbilitySettingsForExport(currentSettings.abilitySettings)

    let combined =  {
        abilitySettings: formattedAbilitySettings,
        auraSettings: currentSettings.auraSettings
    }

    let result = JSON.stringify(combined)

    return result
}