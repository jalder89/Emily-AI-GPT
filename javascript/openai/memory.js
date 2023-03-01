const mongo = require('../mongodb/mongo');


async function addToMemory(req, prompt, completion, memory, isAIListening) {
    memory.push({
        message: prompt,
        response: completion,
        count: memory.length + 1
    });

    // Add the prompt and completion to mongoDB
    await mongo.processConversation(req.body, memory, isAIListening);
}

// Return the memory array to the caller
async function getMemory(req) {
    const result = await mongo.find(req.body);
    return result;
}

async function clearMemory(conversationID) {
    await mongo.remove(conversationID);
}

// Export the functions
module.exports = {
    addToMemory,
    getMemory,
    clearMemory
};