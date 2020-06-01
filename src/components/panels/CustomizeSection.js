import React from "react"
import SettingOption from "./SettingOption"

const CustomizeSection = (props) => {

    const {name, setting, options, onChange} = props

    const handleChange = (optionKey, option) => {
        const newSetting = {...setting, [optionKey]: option}
        onChange(newSetting, name)
    }

    return (
        options.map(o => {
            return <SettingOption key={name+o.key} value={setting[o.key]} name={o.key} {...o} onChange={handleChange}/>
        })     
    )
}

export default CustomizeSection