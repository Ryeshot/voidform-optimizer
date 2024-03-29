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
            style={{transform: `translateY(${currentPanel === panel ? "0px": "min(-685px,-70vh)"}`}}
        >
            <div className="middle-panel-content">
                <div className="panel-content-header">About</div>
                <div className="medium-text left-text panel-text-content">
                    <p>
                    Voidform Optimizer is a thought experiment I had.
                    </p>
                    <p>
                    I am convinced that many, although not all, players' grievances with Voidform are caused by the
                    implementations of Voidform they have experienced, and not by the design of Voidform itself. Therefore I have made it my mission to allow others
                    to experience Voidform in a myriad of ways; in hope that they realize it isn't inherently flawed, find what they most enjoy about it, and 
                    share those findings with others. Then, just maybe, as a community we can come to an agreement on how to <b>#savevoidform</b>.
                    </p>
                    <p>
                    If you have any questions, feedback, or bugs to report, please feel free to DM me on Discord at Shot#1711.
                    </p>

                </div>
            </div>
        </Panel>      
    )
}

export default AboutPanel