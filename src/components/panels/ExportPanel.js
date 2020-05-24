import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"

import "./Panel.css"

const ExportPanel = (props) => {

    const {onExport, currentPanel, exportData, onClick, closePanel} = props

    const panel = "export"
    const header = "Import/Export Settings"
    const panelClass = "left-panel"
    const placeholderText = "Import custom settings here..."

    //handle import

    //handle export

    //handle copy

    return (
        <Panel panel={panel} onClick={onClick} handleClose={closePanel} header={header} panelClass={panelClass} style={{width: currentPanel === panel ? "350px": "0px"}}>
            <div className="vertical-panel-content">
                <div className="panel-input-area">
                    <div className="panel-content-header">Import Settings</div>
                    <textarea className="panel-text-area" rows={20} col={20} placeholder={placeholderText}>
                    </textarea>
                    <button className="panel-button panel-input-button" onClick={onClick}>Import</button>
                </div>
                <div className="panel-input-area">
                    <div className="panel-content-header">Export Settings</div>
                    <textarea className="panel-text-area" rows={20} col={20}>{exportData}</textarea>
                    <button className="panel-button panel-input-button" onClick={onClick}>Export</button>
                    <button className="panel-button panel-input-button" onClick={onClick}>Copy</button>
                </div>      
            </div> 
        </Panel>
    )
}

export default ExportPanel