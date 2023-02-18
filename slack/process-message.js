const openAI = require('../openai/completion');
const slackChat = require('../slack/api/slackChat');

let isAIListening = false;

async function processMessage(req) {
    // Check if the AI is not listening and the message matches the words 'hey emily', or 
    // the message is from an IM and not from a bot, or  
    // the message is in a group and is a channel_join message and is not from a bot and not from the AI, then
    // generate a response from OpenAI. 
    // TODO: Break into individual functions for readability and maintainability
    if (isAIListening == false && req.body.event.text.toLowerCase() == 'hey emily' || (req.body.event.channel_type == 'im' && req.body.event.app_id === undefined) || 
    (req.body.event.channel_type == 'group' && req.body.event.subtype == 'channel_join' && req.body.event.bot_id === undefined && req.body.event.user != "U04Q51Y2ABS")) {
        try {
            const response = await openAI.getCompletion(req.body.event.text, req);

            // Send the response to the Slack channel
            slackChat.postMessage(req, response.data.choices[0].text);
        } catch (error) {
            console.log(error);
        }
    
        isAIListening = true;

        return;
    } else if (req.body.event.text.toLowerCase() == 'bye emily' && isAIListening == true) {
        isAIListening = false;

        const response = await openAI.byeCompletion(req.body.event.text, req);
        slackChat.postMessage(req, response.data.choices[0].text);

        return;
    }

    // Check if the AI is listening and is not from a bot
    if (isAIListening == true && req.body.event.bot_id == undefined) {
        try {
            const response = await openAI.getCompletion(req.body.event.text, req);
            slackChat.postMessage(req, response.data.choices[0].text);
            
            return;
        } catch (error) {
            console.log(error);
        }
    }
}

// Export the function
module.exports = {
    processMessage
};