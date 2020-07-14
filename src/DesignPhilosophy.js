import React from "react"
import { Link } from "react-router-dom"
import sections from "./lib/articles/designPhilosophy"
import "./Subpage.css"

const title = "Design Philosophy"
const homeUrl = "/"
const home = "Voidform Optimizer"

const DesignPhilosophy = () => {
    return (
        <div className="sub-page">
            <header className="App-header header-panel">
                <div className="sub-page-header">
                    <div className="sub-page-title">{title}</div>
                </div>
                <div className="page-nav-container">
                    <Link className="page-nav-link" to={homeUrl}>
                        <div className="page-nav-text">{home}</div>
                    </Link>
                </div>
            </header>
            <div className="sub-page-content-container">
                {sections.map(s => (
                    <div>
                        <h3>{s.header}</h3>
                        <div>{s.content}</div>
                    </div>
                ))}
            </div>
            <div className="sub-page-asset-container"></div>   
        </div>
    )
}

export default DesignPhilosophy