import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"
import { exportSettings, importSettings } from "../../utils/importExport"

import "./Panel.css"

const ExportPanel = (props) => {

    const {settings, onImport, currentPanel, onClick, closePanel} = props

    const panel = "export"
    const header = "Import/Export Settings"
    const panelClass = "left-panel"
    const placeholderText = "Import custom settings here..."
    const exportTextAreaId = "export-content"
    const rows = 20
    const cols = 25

    const [exportData, setExportData] = useState("")
    const [inputData, setInputData] = useState("")
    const [includeKeybinds, setIncludeKeybinds] = useState(false)

    useEffect(() => {
        reset()
    }, [currentPanel])

    const handleImport = () => {
        const settings = importSettings(inputData, includeKeybinds)
        onImport(settings)
        setInputData("")
    }

    const handleExport = () => {
        const data = exportSettings(settings)

        setExportData(data)
    }

    const copyToClipBoard = () => {
        const textArea = document.getElementById(exportTextAreaId)

        textArea.select()

        try {
            document.execCommand("copy")

        }
        catch (err) {
            //set the message
        }
    }

    const handleInputChange = (e) => {
        let data = e.target.value

        setInputData(data)
    }

    const reset = () => {
        console.log("Inside reset")
        setExportData("")
        setInputData("")
        setIncludeKeybinds(false)
    }

    return (
        <Panel panel={panel} onClick={onClick} handleClose={closePanel} header={header} panelClass={panelClass} style={{transform: `translateX(${currentPanel === panel ? "0px": "-350px"})`}}>
            <div className="vertical-panel-content">
                <div className="panel-content-container">
                    <div className="panel-content-header">Import Settings</div>
                    <textarea className="panel-text-area" rows={rows} cols={cols} placeholder={placeholderText} value={inputData} onChange={handleInputChange}></textarea>
                    <div>
                        <label>Include keybinds</label>
                        <input type="checkbox" onChange={() => setIncludeKeybinds(!includeKeybinds)} checked={includeKeybinds} />
                    </div>
                    <div className="panel-button-container">
                        <button className="panel-button panel-input-button" onClick={handleImport} disabled={!inputData}>Import</button>
                    </div>
                </div>
                <div className="panel-content-container">
                    <div className="panel-content-header">Export Settings</div>
                    <textarea id={exportTextAreaId} className="panel-text-area" rows={rows} cols={cols} value={exportData} readOnly={true}></textarea>
                    <div className="panel-button-container">
                        <button className="panel-button panel-input-button" onClick={handleExport}>Export</button>
                        <button className="panel-button panel-input-button" onClick={copyToClipBoard} disabled={!exportData}>Copy</button>
                    </div>
                </div>      
            </div> 
        </Panel>
    )
}

export default ExportPanel