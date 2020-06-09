import Github from "github-api"

const repository = "voidform-optimizer"
const owner = "ryeshot"

const github = new Github({
    token: process.env.REACT_APP_ACCESS_TOKEN
})
const issues = github.getIssues(owner, repository)

const formatBugReportContent = (body) => {
    const descriptionHeader = "### Give a brief description of the issue"
    //const reproductionHeader = "### How can this issue be reproduced?"
    const expectedBehaviorHeader = "### What is the expected behavior?"
    const actualBehaviorHeader = "### What is the actual behavior?"

    const headers = [descriptionHeader, expectedBehaviorHeader, actualBehaviorHeader]

    return Object.keys(body).reduce((content, key, i) => {
        return content.concat([headers[i], body[key]])
    }, []).join("\n")
}

const sendBugReport = async (report) => {
    const data = {
        ...report
      }

    await issues.createIssue(data)
}

export const submitBugReport = async (data, success, fail) => {

    const {title, ...body} = data

    console.log("About to format content")

    const content = formatBugReportContent(body)

    console.log("Formatted content")
    console.log(content)

    try {
        await sendBugReport({title: `[BUG] ${title}`  , body: content})
        success()
    }
    catch(err){
        console.log(err)
        fail()
    }
}
