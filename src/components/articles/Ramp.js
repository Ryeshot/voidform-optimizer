import React from "react"
import sections from "../../lib/articles/ramp"
import Article, {ArticleLink} from "./Article"

const title = "Ramp"
const url = "/articles/ramp"

const Ramp = () => {
    return (
        <Article title={title} sections={sections} />
    )
}

export const RampLink = () => {
    return (
        <ArticleLink title={title} url={url} />
    )
}

export default Ramp