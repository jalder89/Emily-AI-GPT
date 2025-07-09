# Emily AI
https://www.emilyai.net

An Express based Slack app that connects Slack and OpenAI. The app is built using JavaScript, Node, Express and Axios. It explicitly avoids the Slack Bolt SDK in order to show familiarity working with Express directly, but integration can be simplified with implementation of the Slack Bolt SDK.

## Usage

### Channels
Emily will respond to all messages in a channel once she is greeted. It is not recommended to add her to a busy channel, for now. Improvements will be made in the future.
- Add Emily to your desired channel
- Greet Emily with 'Hey Emily' to engage
- Say goodbye with 'Bye Emily' to disengage and delete the chat history for the current channel

### DMs
Emily is always on in DMs and will respond to any chat, but it is best tp continue using Hey Emily and Bye Emily until improvements can be made to her listening logic. Outside of that, simply open a DM with her and speak with her as you would anyone else. 
- You can delete your chat history from Emily's database by saying `Bye Emily` when she is listening after saying Hey Emily.
- If Emily doesn't respond to Bye Emily greet her with Hey Emily and then try again. This will trigger her to listen for the command, this will be improved in the future.


## Installation

To host this app yourself you will need access to OpenAI API, a Slack App, a way to host the app, and a MongoDB database for hosting the AI's conversational memory. You can try out a non-production version of Emily AI by installing the development app here: https://www.emilyai.net

To set things setup, follow these steps(Mac):

### Repository Setup

1. Clone the repo to your own directory: `git clone https://github.com/jalder89/Slack-Express-App-OpenAI.git`
2. Change into the new app directory
3. Use terminal to install: `npm install`

### Slack App Setup

1. Grab the Slack App Manifest found here: https://gist.github.com/jalder89/0a806e5d56dd7055943f71e5b3c82f83
2. Update the Request URL in the manifest to point to the URL where your app will be listening for Slack events, such as your ngrok forward url, we'll cover ngrok forwarding in a bit
3. Create a Slack App here: https://api.slack.com/apps
4. Import using the updated manifest
5. Install the Slack App to your workspace from the Basic Information tab
6. Head to the OAuth & Permissions and copy the Bot Token

### Environment Variables
Setting up environment variables will depend on how you are hosting the app. The following covers hosting locally via Ngrok.

1. Create a `.env` file in your app's root directory and add the bot token: `SLACK_BOT_TOKEN="yourBotToken"`
2. Head back to the Slack App website and navigate to the Basic Info tab, copy the Signing Secret
3. Back in your `.env` file, add the Signing Secret: `SLACK_SIGNING_SECRET="yourSigningSecret"`
4. You'll need to generate an OpenAI API key: https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key
5. Add your OpenAI API key to your `.env` file as well: `OPENAI_API_KEY="yourApiKey"`

### MongoDB Setup

1. Create and setup a MongoDB database for the AI memory, I used Atlas: https://www.mongodb.com/basics/mongodb-atlas-tutorial
2. Get your database cluster Username and Password and add them to your `.env` file as `MONGO_USER` & `MONGO_PASSWORD`
3. Open your new cluster and click the Connect button and select Driver to view the connection string.
4. Copy only the section of the URL between the @ and the first forwardslash / before the query parameters
5. Add this string to your `.env` file as `MONGO_CLUSTER`

### Hosting Locally via Ngrok
  
1. Open a terminal to your app's root directory and start the app: `node app.js` || `npm start`
2. Open a second terminal and start ngrok: `ngrok http 3000`
3. Update the Event Request URL for Slack to point to your ngrok forwarding URL or host address, the included one is a placeholder that is already removed.

## Security
Access Tokens are encrypted with AES-256 and stored securely in a remote database, they are not retained locally or stored in the app's code. Tokens are retrieved and decrypted as needed to make API calls.

## Important Note
This app does support public and private channels. However, the app is still in development and you may notice bugs or odd behavior. Please report any trouble as an Issue on our GitHub here: https://github.com/jalder89/Emily-AI-GPT/issues

AI is a paid service and can become quite expensive for the host, please be courteous with your usage if your key is paid for by someone else.
