import React, {useState} from "react"
import BugReport from "./BugReport"
import FeatureRequest from "./FeatureRequest"
import "./Form.css"
import "../panels/Panel.css"
import "../panels/SettingOption.css"

const Forms = () => {

    const [showBugReport, setShowBugReport] = useState(false)
    const [showFeatureRequest, setShowFeatureRequest] = useState(false)



    return (
        <div className="forms-container">
            <div>
                <button className="panel-button" onClick={() => setShowBugReport(true)}>Report a Bug</button>
                <button className="panel-button" onClick={() => setShowFeatureRequest(true)}>Request a Feature</button>
            </div>
                {showBugReport ? <BugReport closeForm={() => setShowBugReport(false)} /> : null} 
                {showFeatureRequest ? <FeatureRequest closeForm={() => setShowFeatureRequest(false)} /> : null} 
        </div>
    )
}

export default Forms