import React, {useState, useEffect, useReducer, useRef} from 'react';

import "./Panel.css"

const Panel = (props) => {

    const {panel, onClick, handleClose, header, panelClass, style} = props

    return (
        <div>
            <div className="panel-header hover-pointer" onClick={() => onClick(panel)}>{header}</div>
            <div className={`panel ${panelClass}`} style={style}>
                <button className="panel-button" onClick={handleClose}>x</button>
                {props.children}
            </div>
        </div>
    )
}

export default Panel