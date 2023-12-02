import 'dotenv/config';
import express from 'express';
import { parseBody, verifySignature, challengeCheck } from './javascript/middleware/middleware.js';
import * as slackEvent from './javascript/slack/processing/process-event.js';
import * as slackAuth from './javascript/slack/api/slackAuth.js';

const app = express();
app.use(express.static('public'));

// Serve up Emily AI's homepage
app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/register', async (req, res) => {
    res.sendFile(__dirname + '/register.html');
});

app.get('/custom-install', async (req, res) => {
    res.sendFile(__dirname + '/custom-install.html');
});

// Slack App OAuth flow
app.get('/slack/oauth', parseBody, async (req, res) => {
    // Get the access token from Slack
    process.env.SLACK_BOT_TOKEN = await slackAuth.getAccessToken(req.queryParams, res);
    res.redirect(302, 'https://www.emilyai.net/slack/oauth-complete');
});

app.get('/slack/oauth-complete', async (req, res) => {
    res.sendFile(__dirname + '/javascript/slack/oauth-complete.html');
});

// Listen to POST requests on /slack/events
app.post('/slack/events', parseBody, verifySignature, challengeCheck, async (req, res) => {
    res.send('ok');
    await slackEvent.processEvent(req);
});

app.listen(Number(process.env.PORT || 3000), () => {
    console.log(`Server is listening on port ${process.env.PORT || 3000}`);
});
