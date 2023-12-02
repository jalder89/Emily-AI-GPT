const openAI = require('../../openai/completion');
const slackChat = require('../api/slackChat');

let isAIListening = false;

async function processMessage(req) {
    // Check if the AI is not listening and the message matches the words 'hey emily', or 
    // the message is from an IM and not from a bot, or  
    // the message is in a group and is a channel_join message and is not from a bot and not from the AI, then
    // generate a response from OpenAI.
    if (!isAIListening && isTextHeyEmily(req.body.event.text) || (isAppropriateConversationEvent(req.body.event) && isNotByeEmily(req.body.event.text))) {
        isAIListening = true;
        try {
            const response = await openAI.getCompletion(req.body.event.text, req, isAIListening);
            slackChat.postMessage(req, response.choices[0].message.content);
        } catch (error) {
            console.log(error);
        }
        return;
    }
    
    if (req.body.event.text.toLowerCase() == 'bye emily' && isAIListening == true) {
        isAIListening = false;
        const response = await openAI.byeCompletion(req.body.event.text, req, isAIListening);
        slackChat.postMessage(req, response.choices[0].message.content);
        return;
    }

    // Check if the AI is listening and is not from a bot
    if (isAIListening == true && req.body.event.bot_id == undefined) {
        try {
            const response = await openAI.getCompletion(req.body.event.text, req);
            slackChat.postMessage(req, response.choices[0].message.content);
            return;
        } catch (error) {
            console.log(error);
        }
    }
}

const isTextHeyEmily = (text) => text.toLowerCase() === 'hey emily';
const isNotByeEmily = (text) => text.toLowerCase() !== 'bye emily';
const isAppropriateConversationEvent = (event) => {
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