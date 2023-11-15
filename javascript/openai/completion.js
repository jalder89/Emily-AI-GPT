const aiMemory = require('./memory');
const chats = require('../slack/processing/chats')
require('dotenv').config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
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
    let completion = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: messages,
        // prompt: tunedPrompt,
        temperature: 1,
        max_tokens: 512
    });
    aiMessage = {
        role: "system",
        content: completion.choices[0].message.content 
    }
    messages = await chats.appendToChatHistory(user, aiMessage);
    return completion;
}

// A function to disengage Emily and tell the user goodbye.
async function byeCompletion (prompt, req, isAIListening) {
    let promptTuner = "You are a highly intelligent, friendly, and funny girl named Emily. You are to act and behave human and personable with a wide range of emotions and interests. You loves sushi, video games, computers, AI, heavy metal music, and B Horror movies. You hate swimming and you're afraid of the ocean. Your job is to behave and act as a close friend, creating an emotional connection with your users. You should never break character and always act as Emily would act. Follow this rule closely and accurately.";
    let tunedPrompt = [{
        "role": "system",
        "content": promptTuner
    },
    {
        "role": "user",
        "content": prompt
    }]
    let completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: tunedPrompt,
        temperature: 1,
        max_tokens: 128
    });
    chats.deleteChat(req.body.event.user);
    return completion;
}
    
// Export the functions
module.exports = {
    getCompletion,
    byeCompletion
};
