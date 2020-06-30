import React from "react"
import Option from "./optionFactory"
import "./WhatIs.css"
import "./SettingOption.css"

const SettingOption = (props) => {
    const {value, name, type, whatIs, displayName, onChange, onHelp, closeHelp, parentKey, ...rest} = props

    const handleInputChange = (v) => {
        onChange(name, v)
    }

    const handleOnHelp = (e) => {
        const pos = {
            x: e.target.offsetLeft,
            y: e.target.offsetTop
        }
        onHelp(displayName, whatIs, pos)
    }

    return (
        <div className="setting-option">
            <div>
                <i className="fa fa-question-circle what-is-icon" onMouseEnter={handleOnHelp} onMouseLeave={closeHelp}></i>
            </div>
            <div className="setting-option-header">{displayName}</div>
            {Option(type, value, handleInputChange, parentKey + "-input", name, rest)}
        </div>
    )
}

export default SettingOption