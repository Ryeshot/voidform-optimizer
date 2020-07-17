import React, {useState} from "react"
import BugReport from "./BugReport"
import FeatureRequest from "./FeatureRequest"
import "./Form.css"
import "../panels/Panel.css"
import "../panels/SettingOption.css"

const Forms = (props) => {

    const {pauseKeyEvents} = props

    const [showBugReport, setShowBugReport] = useState(false)
    const [showFeatureRequest, setShowFeatureRequest] = useState(false)

    const handleFormClick = (setShow, show) => {
        pauseKeyEvents(show)
        setShow(show)
    }

    return (
        <div className="forms-container">
            <div>
                <button className="panel-button" onClick={() => handleFormClick(setShowBugReport, true)}>Report a Bug</button>
                <button className="panel-button" onClick={() => handleFormClick(setShowFeatureRequest, true)}>Request a Feature</button>
            </div>
                {showBugReport ? <BugReport closeForm={() => handleFormClick(setShowBugReport, false)} /> : null} 
                {showFeatureRequest ? <FeatureRequest closeForm={() => handleFormClick(setShowFeatureRequest, false)} /> : null} 
        </div>
    )
}

export default Forms