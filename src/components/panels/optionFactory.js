import React from "react"

const TimeTextOption = (props) => {
    const {value, onChange} = props

    const handleChange = (e) => {
        onChange(parseFloat(e.target.value)*1000)
    }
    
    return (
        <input type="text" defaultValue={value/1000} onChange={handleChange} />
    )
}

const NumberTextOption = (props) => {
    const {value, onChange} = props

    const handleChange = (e) => {
        onChange(parseInt(e.target.value))
    }
    
    return (
        <input type="text" defaultValue={value} onChange={handleChange} />
    )
}

export default Option = (type, value, onChange) => {
    switch(type) {
        case "time":
            return <TimeTextOption value={value} onChange={onChange} />
        case "number":
            return <NumberTextOption value={value} onChange={onChange} />
        default:
            return null
    }
}