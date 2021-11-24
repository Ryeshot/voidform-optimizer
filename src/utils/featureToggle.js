export default {
    isAbilityEnabled: (name) => {
        if(name === "fae-blessings") return false
        return true
    },
    isEffectEnabled: (name) => {
        if(name === "dark-thoughts") return false
        return true
    }
}