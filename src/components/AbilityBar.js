import React, {useState, useEffect, useReducer, useRef} from 'react';
import ProgressAbility from "./ProgressAbility"
import GlobalCooldown from "./GlobalCooldown"
import CastBar from "./CastBar"
import {spellQueueWindow} from "../lib/constants"
import "./AbilityBar.css"

const AbilityBar = (props) => {

    const gcdLength = 1500
    const {state, abilitySettings, abilities, haste, inVoidform, dispatch, keyEventsPaused, reset} = props

    const hasteRef = useRef(haste)
    hasteRef.current = haste

    const inVoidformRef = useRef(inVoidform)
    inVoidformRef.current = inVoidform 

    const spellQueueTimer = useRef()

    const [observers, setObservers] = useState([])

    const observersRef = useRef(observers)
    observersRef.current = observers

    const [hasReset, setHasReset] = useState(reset)

    useEffect(() => {
        dispatch({
            type: "RESET"
        })

        return () => setHasReset(reset)
    }, [reset])

    useEffect(() => {
        const name = "mind-blast"
        const ability = abilitySettings[name]
        const duration = getAbilityCooldown(name)
        let cdr = ability.cdr * (inVoidform && -1 || 1)
        ability.cooldown += cdr

        const startTime = state.cooldowns[name].startTime
        if(!startTime || hasReset === reset) return
        cdr = getAbilityCooldown(name) - duration
        const now = Date.now()
        const remaining = (startTime + duration) - now
        const remainingPercent = remaining/duration
        const remainingCdr = remainingPercent * cdr

        dispatch({
            type: "ABILITY_COOLDOWN_START",
            payload: {
                name,
                time: startTime + remainingCdr - cdr
            }
        })

    }, [inVoidform])

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress)
        document.addEventListener("keypress", handleKeyPress)

        return () => {
            document.removeEventListener("keydown", handleKeyPress)
            document.removeEventListener("keypress", handleKeyPress)
        }
    }, [keyEventsPaused])

    const globalCooldownRef = useRef(state.globalCooldown)
    globalCooldownRef.current = state.globalCooldown

    const globalCooldownStartTimeRef = useRef(state.globalCooldownStartTime)
    globalCooldownStartTimeRef.current = state.globalCooldownStartTime

    const handleKeyPress = (e) => {
        if(keyEventsPaused) return

        const now = Date.now()

        observersRef.current.forEach(o => {
            if(o.keybind === e.key) {
                e.preventDefault()
                const abilityCooldownRemaining = o.getRemainingCooldown()
                const globalCooldownRemaining = globalCooldownRef.current ? globalCooldownRef.current - (now - globalCooldownStartTimeRef.current) : 0
                const remaining = o.ignoresGcd ? 0 : Math.max(abilityCooldownRemaining, globalCooldownRemaining)

                if(remaining > spellQueueWindow) return
                if(!o.canExecute()) return

                queueAbility(o.source, o.execute, remaining + 15)
            }
        })
    }

    const handleClick = (name, getRemainingCooldown, execute, canExecute, ignoresGcd) => {
        const now = Date.now()

        const abilityCooldownRemaining = getRemainingCooldown()
        const globalCooldownRemaining = globalCooldownRef.current ? globalCooldownRef.current - (now - globalCooldownStartTimeRef.current) : 0
        const remaining = ignoresGcd ? 0 : Math.max(abilityCooldownRemaining, globalCooldownRemaining)

        if(remaining > spellQueueWindow) return
        if(!canExecute()) return

        queueAbility(name, execute, remaining + 15)
    }

    const calculateCooldown = (cooldown) => {
        return cooldown/hasteRef.current
    }

    const triggerGlobalCooldown = () => {
        let gcd = Math.max(calculateCooldown(gcdLength), gcdLength/2)

        GlobalCooldown.start(gcd, dispatch)

        setTimeout(() => {
            observersRef.current.forEach(o => o.notify())
        }, 0)
    }

    const subscribe = (observer) => {
        setObservers(o => [...o, observer])
    }

    const unsubscribe = (source) => {
        setObservers(obs => obs.filter(o => o.source !== source))
    }

    const getAbilityCooldown = (k) => {
        const ability = abilitySettings[k]
        const cooldown = ability.cooldown

        return ability.hasted ? calculateCooldown(cooldown) : cooldown
    }

    const getAbilityCastTime = (k) => {
        const ability = abilitySettings[k]
        const casttime = ability.casttime

        return ability.staticCastTime ? casttime : calculateCooldown(casttime)
    }

    const queueAbility = (name, execute, remaining) => {

        clearTimeout(spellQueueTimer.current)

        spellQueueTimer.current = setTimeout(() => {
            if(!observersRef.current.find(o => o.source === name)) return
            execute()
        }, remaining)
    }

    const makeGroupChunks = (size) => (chunks, curr, i) => {
        const index = Math.floor(i/size)
        chunks[index] = [...chunks[index] || [], curr]
        return chunks
    }

    const disabledAbilities = (k) => {
        if(abilities[k].disabled) return false
        // if(k === "void-bolt" && !inVoidformRef.current) return false
        // if(k === "void-eruption" && inVoidformRef.current) return false

        return true
    }

    const showAbility = (k) => {
        if(k === "void-bolt" && !inVoidformRef.current) return false
        if(k === "void-eruption" && inVoidformRef.current) return false

        return true
    }

    const buildAbilityBar = (abilities) => {
        return Object.keys(abilities)
            .filter(disabledAbilities)
            .sort((k1, k2) => abilities[k1].index - abilities[k2].index)
            //.reduce(makeGroupChunks(8), [])
    }

    return (
    <div className="ability-bar-container">
        <div className="progress-bar-container">
            {state.casting ? <CastBar {...state.casting}/> : null}
        </div>
        <div className="ability-bar">
            {buildAbilityBar(state.cooldowns)
            .map(k => {
                return <ProgressAbility
                    name={k}
                    key={`ability-${k}`}
                    {...abilities[k]}
                    {...state.cooldowns[k]}
                    settings={abilitySettings[k]}
                    cooldown={getAbilityCooldown(k)}
                    globalCooldown={state.globalCooldown}
                    globalCooldownStartTime={state.globalCooldownStartTime}
                    casttime={getAbilityCastTime(k)}
                    casting={state.casting && state.casting.time && state.casting.direction}
                    subscribe={subscribe}
                    unsubscribe={unsubscribe}
                    onExecute={triggerGlobalCooldown}
                    onAbilityUpdate={dispatch}
                    onClick={handleClick}
                    triggerEvent={dispatch}
                    show={showAbility(k)}
                    reset={reset}
                    />
                })}
        </div>        
    </div>
    )
}

export default AbilityBar