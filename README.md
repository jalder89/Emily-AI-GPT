# OpenAI-Slack-Express-App
An Express app that connects Slack with OpenAI via a Slack App. This app is built using JavaScript, Node, Express and Axios. It explicitly avoids the Slack Bolt SDK in order to show familiarity working with Express directly. Implementation can be simplified with implementation of the Bolt SDK.

## Usage

DM the app 'hey ai' to engage
DM the app 'bye ai' to disengage
The app is always on in IMs with the app.

## Installation

To use this app you'll need access to OpenAI API, a Slack App, and way to host the app. I'm not launching this into production on my own at this time, so you'll need to do the lifting on your end.

To set things setup, follow these steps(Mac):

1. Clone the repo to your own directory: `git clone https://github.com/jalder89/Slack-Express-App-OpenAI.git`
2. Change into the new app directory
3. Use terminal to install: `npm install`
4. Create a Slack App here: https://api.slack.com/apps
5. Import with a manifest, found here: https://gist.github.com/jalder89/0a806e5d56dd7055943f71e5b3c82f83
6. Install the Slack App to your workspace
7. Head to the OAuth & Permissions and copy the Bot Token
8. Create a .env file in your app's root directory and add the bot token: `SLACK_BOT_TOKEN="yourBotToken"
9. Head back to the Slack App website and navigate to the Basic Info tab, copy the Signing Secret
10. Back in your .env file, add the Signing Secret: `SLACK_SIGNING_SECRET="yourSigningSecret"`
11. You'll need to generate an OpenAI API key: https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key
12. Add your OpenAI API key to your .env file as well: OPENAI_API_KEY="yourApiKey"
13. Open a terminal to your app directory and start the app: `node app.js`
14. Open a second terminal and start ngrok: `ngrok http 3000`
15. Update the Event Request URL to your ngrok forwarding URL or host address, the included one is a placeholder that is already removed.


## Important Note
This app does support public and private channels. However, the app is not currently designed to offer robust support for channels with many users as it's memory hasn't been switched to a database just yet. This is on the list of things to do in the future, currently working on MongoDB support.

AI is a paid service and can become quite expensive for the host, please be courteous with your usage if your key is paid by someone else.
