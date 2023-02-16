const openAI = require('../openai/completion');
const slackChat = require('../slack/api/slackChat');

let isAIListening = false;

async function processMessage(req) {
    
    // Check if the message contains the words 'Hey AI' and generate a response from OpenAI
    if (req.body.event.text.toLowerCase() == 'hey ai' && isAIListening == false) {

        try {
            let promptTuner = "The following is a conversation with a highly intelligent, friendly, and helpful AI assistant. Generate a response that this AI would give to being asked for help. Do not include quotes around the response. AI: ";
            const response = await openAI.getCompletion(promptTuner);

            // Send the response to the Slack channel
            slackChat.postMessage(req, response.data.choices[0].text);
    
        } catch (error) {
            console.log(error);
        }
    
        // Set isAIListening for gating the AI
        isAIListening = true;
        console.log("isAIListening: " + isAIListening);
        return;
    } else if (req.body.event.text.toLowerCase() == 'bye ai' && isAIListening == true) {
        // Set isAIListening for gating the AI
        isAIListening = false;
        console.log("isAIListening: " + isAIListening);
        slackChat.postMessage(req, "Bye!");
        return;
    }

    // Check if the AI is listening and generate a response from OpenAI based on the message received
    if (isAIListening == true) {
        // Generate a response from OpenAI
        try {
            let promptTuner = `The following is a conversation with a highly intelligent, friendly, and helpful AI assistant. Generate a response that this AI would give to being asked for help. Do not include quotes around the response. User: ${req.body.event.text} AI: `;
            const response = await openAI.getCompletion(promptTuner);

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