const openAI = require('../../openai/completion');
const slackChat = require('../../slack/api/slackChat');

let isAIListening = false;

async function processMessage(req) {
    // Check if the AI is not listening and the message matches the words 'hey emily', or 
    // the message is from an IM and not from a bot, or  
    // the message is in a group and is a channel_join message and is not from a bot and not from the AI, then
    // generate a response from OpenAI. 
    // TODO: Break into individual functions for readability and maintainability
    // if (isAIListening == false && req.body.event.text.toLowerCase() == 'hey emily' || ((req.body.event.channel_type == 'im' && req.body.event.text.toLowerCase() != 'bye emily' && req.body.event.app_id === undefined) || 
    // (req.body.event.channel_type == 'group' && req.body.event.subtype == 'channel_join' && req.body.event.bot_id === undefined && req.body.event.user != "U04Q51Y2ABS") ||
    // (req.body.event.channel_type == 'channel' && req.body.event.subtype == 'channel_join' && req.body.event.bot_id === undefined && req.body.event.user != "U04Q51Y2ABS"))) {
    
    if (!isAIListening && isTextHeyEmily(req.body.event.text) || (isAppropriateChannel(req.body.event) && isNotByeEmily(req.body.event.text))) {
        isAIListening = true;
        try {
            const response = await openAI.getCompletion(req.body.event.text, req, isAIListening);
            slackChat.postMessage(req, response.data.choices[0].message.content);
        } catch (error) {
            console.log(error);
        }

        return;
    }
    
    if (req.body.event.text.toLowerCase() == 'bye emily' && isAIListening == true) {
        isAIListening = false;
        const response = await openAI.byeCompletion(req.body.event.text, req, isAIListening);
        slackChat.postMessage(req, response.data.choices[0].message.content);

        return;
    }

    // Check if the AI is listening and is not from a bot
    if (isAIListening == true && req.body.event.bot_id == undefined) {
        console.log("Running isLsitenting bot_id undefined");
        try {
            const response = await openAI.getCompletion(req.body.event.text, req);
            slackChat.postMessage(req, response.data.choices[0].message.content);
            
            return;
        } catch (error) {
            console.log(error);
        }
    }
}

const isTextHeyEmily = (text) => text.toLowerCase() === 'hey emily';
const isNotByeEmily = (text) => text.toLowerCase() !== 'bye emily';
const isAppropriateChannel = (event) => {
    const { channel_type, subtype, app_id, bot_id, user } = event;
    if (channel_type === 'im' && app_id === undefined) {
        return true;
    }
    if ((channel_type === 'group' || channel_type === 'channel') && subtype === 'channel_join' && typeof bot_id === undefined || typeof app_id === undefined) {
            return true
        }
    return false;
}

// Export the function
module.exports = {
    processMessage
};