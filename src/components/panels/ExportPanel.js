import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"
import { exportSettings, importSettings } from "../../utils/importExport"
import templates from "../../lib/templates"
import "./Panel.css"

const addTemplateToQueryString = (template) => {
    const queryParams = new URLSearchParams()
    queryParams.set("template", template)
    window.history.replaceState(null, window.document.title, `?${queryParams.toString()}`)
}

const Templates = (props) => {

    const {onChange, selected} = props

    return (
        <div style={{width: "60%"}}>
            <select className="panel-dropdown" value={selected} onChange={onChange}>
                <option value={"default"} disabled>Choose a template...</option>
                {Object.keys(templates).map(t => <option key={t} value={t}>{templates[t].displayName}</option>)}
                <option key={"custom"} value={"custom"}>Custom</option>
            </select>
        </div>
    )
}

const ExportPanel = (props) => {

    const {settings, onImport, currentPanel, onClick, closePanel} = props

    const panel = "export"
    const header = "Import/Export Settings"
    const panelClass = "left-panel"
    const placeholderText = "Import settings here..."
    const exportTextAreaId = "export-content"
    const defaultSelected = "default"
    const rows = 20
    const cols = 25

    const [exportData, setExportData] = useState("")
    const [inputData, setInputData] = useState("")
    const [includeKeybinds, setIncludeKeybinds] = useState(false)
    const [includeSpellOrder, setIncludeSpellOrder] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState(defaultSelected)

    const handleImport = () => {
        try {
            const settings = importSettings(inputData, includeKeybinds, includeSpellOrder)
            if(selectedTemplate) addTemplateToQueryString(selectedTemplate)
            onImport(settings)
        } catch (error) {
            console.error(error)
        }

        setInputData("")
    }

    const handleExport = () => {
        const data = exportSettings(settings)

        setExportData(data)
    }

    const handleTemplateChange = (e) => {
        const key = e.target.value

        setSelectedTemplate(key)

        if(key === "custom") {
            setInputData("")
            return
        }

        const {displayName, ...template} = templates[key]

        const data = exportSettings({...template})

        setInputData(data)
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
        setExportData("")
        setInputData("")
        setIncludeKeybinds(false)
        setIncludeSpellOrder(false)
        setSelectedTemplate(defaultSelected)
    }

    return (
        <Panel panel={panel} currentPanel={currentPanel} reset={reset} onClick={onClick} handleClose={closePanel} header={header} panelClass={panelClass} style={{transform: `translateX(${currentPanel === panel ? "0px": "-350px"})`}}>
            <div className="vertical-panel-content">
                <div className="panel-content-container">
                    <div className="panel-content-header">Import Settings</div>
                    <Templates selected={selectedTemplate} onChange={handleTemplateChange} />
                    <textarea className="panel-text-area" rows={rows} cols={cols} placeholder={placeholderText} value={inputData} onChange={handleInputChange}></textarea>
                    <div className="panel-info-text-container">
                        <label>Include keybinds</label>
                        <input type="checkbox" onChange={() => setIncludeKeybinds(!includeKeybinds)} checked={includeKeybinds} />
                    </div>
                    <div className="panel-info-text-container">
                        <label>Include spell order</label>
                        <input type="checkbox" onChange={() => setIncludeSpellOrder(!includeSpellOrder)} checked={includeSpellOrder} />
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