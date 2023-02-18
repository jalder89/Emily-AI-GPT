const express = require('express');
const mongo = require('./mongodb/mongo');
const bodyParser = require('./middleware/bodyParser');
const { verifySignature } = require('./middleware/signature-verification');
const { challengeCheck } = require('./middleware/challenge');
const slackEvent = require('./slack/process-event');
const app = express();
const port = 3000;

// Add body parser to parse request body depending on content type
app.use(bodyParser.rawBody);

app.get('/', async (req, res) => {
    // respond to request with an HTML file that says hello
    // res.sendFile(__dirname + '/index.html');
    console.log("creating");
    //await mongo.create('123', 'Hello', 'Hi there', 1);
    console.log("updating");
    await mongo.update('123', 'Goodbye', 'See ya', 2);
    await mongo.update('321', 'Hello', 'Hi there', 1);
    console.log("finding");
    let result1 = await mongo.find('123');
    let result2 = await mongo.find('321');
    let result3 = await mongo.find('456');
    console.log("Printing results");
    console.log("Result 1: " + result1);
    console.log("Result 2: " + result2);
    console.log("Result 3: " + result3);
});

// Listen to POST requests on /slack/events
app.post('/slack/events', verifySignature, challengeCheck, async (req, res) => {
    // Log the body and respond to Slack with a 200 OK HTTP status code
    // console.log('Request body: ', req.body);
    res.send('ok');

    // Process the Slack event
    await slackEvent.processEvent(req);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});