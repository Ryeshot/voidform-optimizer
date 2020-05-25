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
        <Panel panel={panel} onClick={onClick} handleClose={closePanel} header={header} panelClass={panelClass} style={{transform: `translateX(${currentPanel === panel ? "0px": "350px"}`}}>
        </Panel>      
    )
}

export default SettingsPanel