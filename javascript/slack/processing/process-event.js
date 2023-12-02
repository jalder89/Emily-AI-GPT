import * as slackMessage from './process-message.js';

// Process the Slack event for the event type and call the appropriate function
// Currently only processing messages is supported
async function processEvent(req) {
    // Check if the event is a message or channel_join event and not from a bot or Slackbot
    if (req.body.event.type === 'message' && req.body.event.user !== 'USLACKBOT' && req.body.event.subtype === undefined || req.body.event.subtype === 'channel_join') {
        await slackMessage.processMessage(req);
    }
}

// Export the function
export {
    processEvent
};