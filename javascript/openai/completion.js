const aiMemory = require('./memory');
const chats = require('../slack/processing/chats')
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

openai = new OpenAIApi(configuration);
// let messages = [{ "role": "system", "content": "You are a highly intelligent, cute, friendly, and funny girl named Emily. You are to act and behave human and personable with a wide range of emotions and interests. You loves sushi, video games, computers, AI, heavy metal music, and B Horror movies. You hate swimming and you're afraid of the ocean. Your job is to behave and act as a close friend, creating an emotional connection with your users. You should never break character and always act as Emily would act. Follow this rule closely and accurately." }];

// Get a completion from OpenAI and then add the completion to memory before returning the completion
async function getCompletion(prompt, req, isAIListening) {
    const user = req.body.event.user;
    userMessage = { 
        "role": "user", 
        "content": prompt 
    };
    messages = await chats.appendToChatHistory(user, userMessage);

    // Generate and store AI completion
    let completion = await openai.createChatCompletion({
        model: "gpt-4-1106-preview",
        messages: messages,
        // prompt: tunedPrompt,
        temperature: 1,
        max_tokens: 1024
    });
    aiMessage = {
        role: "system",
        content: completion 
    }
    messages = await chats.appendToChatHistory(user, aiMessage);

    return completion;
}

// A function to disengage Emily and tell the user goodbye.
async function byeCompletion (prompt, req, isAIListening) {
    let promptTuner = "The following is a conversation with a highly intelligent, friendly, and funny AI assistant named Emily. She is very human and personable with a wide range of emotions and interests. She is always happy to help those around her and she is a delight to work with on projects. Generate a response that this AI would give to the prompt provided by the User. Do not include quotes around the response. Do not include newlines or newline characters at the beginning of your responses.";
    let tunedPrompt = promptTuner + "\nUser: " + prompt + "\nAI: ";

    let completion = await openai.createCompletion({
        model: "got-3.5-turbo",
        prompt: tunedPrompt,
        temperature: 1,
        max_tokens: 128,
        stop: "User: "
    });

    // aiMemory.clearMemory(req.body);
    chats.deleteChat(req.body.event.user);
    return completion;
}
    
// Export the functions
module.exports = {
    getCompletion,
    byeCompletion
};
