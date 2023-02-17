const mongo = require('../mongodb/mongo');
let memory = [];

async function addToMemory(conversationID, prompt, completion) {

    // Add the prompt and completion to memory
    // memory.push({
    //     prompt: prompt,
    //     completion: completion,
    //     count: memory.length + 1
    // });

    // Add the prompt and completion to mongoDB
    await mongo.update(conversationID, prompt, completion, memory.length + 1);

}

// Return the memory array to the caller
async function getMemory() {

    // return memory;
    return await mongo.find(conversationID);

}

async function clearMemory() {

    memory = [];

}

// Export the functions
module.exports = {
    addToMemory,
    getMemory,
    clearMemory
};