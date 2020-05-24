import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"

import "./Panel.css"

const SettingsPanel = (props) => {

    const {onImport, currentPanel, data, onClick, closePanel} = props

    const [importData, setImportData] = useState("") 

    const panel = "settings"
    const header= "Custom Settings"
    const panelClass = "right-panel"
    const placeholderText = "Import custom settings here..."

    const handleOnClick = () => {
        onImport(importData)
    }

    return (
        <Panel panel={panel} onClick={onClick} handleClose={closePanel} header={header} panelClass={panelClass} style={{width: currentPanel === panel ? "350px": "0px"}}>
            <div className="panel-input-area">
                <textarea className="panel-text-area" rows={10} col={50} placeholder={placeholderText}>
                </textarea>
                <button className="panel-button panel-input-button" onClick={handleOnClick}>Import</button>
            </div>
        </Panel>      
    )
}

export default SettingsPanel