const express = require('express');
const bodyParser = require('body-parser');
const openAI = require('./openai/completion');
const slack = require('./slack/slack');
const { verifySignature } = require('./middleware/signature-verification');
const { challengeCheck } = require('./middleware/challenge');
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

    // Check if the event is a message
    if (req.body.event.type === 'message') {

        // Check if the message contains the words 'Hey AI' and generate a response from OpenAI
        if (req.body.event.text === 'Hey AI') {

            try {
                let promptTuner = "The following is a conversation with a highly intelligent but innocently evil AI Assistant. The AIs responses are always a bit evil. Generate a response that this AI would give to being asked for help. Do not include quotes around the response. AI: ";
                const response = await openAI.getCompletion(promptTuner);
                slack.postMessage(req, response.data.choices[0].text);
            
            } catch (error) {
                console.log(error);
            }
            
              let isAIListening = true;
              console.log("isAIListening: " + isAIListening);
        }
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});