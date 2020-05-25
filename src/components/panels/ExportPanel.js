import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"
import { exportSettings, importSettings } from "../../utils/importExport"
import abilitySettings from "../../utils/abilitySettings"
import auraSettings from "../../utils/auraSettings"

import "./Panel.css"

const ExportPanel = (props) => {

    const {onExport, currentPanel, onClick, closePanel} = props

    const panel = "export"
    const header = "Import/Export Settings"
    const panelClass = "left-panel"
    const placeholderText = "Import custom settings here..."
    const exportTextAreaId = "export-content"

    const [exportData, setExportData] = useState("")
    const [inputData, setInputData] = useState("")

    const handleImport = () => {
        const settings = importSettings(inputData)

        console.log(settings)
    }

    const handleExport = () => {
        const data = exportSettings({ abilitySettings, auraSettings })

        setExportData(data)
    }

    const copyToClipBoard = () => {
        const textArea = document.getElementById(exportTextAreaId)

        textArea.select()

        try {
            document.execCommand("copy")
            //set the message

        }
        catch (err) {
            //set the message
        }
    }

    const handleInputChange = (e) => {
        let data = e.target.value

        setInputData(data)
    }

    return (
        <Panel panel={panel} onClick={onClick} handleClose={closePanel} header={header} panelClass={panelClass} style={{transform: `translateX(${currentPanel === panel ? "0px": "-350px"})`}}>
            <div className="vertical-panel-content">
                <div className="panel-input-area">
                    <div className="panel-content-header">Import Settings</div>
                    <textarea className="panel-text-area" rows={20} col={40} placeholder={placeholderText} onChange={handleInputChange}></textarea>
                    <button className="panel-button panel-input-button" onClick={handleImport} disabled={!inputData}>Import</button>
                </div>
                <div className="panel-input-area">
                    <div className="panel-content-header">Export Settings</div>
                    <textarea id={exportTextAreaId} className="panel-text-area" rows={20} col={20} value={exportData}></textarea>
                    <button className="panel-button panel-input-button" onClick={handleExport}>Export</button>
                    <button className="panel-button panel-input-button" onClick={copyToClipBoard} disabled={!exportData}>Copy</button>
                </div>      
            </div> 
        </Panel>
    )
}

export default ExportPanel