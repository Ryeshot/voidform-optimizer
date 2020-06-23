const email = window.Email

const formatBugReportContent = (body) => {
    const appHeader = "<h1>Bug Report for Voidform Optimizer</h1>\n"
    const descriptionHeader = "<h3>Give a brief description of the issue</h3>"
    //const reproductionHeader = "### How can this issue be reproduced?"
    const expectedBehaviorHeader = "<h3>What is the expected behavior?</h3>"
    const actualBehaviorHeader = "<h3>What is the actual behavior?</h3>"

    const headers = [descriptionHeader, expectedBehaviorHeader, actualBehaviorHeader]

    const userContent = Object.keys(body).reduce((content, key, i) => {
        return content.concat([headers[i], body[key]])
    }, []).join("\n")

    return appHeader + userContent
}

const sendBugReport = async (title, content) => {
    const data = {
        SecureToken: process.env.REACT_APP_SMTP_ACCESS_TOKEN,
        From: process.env.REACT_APP_SENDER_GMAIL_USER,
        To: process.env.REACT_APP_RECEIVER_GMAIL_USER,
        Subject: title,
        Body: content
    }

    const result = await email.send(data)

    if(result !== "OK") throw new Error(result)
}

export const submitBugReport = async (data, success, fail) => {

    const {title, ...body} = data

    const content = formatBugReportContent(body)

    try {
        await sendBugReport(`[BUG] ${title}`, content)
        success()
    }
    catch(err){
        console.log(err)
        fail()
    }
}
