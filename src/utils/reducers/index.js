import abilitiesReducer from "./abilitiesReducer"
import aurasReducer from "./aurasReducer"
import effectReducer from "./effectsReducer"
import defaultState from "./defaultState"

const updateAbilitiesAfterResourceChange = (abilitySettings, abilities, resource, voidform) => {
    Object.keys(abilitySettings).forEach(k => {
        const setting = abilitySettings[k]
        const ability = abilities[k]
        const unusable = (voidform.active && !!setting.requireNoVoidform) || (!voidform.active && !!setting.requireVoidform)
        if(!ability) return
        if(!setting.resourceCost) {
          ability.unusable = unusable
          return
        }
        if(setting.costType === "dump") 
          ability.unusable = resource === 0 || unusable
        else {
          ability.unusable = resource < setting.resourceCost || unusable
        }
    })
}

export default (auraSettings, abilitySettings, abilities) => [(state, action) => {
    const {auras} = state
    const payload = action.payload

    if(!action.category || action.category === "RESOURCE")
        switch(action.type) {
            case "RESET":
                return {...defaultState, resource: auraSettings.stats.startingInsanity }
            case "RESET_ABILITIES":
                return {...defaultState, resource: auraSettings.stats.startingInsanity, auras: state.auras}
            case "RESET_AURAS":
                return {...state, resource: auraSettings.stats.startingInsanity, auras: {...defaultState.auras, stats: state.auras.stats} }
            case "RESOURCE_UPDATE":
                var {name, resource, resourceCost} = payload
                resourceCost = resourceCost || 0
                resource = (resource + (resourceCost * -1))   
                resource = Math.max(Math.min(state.resource + resource, 100), 0)

                updateAbilitiesAfterResourceChange(abilitySettings, abilities, resource, auras.voidform)

                return {...state, resource}
            case "ABILITY_ACTIVATE":
                var {name} = payload
                abilities[name].unusable = false
                return state
            case "ABILITY_DEACTIVATE":
                var {name} = payload
                abilities[name].unusable = true
                return state
        }
        
    return {
        resource: state.resource,
        abilities: abilitiesReducer(state.abilities, action),
        auras: aurasReducer(state.auras, action),
        effects: effectReducer(state.effects, action)
    }
}, defaultState]