const aiMemory = require('./memory');
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

openai = new OpenAIApi(configuration);

// Get a completion from OpenAI and then add the prompt and completion to memory before returning the completion
async function getCompletion(prompt, req) {
    let promptTuner = "The following is a conversation with a highly intelligent, friendly, and funny AI assistant named Emily. She is very human and personable with a wide range of emotions and interests. She is always happy to help those around her and she is a delight to work with on projects. Generate a response that this AI would give to the prompt provided by the User. Do not include quotes around the response. Do not include newlines or newline characters at the beginning of your responses.";
    let memory = await aiMemory.getMemory();

    // If memory is not empty, add each memory element to promptTuner while retaining the first memory.
    if (memory.length > 1) {

        const firstCompletion = "\nUser: " + memory[1].prompt + "\nAI: " + memory[1].completion;
        console.log("First Completion: " + firstCompletion)
        promptTuner += "\n" + firstCompletion;

        if (memory.length > 2) {
            for (let i = 2; i < memory.length; i++) {
                if (i < 6) {
                    let memoryItem = memory[i];
                    promptTuner += "\nUser: " + memoryItem.prompt + "\nAI: " + memoryItem.completion;
                    console.log(`Prompt Tuner: ${promptTuner}`);
                } else if ( i == 6 ) {
                    memory.splice(2,2)
                    let memoryItem = memory[4];
                    promptTuner += "\nUser: " + memoryItem.prompt + "\nAI: " + memoryItem.completion;
                    console.log(`Prompt Tuner: ${promptTuner}`);
                }
            }
        }
    }

    let tunedPrompt = promptTuner + "\nUser: " + prompt + "\nAI: ";
    console.log("Fetching completion from OpenAI...");
    let completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: tunedPrompt,
        temperature: 1,
        max_tokens: 512,
        stop: "User: "
    });

    console.log("Adding prompt and completion to memory...");
    aiMemory.addToMemory(req.body.event.user, prompt, completion.data.choices[0].text);

    console.log("Returning completion...");
    return completion;

}

async function byeCompletion (prompt) {

    let promptTuner = "The following is a conversation with a highly intelligent, friendly, and funny AI assistant named Emily. She is very human and personable with a wide range of emotions and interests. She is always happy to help those around her and she is a delight to work with on projects. Generate a response that this AI would give to the prompt provided by the User. Do not include quotes around the response. Do not include newlines or newline characters at the beginning of your responses.";
    let tunedPrompt = promptTuner + "\nUser: " + prompt + "\nAI: ";

    let completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: tunedPrompt,
        temperature: 1,
        max_tokens: 128,
        stop: "User: "
    });

    console.log("Adding prompt and completion to memory...");
    aiMemory.addToMemory(prompt, completion.data.choices[0].text);

    console.log("Returning completion...");
    return completion;

}
    
// Export the functions
module.exports = {
    getCompletion,
    byeCompletion
};