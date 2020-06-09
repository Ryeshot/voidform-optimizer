import React, {useState} from "react"
import Form from "./Form"
import FormTextAreaField from "./FormTextAreaField"
import FormTextField from "./FormTextField"

const fields = []

const submitSuccess = "Feature request successfully submitted!"
const submitFail = "Failed to submit feature request"

const FeatureRequest = (props) => {

    const {closeForm} = props

    return <div className="modal">
        <div className="modal-content panel">
            Coming soon!
            <button className="panel-button panel-exit-button" onClick={closeForm}>x</button>
        </div>
    </div>
}

export default FeatureRequest