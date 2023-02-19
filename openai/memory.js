const mongo = require('../mongodb/mongo');

async function addToMemory(conversationID, prompt, completion, memory) {
    memory.push({
        message: prompt,
        response: completion,
        count: memory.length + 1
    });

    // Add the prompt and completion to mongoDB
    await mongo.update(conversationID, memory);
}

// Return the memory array to the caller
async function getMemory(conversationID) {
    const result = await mongo.find(conversationID);
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