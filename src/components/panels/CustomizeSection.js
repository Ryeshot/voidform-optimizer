import React from "react"

const CustomizeSection = (props) => {

    const {key, setting, onChange} = props

    const handleChange = (optionKey, option) => {
        const newSetting = {...setting, [optionKey]: option}
        onChange(newSetting, key)
    }

    return (
        Object.keys(setting).map(k => {
            const option = setting[k]
            if(!option.editable) return
        })
        
    )

}

export default CustomizeSection