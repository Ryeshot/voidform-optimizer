import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"
import {keybinds} from "../../lib/constants"
import "./Panel.css"
import "./Tooltip.css"

const AbilityKeybindsPanel = (props) => {

    const {abilities, currentPanel, onKeybind, onToggle, onClick, onPause, closePanel} = props

    const panel = "abilitykeybinds"
    const header = "Ability and Keybinds"
    const panelClass = "bottom-panel"

    const defaultState = {
        tooltip: "",
        keybindText: "",
        currentAbility: ""
    }

    const [tooltip, setTooltip] = useState(defaultState.tooltip)
    const [keybindText, setKeybindText] = useState(defaultState.keybindText)
    const [currentAbility, setCurrentAbility] = useState(defaultState.currentAbility)

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

        setKeybindText(`Press any key to bind to ${abilities[ability].displayName}`)

        document.addEventListener("keypress", bindAbility, {once: true})
    }

    const bindAbility = (event) => {
        document.removeEventListener("keypress", bindAbility)
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
                <div className="panel-content-header">Change Abilities and Keybinds</div>
                <div className="tooltip">
                    <span className="tooltip-text" visibility={(!!tooltip).toString()}>
                        {tooltip}
                    </span>
                </div>
                <div className="panel-abilities-container">
                    {Object.keys(abilities).map(k => {
                        if(k === "void-eruption") return
                        return <div className="panel-ability-container" key={k}>
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
                })}
                </div>
                <div>{keybindText ? keybindText : null}</div>
            </div>
        </Panel>
    )
}

export default AbilityKeybindsPanel