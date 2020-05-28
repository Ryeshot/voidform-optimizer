import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"
import {keybinds} from "../../utils/constants"

import "./Panel.css"
import "./Tooltip.css"

const AbilityKeybindsPanel = (props) => {

    const {abilities, currentPanel, onKeybind, onToggle, onClick, onPause, closePanel} = props

    const panel = "abilitykeybinds"
    const header = "Ability and Keybinds"
    const panelClass = "bottom-panel"
    const modifiers = ["Shift", "Alt", "Control"]

    const defaultState = {
        tooltip: "",
        keybindText: "",
        currentAbility: "",
        modifier: ""
    }

    const [tooltip, setTooltip] = useState(defaultState.tooltip)
    const [keybindText, setKeybindText] = useState(defaultState.keybindText)
    const [currentAbility, setCurrentAbility] = useState(defaultState.currentAbility)
    const [modifier, setModifier] = useState(defaultState.modifier)

    const handleClose = () => {
        setTooltip(defaultState.tooltip)
        setKeybindText(defaultState.keybindText)
        setCurrentAbility(defaultState.currentAbility)

        closePanel()
    }

    const currentAbilityRef = useRef(currentAbility)
    currentAbilityRef.current = currentAbility

    const showToolTip = (e) => {
        setTooltip(e.target.alt)
    }

    const hideToolTip = () => {
        setTooltip("")
    }

    const prepareToBindAbility = (e) => {
        let ability = e.target.getAttribute("ability")
        setCurrentAbility(ability)
        onPause(true)

        setKeybindText(`Press any key to bind to ${abilities[ability].displayName}`)

        document.addEventListener("keypress", bindAbility, {once: true})
        document.addEventListener("keydown", bindModifier, {once: true})
        document.addEventListener("keyup", unbindModifier, {once: true})
    }

    const bindModifier = (event) => {
        //console.log(event.key)
        if(modifiers.includes(event.key)) {
            setModifier(m => event.key)
            document.addEventListener("keydown", bindAbilityWithModifier)
        }
    }

    const unbindModifier = () => {
        if(modifier) setModifier(m => defaultState.modifier)
    }

    const bindAbilityWithModifier = (event) => {
        if(!modifiers.includes(event.key)) {
            document.removeEventListener("keyup", bindAbility)
            document.removeEventListener("keydown", bindAbilityWithModifier)

            let key = modifier[0] + "-" + (event.key.match(/[a-zA-Z]/) ? event.key.toUpperCase() : event.key)
            let ability = currentAbilityRef.current 
    
            onKeybind(event.key, ability)
            setKeybindText(`${abilities[ability].displayName} successfuly bound to ${key}`)
        }
    }

    const bindAbility = (event) => {
        document.removeEventListener("keypress", bindAbility)
        onPause(false)
        let keybind = {
            key: event.key,
            keybindText: event.key
        }

        if(keybinds[keybind.key]) keybind.keybindText = keybinds[keybind.key]
        if(keybind.key.match(/[a-z]/)) keybind.keybindText = keybind.key.toUpperCase()
        if(keybind.key.match(/[A-Z]/)) keybind.keybindText = "S-" + keybind.key
        
        let ability = currentAbilityRef.current 

        onKeybind(keybind, ability)
        setKeybindText(`${abilities[ability].displayName} successfuly bound to ${keybind.keybindText}`)
    }

    return (
        <Panel panel={panel} onClick={onClick} header={header} style={{transform: `translateY(${currentPanel === panel ? "0px": "250px"}`}} panelClass={panelClass} handleClose={handleClose}>
            <div className="horizontal-panel-content">
                {Object.keys(abilities).map(k =>
                    <div key={k}>
                        <img  
                            className="hover-pointer" 
                            alt={abilities[k].displayName}
                            ability={k} 
                            onMouseOver={showToolTip}
                            onMouseOut={hideToolTip}
                            onClick={prepareToBindAbility}
                            src={abilities[k].icon}
                            height={50}
                            width={50}
                        />
                    <button className="panel-button" onClick={() => onToggle(k)}>{abilities[k].disabled ? "Enable" : "Disable"}</button>
                    </div>
                )}
                <div className="tooltip">
                    <span className="tooltip-text" visibility={(!!tooltip).toString()}>
                        {tooltip}
                    </span>
                </div>
                <div>{keybindText ? keybindText : null}</div>
            </div>
        </Panel>
    )
}

export default AbilityKeybindsPanel