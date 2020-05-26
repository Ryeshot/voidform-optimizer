import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"

import "./Panel.css"
import "./Tooltip.css"

const AbilityKeybindsPanel = (props) => {

    const {abilities, currentPanel, onKeybind, onToggle, onClick, closePanel} = props

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

    const showToolTip = (e) => {
        setTooltip(e.target.alt)
    }

    const hideToolTip = () => {
        setTooltip("")
    }

    const prepareToBindAbility = (e) => {
        let ability = e.target.getAttribute("ability")
        setCurrentAbility(ability => ability)

        setKeybindText(`Press any key to bind to ${abilities[ability].displayName}`)

        document.addEventListener("keyup", bindAbility, {once: true})
    }

    const bindAbility = (event) => {
        document.removeEventListener("keyup", bindAbility)

        let key = event.key.match(/[a-zA-Z]/) ? event.key.toUpperCase() : event.key 

        onKeybind(key)
        setKeybindText(`Ability successfuly bound to ${key}`)
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