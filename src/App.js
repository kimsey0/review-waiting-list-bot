'use strict'

const SlackBot = require('./SlackBot')
const GitHubApiClient = require("./GitHubApiClient")
const AzureDevOpsApiClient = require("./AzureDevOpsApiClient")
const PullRequests = require('./PullRequests')
const Parser = require('./Parser')
const _ = require('lodash')

class App {
  static start() {
    this.beforeValidate()

    const controller = new SlackBot().getController()

    controller.hears(["ls", "ls (.+)"], ["direct_message", "direct_mention", "mention"], this.ls)
  }

  static ls(bot, message) {
    const conditions = new Parser(message.match ? message.match[0] : {}).parse()

    let client
    if (process.env.GITHUB_AUTH_TOKEN) {
      client = new GitHubApiClient()
    } else {
      client = new AzureDevOpsApiClient()
    }

    client.getAllPullRequests(conditions).then((prs) => {
      bot.startConversation(message, (err, convo) => {
        convo.say(':memo: Review waiting list!')

        const messages = new PullRequests(prs, conditions).convertToSlackMessages()

        if (messages.length > 0) {
          _.each(messages, (pr) => convo.say(pr))
          convo.say("That's all. Please review!")
        } else {
          convo.say('No pull requests for now.')
        }

        convo.next()
      })
    })
  }

  static beforeValidate() {
    let errors = []

    if (!process.env.GITHUB_AUTH_TOKEN
      && !(process.env.AZURE_DEVOPS_ORGANIZATION && process.env.AZURE_DEVOPS_PROJECT && process.env.AZURE_DEVOPS_PERSONAL_ACCESS_TOKEN)) {
      errors.push('Error: Authentication data is missing. Either set GITHUB_AUTH_TOKEN or AZURE_DEVOPS_ORGANIZATION, AZURE_DEVOPS_PROJECT and AZURE_DEVOPS_PERSONAL_ACCESS_TOKEN.')
    }
    if (!process.env.SLACK_BOT_TOKEN) {
      errors.push('Error: SLACK_BOT_TOKEN is missing.')
    }

    if (errors.length > 0) {
      errors.forEach((error) => console.error(error))
      console.error('Cannot continue to start the bot due to critical lack of parameters.')
      process.exit(1)
    }
  }
}

module.exports = App
