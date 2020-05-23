import React, {useState, useEffect, useReducer, useRef} from 'react';

import "./Panel.css"

const SettingsPanel = (props) => {

    const {onImport, currentPanel, data, onClick, closePanel} = props

    const [importData, setImportData] = useState("") 

    const panel="settings"

    const handleOnClick = () => {
        onImport(importData)
    }

    return (
        <div>
            <div className="panel-header" onClick={() => onClick(panel)}>Custom Settings</div>
            <div className="panel right-panel" style={{
                width: currentPanel === panel ? "250px": "0px"
            }}>
                <button className="panel-button" onClick={closePanel}>X</button>
                <button onClick={handleOnClick}>Import</button>
                <div placeholder="Import custom settings here..."></div>
            </div>
        </div>
    )
}

export default SettingsPanel