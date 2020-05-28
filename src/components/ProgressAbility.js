import React, {useState, useEffect, useRef} from 'react';
import "./ProgressAbility.css"
import CooldownSweep from "./CooldownSweep"
import Ability from "../utils/ability"
import abilitySettings from '../utils/abilitySettings';

const ProgressAbility = (props) => {

    const {name, cooldown, globalCooldown, globalCooldownStartTime, unusable, type, resource, startTime, castStartTime, castEndTime, icon, casttime, ticks, baseChannelTime, maxCharges, keybind, subscribe, unsubscribe, onExecute, onAbilityUpdate, triggerEvent, id} = props

    const size = 50

    const [state, setState] = useState({
        progress: 0,
        charges: maxCharges || 1
    })

    //cooldown states
    const startTimeRef = useRef(startTime)
    const cooldownRef = useRef(cooldown)

    startTimeRef.current = startTime
    cooldownRef.current = cooldown

    //cast states
    const castStartTimeRef = useRef(castStartTime)
    const castEndTimeRef = useRef(castEndTime)
    const casttimeRef = useRef(casttime)

    castStartTimeRef.current = castStartTime
    castEndTimeRef.current = castEndTime
    casttimeRef.current = casttime

    //channel states
    const ticksRef = useRef(ticks)
    const baseChannelTimeRef = useRef(baseChannelTime)

    ticksRef.current = ticks
    baseChannelTimeRef.current = baseChannelTime

    //charge states
    const chargesRef = useRef(maxCharges || 1)
    const maxChargesRef = useRef(maxCharges)

    chargesRef.current = state.charges

    //gcd states
    const globalCooldownRef = useRef(globalCooldown)
    const globalCooldownStartTimeRef = useRef(globalCooldownStartTime)

    globalCooldownRef.current = globalCooldown
    globalCooldownStartTimeRef.current = globalCooldownStartTime

    const ability = useRef()

    useEffect(() => {
        const triggers = [{
            eventTypes: ["CAST"],
            trigger: onAbilityUpdate 
        },
        {
            eventTypes: ["RESOURCE", "AURA", "STAT"],
            trigger: triggerEvent
        }]

        const initialState = {
            name,
            resource,
            unusable,
            cooldown: {
                duration: cooldownRef,
                startTime: startTimeRef
            },
            cast: {
                duration: casttimeRef,
                startTime: castStartTimeRef,
                endTime: castEndTimeRef
            },
            channel: {
                baseDuration: baseChannelTimeRef,
                ticks: ticksRef
            },
            charges: {
                maxCharges: maxChargesRef,
                current: chargesRef
            },
            globalCooldown: {
                duration: globalCooldownRef,
                startTime: globalCooldownStartTimeRef
            }
        }

        ability.current = Ability.create(type, initialState, setState, onExecute, triggers)
        subscribe({
            source: id,
            keybind,
            notify: () => ability.current.beginGlobalCooldown(),
            execute: () => ability.current.execute()
        })

        return () => {
            ability.current.remove()
            unsubscribe(id)
        }
    }, [unusable, keybind])

    return (
        <div className="progress-ability-container">
        <div className="progress-ability" onClick={() => ability.current.execute()}>
            <img className="ability-icon"
                className={!unusable && ((state.charges > 0 && maxCharges) || (!startTimeRef.current)) ? "colored" : "desaturated"}
                src={icon}
                width={size}
                height={size}
            />
            <div className="charge-text">{maxCharges > 1 ? state.charges : ""}</div>
            {startTimeRef.current || globalCooldownRef.current ? 
            <CooldownSweep size={size} progress={state.progress}/>
            : null}
        </div>
        <div>{keybind.match(/[a-zA-Z]/) ? keybind.toUpperCase() : keybind}</div>
        </div>
    )
}

export default ProgressAbility;