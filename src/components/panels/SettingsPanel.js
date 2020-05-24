import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"

import "./Panel.css"

const SettingsPanel = (props) => {

    const {onImport, currentPanel, data, onClick, closePanel} = props

    const [importData, setImportData] = useState("") 

    const panel = "settings"
    const header= "Custom Settings"
    const panelClass = "right-panel"

    const handleOnClick = () => {
        onImport(importData)
    }

    return (
        <Panel panel={panel} onClick={onClick} handleClose={closePanel} header={header} panelClass={panelClass} style={{width: currentPanel === panel ? "250px": "0px"}}>
            <button onClick={handleOnClick}>Import</button>
            <div placeholder="Import custom settings here..."></div>
        </Panel>      
    )
}

export default SettingsPanel