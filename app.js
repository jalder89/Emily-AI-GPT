const express = require('express');
const mongo = require('./mongodb/mongo');
const { parseBody, verifySignature, challengeCheck } = require('./middleware/middleware');
const slackEvent = require('./slack/process-event');
const app = express();
const port = 3000;

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
    console.log("Result 1: " + JSON.stringify(result1).toString());
    console.log("Result 2: " + result2);
    console.log("Result 3: " + result3);
    // Send index.html to the browser
    res.sendFile(__dirname + '/index.html');
});

// Listen to POST requests on /slack/events
app.post('/slack/events', parseBody, verifySignature, challengeCheck, async (req, res) => {
    // Log the body and respond to Slack with a 200 OK HTTP status code
    // console.log('Request body: ', req.body);
    res.send('ok');

    // Process the Slack event
    await slackEvent.processEvent(req);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});