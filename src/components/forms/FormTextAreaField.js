import React from "react"

const FormTextAreaField = (props) => {

    const {value, id, label, className, placeHolder, onChange} = props

    const handleChange = (e) => onChange(id, e.target.value)

    return (
        <div className={`form-field ${className}`}>
            <label htmlFor={id}>{label}</label>
            <div className={"form-input-container"}>
                <textarea className="panel-text-area form-input-field" id={id} value={value} placeholder={placeHolder} required={true} onChange={handleChange} />
            </div>
        </div>
    )
}

export default FormTextAreaField