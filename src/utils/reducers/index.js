import abilitiesReducer from "./abilitiesReducer"
import aurasReducer from "./aurasReducer"
import defaultState from "./defaultState"

export default (auraSettings) => [(state, action) => {

    const {abilities, auras} = state
    const payload = action.payload

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
            return {...state, resource}
            // //whenever we get resource need to calculate if an ability is usable or not
            // Object.keys(abilitySettings).forEach(k => {
            //   const setting = abilitySettings[k]
            //   const ability = newState.abilities[k]
            //   const unusable = (voidform.active && !!setting.requireNoVoidform) || (!voidform.active && !!setting.requireVoidform)
              
            //   if(!ability) return
            //   if(!setting.resourceCost) {
            //     ability.unusable = unusable
            //     return
            //   }
            //   if(setting.costType === "dump") 
            //     ability.unusable = resource === 0 || unusable
            //   else {
            //     ability.unusable = resource < setting.resourceCost || unusable
            //   }
            // })
    }
    return {
        resource: state.resource,
        abilities: abilitiesReducer(state.abilities, action),
        auras: aurasReducer(state.auras, action)
    }
}, defaultState]