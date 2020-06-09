import React, {useState} from "react"
import Form from "./Form"
import FormTextAreaField from "./FormTextAreaField"
import FormTextField from "./FormTextField"
import {submitBugReport} from "../../utils/bugreport"

const fields = [{
    id: "bug-report-description",
    label: "Description",
    className: "form-field-small"
    // placeHolder: "Enter a description of the bug..."
},
{
    id: "bug-report-expected",
    label: "Expected Behavior",
    className: "form-field-medium"
    // placeHolder: "Enter the expected behavior..."
},
{
    id: "bug-report-actual",
    label: "Actual Behavior",
    className: "form-field-medium"
    // placeHolder: "Enter the actual behavior..."
}]

const titleField = {
    id: "title",
    label: "Title"
}

const formTitle = "Bug Report"

const submitSuccess = "Bug report successfully submitted!"
const submitFail = "Failed to submit bug report"

const BugReport = (props) => {

    const {closeForm} = props
    const [data, setData] = useState({})
    const [canSubmit, setCanSubmit] = useState(true)
    const [submitMessage, setSubmitMessage] = useState("")

    const onChange = (id, value) => {
        setData({...data, [id]: value})
    }

    const onSubmit = (e) => {
        e.preventDefault()

        const success = () => setSubmitMessage(submitSuccess)
        const fail = () => setSubmitMessage(submitFail)

        submitBugReport(data, success, fail)
        setCanSubmit(false)
    }

    return <div className="modal">
        <div className="modal-content panel">
            <div className="form-title">
                {formTitle}
            </div>
            <form className="form" onSubmit={onSubmit}>
                <FormTextField value={data.title} {...titleField} onChange={onChange} />
                {fields.map(f => <FormTextAreaField key={f.id} value={data[f.id]} {...f} onChange={onChange} />)}
                <div>
                    <input className="panel-button" type="submit" value="Submit" disabled={!canSubmit} />
                </div>
            </form>
            <div>
                {submitMessage}
            </div>
            <button className="panel-button panel-exit-button" onClick={closeForm}>x</button>
        </div>
    </div>
}

export default BugReport