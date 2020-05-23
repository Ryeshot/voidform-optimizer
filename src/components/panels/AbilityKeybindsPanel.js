import React, {useState, useEffect, useReducer, useRef} from 'react';

import "./Panel.css"

const AbilityKeybindsPanel = (props) => {

    const {abilities, currentPanel, onKeybind, onToggle, onClick, closePanel} = props

    const panel = "abilitykeybinds"

    return (
        <div>
            <div className="panel-header" onClick={() => onClick(panel)}>Abilties and Keybinds |</div>
            <div className="panel bottom-panel" style={{
                height: currentPanel === panel ? "250px": "0px"
            }}>
                <button className="panel-button" onClick={closePanel}>x</button>
            </div>
        </div>
    )
}

export default AbilityKeybindsPanel