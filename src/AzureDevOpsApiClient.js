'use strict'

const azdev = require('azure-devops-node-api')

class AzureDevOpsApiClient {
  constructor() {
    this.orgUrl = `https://dev.azure.com/${process.env.AZURE_DEVOPS_ORGANIZATION}`

    const authHandler = azdev.getPersonalAccessTokenHandler(process.env.AZURE_DEVOPS_PERSONAL_ACCESS_TOKEN)
    this.connection = new azdev.WebApi(this.orgUrl, authHandler)
  }

  async getAllPullRequests() {
    const git = await this.connection.getGitApi()
    const prs = await git.getPullRequestsByProject(process.env.AZURE_DEVOPS_PROJECT)

    return prs.map(p => ({
        title: p.title,
        labels: {
            nodes: [],
        },
        reviewRequests: {
            nodes: p.reviewers.map(r => {
                let login
                if (r.uniqueName.includes("@")) {
                    login = r.uniqueName.split("@")[0]
                } else {
                    login = r.uniqueName.split("\\").slice(-1)[0]
                }
                return {
                    requestedReviewer: {
                        login: login,
                    },
                }
            }),
        },
        url: `${this.orgUrl}/${p.repository.project.name}/_git/${p.repository.name}/pullrequest/${p.pullRequestId}`,
        author: {
            login: p.createdBy.displayName,
        },
    }))
  }
}

module.exports = AzureDevOpsApiClient