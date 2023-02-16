const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

openai = new OpenAIApi(configuration); 

async function getCompletion(prompt) {
    return await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.8,
        max_tokens: 128,
    });
}
    
// Export the functions
module.exports = {
    getCompletion
};