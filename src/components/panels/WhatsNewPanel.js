import React, {useState} from 'react';
import "../forms/Form.css"
import "./Panel.css"
import whatsNew from "../../lib/whatsNew"

const containerStyle = {
    textAlign: "left",
    marginBottom: "20px"
}

const smallText = {
    fontSize: "15px"
}

const mediumText = {
    fontSize: "20px"
}

const WhatsNew = (props) => {
    const title = "What's New"

    const {onClose} = props

    return (
        <div className="modal">
            <div className="modal-content panel">
                <div className="form-title">
                    {title}
                </div>           
                <div>
                    {whatsNew.map(item => 
                        <div style={containerStyle}>
                            <b style={mediumText}>{item.header}</b>
                            <div style={smallText}>
                                {item.description}
                            </div>
                        </div>)}
                </div>
                <div>
                    <button className="panel-button" onClick={onClose}>Got it!</button>
                </div>
                <button className="panel-button panel-exit-button" onClick={onClose}>x</button>
            </div>
        </div>
    )
}

const WhatsNewPanel = () => {

    const header = "What's New"

    const [showWhatsNew, setShowWhatsNew] = useState(false)

    return (
        <div>
            <div className="panel-header hover-pointer" onClick={() => setShowWhatsNew(true)}>{header}</div>
            {showWhatsNew ? <WhatsNew onClose={() => setShowWhatsNew(false)} /> : null}
        </div>
    )
}

export default WhatsNewPanel