const express = require('express');
const mongo = require('./mongodb/mongo');
const { parseBody, verifySignature, challengeCheck } = require('./middleware/middleware');
const slackEvent = require('./slack/process-event');
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    // Simple HTML test
    res.sendFile(__dirname + '/index.html');
});

// Listen to POST requests on /slack/events
app.post('/slack/events', parseBody, verifySignature, challengeCheck, async (req, res) => {
    // Respond to Slack with a 200 OK
    res.send('ok');

    // Process the Slack event
    await slackEvent.processEvent(req);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
