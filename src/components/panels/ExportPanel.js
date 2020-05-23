import React, {useState, useEffect, useReducer, useRef} from 'react';

import "./Panel.css"

const ExportPanel = (props) => {

    const {onExport, currentPanel, exportData, onClick, closePanel} = props

    const [showPanel, setShowPanel] = useState(false) 

    const panel = "export"

    return (
        <div>
            <div className="panel-header" onClick={() => onClick(panel)}>Export Custom Settings |</div>
            <div className="panel left-panel" style={{
                width: currentPanel === panel ? "250px": "0px"
            }}>
                <button className="panel-button" onClick={closePanel}>x</button>
                <button onClick={onExport}>Export</button>
                <div>{exportData}</div>
            </div>
        </div>
    )
}

export default ExportPanel