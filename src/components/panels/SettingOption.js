import React from "react"
import Option from "./optionFactory"

const SettingOption = (props) => {
    const {value, name, type, displayName, onChange} = props

    const handleInputChange = (e) => {
        onChange(name, e.target.value)
    }

    return (
        <div className="setting-option">
            <div>{displayName}</div>
            <i className="fa fa-question-circle what-is"></i>
            {Option(type, value, handleInputChange)}
        </div>

    )
}

export default SettingOption