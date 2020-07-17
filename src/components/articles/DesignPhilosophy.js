import React from "react"
import sections from "../../lib/articles/designPhilosophy"
import Article, {ArticleLink} from "./Article"

const title = "Design Philosophy"
const url = "/articles/design-philosophy"

const DesignPhilosophy = () => {
    return (
        <Article title={title} sections={sections} />
    )
}

export const DesignPhilosophyLink = () => {
    return (
        <ArticleLink title={title} url={url} />
    )
}

export default DesignPhilosophy