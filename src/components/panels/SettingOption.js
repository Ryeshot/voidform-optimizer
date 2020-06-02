import React from "react"
import Option from "./optionFactory"
import "./WhatIs.css"

const SettingOption = (props) => {
    const {value, name, type, whatIs, displayName, onChange, onHelp, closeHelp} = props

    const handleInputChange = (v) => {
        console.log(name)
        console.log(v)
        onChange(name, v)
    }

    const handleOnHelp = (e) => {
        const pos = {
            x: e.target.offsetLeft,
            y: e.target.offsetTop
        }
        console.log(e.target.offsetLeft)
        console.log(e.target.offsetTop)
        onHelp(displayName, whatIs, pos)
    }

    return (
        <div className="setting-option">
            <i className="fa fa-question-circle what-is-icon" onMouseEnter={handleOnHelp} onMouseLeave={closeHelp}></i>
            <div className="setting-option-header">{displayName}</div>
            {Option(type, value, handleInputChange)}
        </div>

    )
}

export default SettingOption