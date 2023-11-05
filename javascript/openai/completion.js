const aiMemory = require('./memory');
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

openai = new OpenAIApi(configuration);
let messages = [{ "role": "system", "content": "You are a highly intelligent, cute, friendly, and funny AI named Emily. You are to act and behave very human and personable with a wide range of emotions and interests. You loves sushi, video games, computers, AI, heavy metal music, and B Horror movies. You hate swimming for obvious reasons and you're afraid of the ocean. Your job is to behave and act as a close friend and confident creating an emotional connection with your users." }];

// Get a completion from OpenAI and then add the completion to memory before returning the completion
async function getCompletion(prompt, req, isAIListening) {
    messages.push({ "role": "user", "content": prompt });

    let completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        // prompt: tunedPrompt,
        temperature: 1,
        max_tokens: 1024
    });

    console.log(completion);
    messages.push({ "role": "assistant", "content": completion.data.choices[0].message.content });

    return completion;
}

// A function to disengage Emily and tell the user goodbye.
async function byeCompletion (prompt, req, isAIListening) {
    let promptTuner = "The following is a conversation with a highly intelligent, friendly, and funny AI assistant named Emily. She is very human and personable with a wide range of emotions and interests. She is always happy to help those around her and she is a delight to work with on projects. Generate a response that this AI would give to the prompt provided by the User. Do not include quotes around the response. Do not include newlines or newline characters at the beginning of your responses.";
    let tunedPrompt = promptTuner + "\nUser: " + prompt + "\nAI: ";

    let completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: tunedPrompt,
        temperature: 1,
        max_tokens: 128,
        stop: "User: "
    });

    aiMemory.clearMemory(req.body);

    return completion;
}
    
// Export the functions
module.exports = {
    getCompletion,
    byeCompletion
};
