import React, {useState, useEffect, useReducer, useRef} from 'react';
import {useCleanup} from "../../utils/hooks"

import "./Panel.css"

const Panel = (props) => {

    const {panel, currentPanel, reset, onClick, handleClose, header, panelClass, style} = props

    useCleanup(panel, currentPanel, reset)

    return (
        <div>
            <div className="panel-header hover-pointer" onClick={() => onClick(panel)}>{header}</div>
            <div className={`panel ${panelClass}`} style={style}>
                <button className="panel-button panel-exit-button" onClick={handleClose}>x</button>
                {props.children}
            </div>
        </div>
    )
}

export default Panel