import React from "react"
import { Link } from "react-router-dom"
import "./Article.css"

const homeUrl = "/"
const home = "Voidform Optimizer"

const Article = (props) => {

    const {title, sections} = props

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

export const ArticleLink = (props) => {

    const {title, url} = props

    return (
    <div>
        <Link className="page-nav-link" to={url}>
            <div className="panel-header hover-pointer">{title}</div>
        </Link>
    </div>
    )
}

export default Article
