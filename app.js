const express = require('express');
const { parseBody, verifySignature, challengeCheck } = require('./middleware/middleware');
const slackEvent = require('./slack/processing/process-event');
const slackAuth = require('./slack/api/slackAuth');
const app = express();
require('dotenv').config();

app.use(express.static('public'));

// Serve up Emily AI's homepage
app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/register', async (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

// Slack App OAuth flow
app.get('/slack/oauth', parseBody, async (req, res) => {
    // Get the access token from Slack
    process.env.SLACK_BOT_TOKEN = await slackAuth.getAccessToken(req.queryParams, res);
    res.redirect(302, 'https://www.emilyai.net/slack/oauth-complete');
});

app.get('/slack/oauth-complete', async (req, res) => {
    res.sendFile(__dirname + '/slack/oauth-complete.html');
});

// Listen to POST requests on /slack/events
app.post('/slack/events', parseBody, verifySignature, challengeCheck, async (req, res) => {
    // Respond to Slack with a 200 OK
    res.send('ok');

    // Process the Slack event
    await slackEvent.processEvent(req);
});

app.listen(Number(process.env.PORT || 3000), () => {
    console.log(`Server is listening on port ${process.env.PORT || 3000}`);
});
