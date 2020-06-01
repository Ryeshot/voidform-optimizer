import React from "react"

const SettingOption = (props) => {
    const {option, name, onChange} = props

    //console.log(name)

    const handleInputChange = (e) => {
        onChange(name, e.target.value)
    }

    return (
        <div className="setting-option">
            <div>{name}</div>
            <i className="fa fa-question-circle what-is"></i>
            <input type="text" defaultValue={option} onChange={handleInputChange}/>
        </div>

    )
}

export default SettingOption