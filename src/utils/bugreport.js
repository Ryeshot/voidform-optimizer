import Github from "github-api"

const repository = "voidform-optimizer"
const owner = "ryeshot"

const github = new Github()
const issues = github.getIssues(owner, repository)

export const sendBugReport = async () => {
    const data = {
        title: "Test",
        "body": "Testing issue report\n### And markdown",
        "assignees": [
            owner
          ],
        "labels": [
          "bug"
        ]
      }

      issues.createIssue(data)
}
