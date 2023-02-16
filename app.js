const express = require('express');
const bodyParser = require('body-parser');
const { verifySignature } = require('./middleware/signature-verification');
const { challengeCheck } = require('./middleware/challenge');
const slackEvent = require('./slack/process-event');
const app = express();
const port = 3000;

// Add body parser to parse request body depending on content type
app.use(bodyParser.json({type: 'application/json'}), bodyParser.urlencoded({extended: true, type: 'application/x-www-form-urlencoded'}));

app.get('/', (req, res) => {
    // respond to request with an HTML file that says hello
    res.sendFile(__dirname + '/index.html');
});

// Listen to POST requests on /slack/events
app.post('/slack/events', verifySignature, challengeCheck, async (req, res) => {
    // Log the body and respond to Slack with a 200 OK HTTP status code
    console.log('Request body: ', req.body);
    res.send('ok');

    // Process the Slack event
    await slackEvent.processEvent(req);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});