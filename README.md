# Let's encourage your team's review

## What's this?

It's a Slack bot to list up review waiting list. It has full support for GitHub and limited support for Azure DevOps.

<img width="1035" alt="2017-08-11 11 15 31" src="https://user-images.githubusercontent.com/1811616/29199753-659fd0e2-7e8a-11e7-8435-99daa8c0b233.png">


## Usage

In your Slack room, just call your bot. For Azure DevOps:


```
/invite @review-bot
@review-bot ls
```

For GitHub:

```
/invite @review-bot
@review-bot ls author:ohbarye
```

For more detailed query in GitHub:

```
/invite @review-bot
@review-bot ls author:ohbarye,basan,org/team owner:ohbarye repo:ohbarye/review-waiting-list-bot,rails/rails
```

argument | presence | description
--- | --- | ---
author | Required | You can specify multiple authors with comma separated values. Also `org/team` is available.
owner | Optional | You can specify multiple owners. If you specify this argument with `-` (e.g. `-owner:ohbarye`), it excludes pull requests of the owner.
repo | Optional | You can specify multiple repositories. If you specify this argument with `-` (e.g. `-repo:ohbarye/review-waiting-list-bot`), it excludes pull requests in the repositories.
label | Optional | You can specify multiple labels. If you specify this argument with `-` (e.g. `-label:enhancement`), it excludes pull requests in the repository.
reviewer | Optional | You can specify multiple reviewers. If you specify this argument with `-` (e.g. `-reviewer:ohbarye`), it excludes pull requests in the repository. Regarding review requests feature on GitHub, see https://blog.github.com/2016-12-07-introducing-review-requests/

Besides, the bot accepts random order.

### Tips

You can use this bot even better in combination with the [Slack reminder](https://get.slack.help/hc/en-us/articles/208423427-Set-a-reminder).

For instance, the following reminder setting invokes the bot every weekday 11 am.

```
/remind #general “@review-bot ls author:ohbarye,basan,org/team owner:ohbarye repo:ohbarye/review-waiting-list-bot,rails/rails” at 11am every weekday
```

## Develop

### Setup

```sh
$ git clone git@github.com:kimsey0/review-waiting-list-bot.git
$ npm install -g yarn # or brew install yarn
$ yarn
```

### Start

For GitHub:

```sh
$ SLACK_BOT_TOKEN=your-slack-bot-token GITHUB_AUTH_TOKEN=your-github-auth-token yarn start
```

For Azure DevOps:
```sh
$ SLACK_BOT_TOKEN=your-slack-bot-token AZURE_DEVOPS_ORGANIZATION=your-azure-devops-organization AZURE_DEVOPS_PROJECT=your-azure-devops-project-name AZURE_DEVOPS_PERSONAL_ACCESS_TOKEN=your-azure-devops-personal-access-token yarn start
```

### Test / Lint

```sh
$ yarn test
$ yarn lint
```

## Deployment

If you want to deploy to Heroku, just click following button.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Run with Docker

Pull the Docker image and run with your Slack bot token and GitHub or Azure DevOps credentials. For GitHub:

```sh
docker pull kimsey0/review-waiting-list-bot
docker run -e SLACK_BOT_TOKEN=your-slack-bot-token -e GITHUB_AUTH_TOKEN=your-github-auth-token kimsey0/review-waiting-list-bot
```

For Azure DevOps:

```sh
docker pull kimsey0/review-waiting-list-bot
docker run -e SLACK_BOT_TOKEN=your-slack-bot-token -e AZURE_DEVOPS_ORGANIZATION=your-azure-devops-organization -e AZURE_DEVOPS_PROJECT=your-azure-devops-project-name -e AZURE_DEVOPS_PERSONAL_ACCESS_TOKEN=your-azure-devops-personal-access-token kimsey0/review-waiting-list-bot
```

## Environment Variables

### SLACK_BOT_TOKEN (required)

Slack bot API token.

If you do not have it yet, visit https://my.slack.com/services/new/bot and get the token.


### GITHUB_AUTH_TOKEN (required for GitHub)

GitHub bot API token.
If you're not familiar with it, see https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/

#### Note about scopes of GITHUB_AUTH_TOKEN

You need to grant your token the following required scopes to execute queries from the bot.

- `repo`
- `read:org`
- `read:discussion`

### AZURE_DEVOPS_ORGANIZATION and AZURE_DEVOPS_PROJECT (required for Azure DevOps)

The `organization` and `project` parts of your `https://dev.azure.com/organization/project` URL.

### AZURE_DEVOPS_PERSONAL_ACCESS_TOKEN (required for Azure DevOps)

See https://docs.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/pats?view=vsts
