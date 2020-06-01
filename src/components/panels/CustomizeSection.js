import React from "react"
import SettingOption from "./SettingOption"

const CustomizeSection = (props) => {

    const {name, setting, onChange} = props

    const handleChange = (optionKey, option) => {
        const newSetting = {...setting, [optionKey]: option}
        onChange(newSetting, name)
    }

    return (
        Object.keys(setting).map(k => {
            const option = setting[k]
            return <SettingOption key={name+k} option={option} name={k} onChange={handleChange} />
            //if(!option.editable) return
        })
        
    )
}

export default CustomizeSection