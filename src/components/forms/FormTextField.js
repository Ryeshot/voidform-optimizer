import React from "react"

const FormTextField = (props) => {

    const {value, id, label, placeHolder, onChange, required} = props

    const handleChange = (e) => onChange(id, e.target.value)

    return (
        <div className="form-field">
            <label className="form-input-title" htmlFor={id}>{label}</label>
            <input className="panel-text-area form-input" type="text" id={id} value={value} placeholder={placeHolder} required={required} onChange={handleChange} />
        </div>
    )
}

export default FormTextField