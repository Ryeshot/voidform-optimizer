import React, {useState, useEffect, useReducer, useRef} from 'react';
import CooldownSweep from "../CooldownSweep"

import "./Aura.css"

const Aura = (props) => {

    const {icon, displayName, duration, maxDuration, stacks} = props

    const size = 30
    const progress = duration && ((maxDuration-duration)/maxDuration)

    return (
        <div className="aura">
            <img
                src={icon}
                width={size}
                height={size}
            >
            </img>
            <div className="aura-text">{stacks || ""}</div>
            {duration ? <CooldownSweep size={30} progress={progress} inverse={true}/> : null}
            {props.children}
        </div>
    )
}

export default Aura