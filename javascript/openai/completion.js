import * as chats from '../mongodb/chatStore.js';
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Get a completion from OpenAI and then add the completion to memory before returning the completion
async function getCompletion(prompt, req, isAIListening) {
    const user = req.body.event.user;
    const channel = req.body.event.channel;
    const team = req.body.event.team;
    const userMessage = { 
        "role": "user", 
        "content": prompt 
    };

    // Store user message and fetch history
    let messages = await chats.appendToChatHistory(user, channel, team, userMessage);
    
    // Generate and store AI completion
    let completion = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: messages,
        // prompt: tunedPrompt,
        temperature: 1,
        max_tokens: 512
    });
    const aiMessage = {
        role: "system",
        content: completion.choices[0].message.content 
    }
    messages = await chats.appendToChatHistory(user, channel, team, aiMessage);
    return completion;
}

// A function to disengage Emily and tell the user goodbye.
async function byeCompletion (prompt, req, isAIListening) {
    const user = req.body.event.user;
    const channel = req.body.event.channel;
    const team = req.body.team_id;
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
    chats.deleteChat(user, channel, team);
    return completion;
}
    
// Export the functions
export {
    getCompletion,
    byeCompletion
};
