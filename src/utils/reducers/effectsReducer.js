export default (state, action) => {
    if(!action.category === "EFFECT") return state
    switch(action.type){
        case "EFFECT_ACTIVATE":
            var {name} = action.payload
            var effect = state[name]
            return {...state, [name]: {...effect, active: true}}
        case "EFFECT_DEACTIVATE":
            var {name} = action.payload
            var effect = state[name]
            return {...state, [name]: {...effect, active: false}}
    }

    return state
}