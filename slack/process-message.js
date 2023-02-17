const openAI = require('../openai/completion');
const slackChat = require('../slack/api/slackChat');
const memory = require('../openai/memory');

let isAIListening = false;

async function processMessage(req) {
    
    // Check if the message contains the words 'Hey AI' and generate a response from OpenAI
    if (req.body.event.text.toLowerCase() == 'hey emily' || req.body.event.channel_type == 'im' || 
        (req.body.event.channel_type == 'group' && req.body.event.subtype == 'channel_join') && isAIListening == false) {

        try {
            const response = await openAI.getCompletion(req.body.event.text);

            // Send the response to the Slack channel
            slackChat.postMessage(req, response.data.choices[0].text);
    
        } catch (error) {
            console.log(error);
        }
    
        // Set isAIListening for gating the AI
        isAIListening = true;
        console.log("isAIListening: " + isAIListening);
        return;

    } else if (req.body.event.text.toLowerCase() == 'bye emily' && isAIListening == true) {

        // Set isAIListening for gating the AI
        isAIListening = false;
        console.log("isAIListening: " + isAIListening);
        const response = await openAI.byeCompletion(req.body.event.text);
        // Send the response to the Slack channel
        slackChat.postMessage(req, response.data.choices[0].text);
        memory.clearMemory();
        return;

    }

    // Check if the AI is listening and generate a response from OpenAI based on the message received
    if (isAIListening == true && req.body.event.bot_id == undefined) {

        // Generate a response from OpenAI
        try {
            const response = await openAI.getCompletion(req.body.event.text);
            memory.getMemory();

            // Send the response to the Slack channel
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