class Ability {


    static create(type, initialState, updateFn, onExecute) {
    }

    startCooldown() {
        let state = this.state
        this.cooldownTimer = setInterval(() => {
            let now = Date.now()
            let cooldownState = {
                startTime: (state.cooldownStartTime || now),
                cooldown: state.cooldownDuration
            }
            let remaining = (cooldownState.startTime + cooldownState.cooldown) - now

            if(remaining <= interval + lag) {
                updateState(state => {return {charges: charges+1, ...state}})

                clearInterval(this.cooldownTimer)

                if(state.maxCharges && state.charges < state.maxCharges) {
                    this.startCooldown()
                    return
                }
                
                onAbilityUpdate({
                    type: "ABILITY_COOLDOWN_END",
                    payload: {
                        name
                    }
                })

                setProgress(0)

                return
            }
            updateState(state => {return {progress: remaining/cooldownState.cooldown, ...state}})

        }, interval)

        onAbilityUpdate({
            type: "ABILITY_COOLDOWN_START",
            payload: {
                name,
                time: Date.now()
            }
        })
    }

    beginGlobalCooldown() {
        let state = this.state

        if(state.onCooldown) {
            let start = Date.now()
            let remaining = (state.cooldownStartTime + state.cooldownDuration) - start

            if(remaining > state.globalCooldown) return
        }

        this.globalCooldownTimer = setInterval(() => {
            if(state.casting) return

            let now = Date.now()
            let cooldownState = {
                startTime: state.globalCooldownStartTime || now,
                cooldown: state.globalCooldown
            }
            let remaining = (cooldownState.startTime + cooldownState.cooldown) - now

            if(remaining <= interval + lag) {
                clearInterval(this.globalCooldownTimer)               
                return
            }
            updateState(state => {return {progress: remaining/cooldownState.cooldown, ...state}})
        }, interval)
    }
}

class InstantAbility extends Ability {

    execute() {
        let state = this.state
        if(state.cooldownStartTime && state.charges === 0) return      
        updateState(state => {return {charges: charges-1, ...state}})
        onAbilityUpdate({
            type: "ABILITY_CAST_SUCCESS",
            payload: {
                name
            }
        })

        if(resource) {
            triggerEvent({
                type: "RESOURCE_UPDATE",
                payload: resource
            })
        }

        onExecute()
        //if has charges and current charges < max - 1
        if(state.maxCharges && state.charges < state.maxCharges - 1) return
        super.startCooldown()
    }
}

class CastAbility extends Ability {

    execute() {

    }
}

class ChannelAbility extends Ability {

    execute() {

    }
}