import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"

import "./Panel.css"

const AboutPanel = (props) => {
    const {currentPanel, onClick, closePanel} = props

    const panel = "about"
    const header= "About"
    const panelClass = "middle-panel"

    return (
        <Panel panel={panel} onClick={onClick} handleClose={closePanel} header={header} panelClass={panelClass}
            style={{transform: `translateY(${currentPanel === panel ? "0px": "-660px"}`}}
        >
        </Panel>      
    )
}

export default AboutPanel