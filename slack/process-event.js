const slackMessage = require('./process-message');

// Process the Slack event for the event type and call the appropriate function
// Currently only processing messages is supported
async function processEvent(req) {
    console.log(`Processing event: ${req.body.event.type}`);

    // Check if the event is a message
    if (req.body.event.type === 'message') {

        // Process the message
        await slackMessage.processMessage(req);

    }

}

// Export the function
module.exports = {
    processEvent
};