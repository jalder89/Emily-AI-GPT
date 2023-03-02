# Emily AI
https://www.emilyai.net

An Express based Slack app that connects Slack and OpenAI. The app is built using JavaScript, Node, Express and Axios. It explicitly avoids the Slack Bolt SDK in order to show familiarity working with Express directly, but integration can be simplified with implementation of the Slack Bolt SDK.

### Usage

- DM the app 'hey emily' to engage
- DM the app 'bye emily' to disengage
- The app is always on in DMs

# Setup

To host this app yourself you will need access to OpenAI API, a Slack App, a way to host the app, and a MongoDB database for hosting the AI's conversational memory. You can try out a non-production version of Emily AI by installing the development app here: https://www.emilyai.net

To set things setup, follow these steps (Mac):

### Slack

1. Create a Slack App here: https://api.slack.com/apps
2. Import with a manifest, found here: https://gist.github.com/jalder89/0a806e5d56dd7055943f71e5b3c82f83
3. Install the Slack App to your workspace
4. Head to the OAuth & Permissions section and note down the Bot Token
5. Head back to the Slack App website and navigate to the Basic Info tab, note down the Signing Secret

### OpenAI

1. You'll need to create an OpenAI account if you don't have one and get access to the GPT-3 API.
2. You'll need to generate an OpenAI API key: https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key
3. Note down your API Key.

### MongoDB

1. Create and setup a MongoDB database for the AI memory, I used Atlas: https://www.mongodb.com/basics/mongodb-atlas-tutorial
2. Get your database User and Password and note them down for later.

### Code

1. Clone the repo to your own directory: `git clone https://github.com/jalder89/Slack-Express-App-OpenAI.git`
2. Change into the new app directory
3. Use terminal to install: `npm install`
4. Create a .env file in your app's root directory and add the bot token: `SLACK_BOT_TOKEN="yourBotToken"
5. Back in your .env file, add the Signing Secret: `SLACK_SIGNING_SECRET="yourSigningSecret"`
6. Add your OpenAI API key to your .env file as well: OPENAI_API_KEY="yourApiKey"
7. Add your MongoDB Username & Password to your .env file as MONGO_USER & MONGO_PASSWORD
8. Open a terminal to your app directory and start the app: `node app.js`
9. Open a second terminal and start ngrok: `ngrok http 3000`
10. Head back to https://api.slack.com/apps and open your app
11. Update the Event Request URL to your ngrok forwarding URL or host address, the included one is a placeholder that is already revoked.

### Website

If you intend to use the basic website that is provided to allow people to install the app, you will need to enable distribution on your Slack app and update the Add to Slack button in index.html. If you don't update the Add to Slack button with your own app's ClientID, user's will install the basic app I have hosted on Heroku.

For more on enabling distribution in Slack, check out this article: https://api.slack.com/start/distributing

## Security

Access Tokens are encrypted with AES-256 and stored securely in a remote database, they are not retained locally or stored in the app's code. Tokens are retrieved and decrypted as needed to make API calls.

## Important Note

This app does support public and private channels. However, the app is not currently designed to offer support for multiple users as it's memory hasn't been switched to a data structure that supports multiple conversations, yet. This is on the list of things to do in the future.

AI is a paid service and can become quite expensive for the host, please be courteous with your usage if your key is paid by someone else.
