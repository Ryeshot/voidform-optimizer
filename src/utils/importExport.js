import abilitySettings from "./abilitySettings"
import auraSettings from "./auraSettings"

const parseAbility = (ability, key) => {
    let abilitySetting = abilitySettings[key]
    let result = Object.keys(abilitySetting).reduce((obj, k) => {
        let userSetting = ability[k]
        let setting = abilitySetting[k]

        if(!setting.editable) {
            if(userSetting) throw new Error("Invalid setting provided")
            obj[k] = setting
            return obj
        }

        if((userSetting === null || userSetting === undefined) && setting.editable) throw new Error("Missing ability setting in input " + k)

        console.log(key)
        console.log(userSetting)
        console.log(setting.value)

        if(typeof userSetting !== typeof setting.value) throw new Error("Ability setting has invalid format")
        
        obj[k] = {
            value: userSetting,
            editable: true
        }

        return obj
    }, {})

    return result
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

        if(userSetting === null || auraSetting === undefined) throw new Error("Missing aura setting in input " + k)
        if(typeof userSetting !== typeof setting) throw new Error("Aura setting has invalid format")

        obj[k] = userSetting

        return obj
    }, {})

    return result
}

const parseAuraSettings = (auras) => {
    let result = {}
    Object.keys(auraSettings).forEach(a => {
        let aura = auras[a]

        if(!aura) throw new Error("Missing aura in input")

        result[a] = parseAura(aura, a)
    })

    return result
}

export const importSettings = (settings) => {

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
        throw new Error("An error occurred while parsing input data.\nReason: " + e.message)
    }
}

const formatSingleAbilitySetting = (setting) => {
    let result = Object.keys(setting).reduce((obj, k) => {
        console.log(k)
        console.log(setting[k])
        if(!setting[k].editable) return obj
        obj[k] = setting[k].value
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

export const exportSettings = (currentSettings) => {
    let formattedAbilitySettings = formatAbilitySettingsForExport(currentSettings.abilitySettings)

    let combined =  {
        abilitySettings: formattedAbilitySettings,
        auraSettings: currentSettings.auraSettings
    }

    let result = JSON.stringify(combined)

    return result
}