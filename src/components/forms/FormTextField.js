import React from "react"

const FormTextField = (props) => {

    const {value, id, label, placeHolder, onChange} = props

    const handleChange = (e) => onChange(id, e.target.value)

    return (
        <div className="form-text-field form-title">
            <label className="form-input-title" htmlFor={id}>{label}</label>
            <input className="panel-text-area form-input-field" type="text" id={id} value={value} placeholder={placeHolder} required={true} onChange={handleChange} />
        </div>
    )
}

export default FormTextField