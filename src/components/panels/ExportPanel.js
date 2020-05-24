import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"

import "./Panel.css"

const ExportPanel = (props) => {

    const {onExport, currentPanel, exportData, onClick, closePanel} = props

    const panel = "export"
    const header = "Export Custom Settings"
    const panelClass = "left-panel"

    return (
        <Panel panel={panel} onClick={onClick} handleClose={closePanel} header={header} panelClass={panelClass} style={{width: currentPanel === panel ? "250px": "0px"}}>
            <button onClick={onExport}>Export</button>
            <div>{exportData}</div>
        </Panel>
    )
}

export default ExportPanel