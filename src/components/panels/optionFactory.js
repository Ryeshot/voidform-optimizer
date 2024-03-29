import React, { useState } from "react"

const TimeTextOption = (props) => {
    const {value, onChange} = props

    const [displayValue, setDisplayValue] = useState(value/1000)

    const handleChange = (e) => {
        if(!e.target.value) return
        onChange(parseFloat(e.target.value)*1000)
        setDisplayValue(e.target.value)
    }
    
    return <span><input className="setting-option-input" type="number" value={displayValue} min="0" step=".1" onChange={handleChange} />sec</span>
}

const NumberTextOption = (props) => {
    const {value, onChange, unit} = props

    const handleChange = (e) => {
        if(!e.target.value) return
        onChange(parseInt(e.target.value))
    }
    
    return <span><input className="setting-option-input" type="number" value={value} min="0" onChange={handleChange} /> {unit}</span>
}

const FloatTextOption = (props) => {
    const {value, onChange, unit} = props

    const handleChange = (e) => {
        if(!e.target.value) return
        onChange(parseFloat(e.target.value))
    }
    
    return <span><input className="setting-option-input" type="number" value={value} min="0" step=".01" onChange={handleChange} /> {unit}</span>
}

const PercentTextOption = (props) => {
    const {value, onChange} = props

    const [displayValue, setDisplayValue] = useState(value*100)

    const handleChange = (e) => {
        if(!e.target.value) return
        onChange(parseFloat(e.target.value)/100)
        setDisplayValue(e.target.value)
    }

    return <span><input className="setting-option-input" type="number" value={displayValue} min="0" step=".5" onChange={handleChange} />%</span>
}

const BooleanOption = (props) => {
    const {value, onChange} = props

    const handleChange = (e) => {
        onChange(e.target.checked)
    }

    return <input type="checkbox" defaultChecked={value} onChange={handleChange} />
}

const SelectOption = (props) => {
    const {value, onChange, name, options} = props

    const handleChange = (e) => {
        onChange(e.target.value)
    }

    return (
        options.map(o => (
            <div>
                <input type="radio" id={o.value} name={name} value={o.value} defaultChecked={o.value === value} onChange={handleChange} />
                <label htmlFor={o.value}>{o.displayName}</label>
            </div>
        ))
    )
}

export default Option = (type, value, onChange, key, name, rest) => {
    switch(type) {
        case "time":
            return <TimeTextOption key={key} value={value} onChange={onChange} />
        case "number":
            return <NumberTextOption key={key} value={value} onChange={onChange} {...rest} />
        case "float":
            return <FloatTextOption key={key} value={value} onChange={onChange} {...rest} />
        case "percent":
            return <PercentTextOption key={key} value={value} onChange={onChange} />
        case "boolean":
            return <BooleanOption key={key} value={value} onChange={onChange} />
        case "select":
            return <SelectOption key={key} value={value} name={name} onChange={onChange} {...rest} />
        default:
            return null
    }
}