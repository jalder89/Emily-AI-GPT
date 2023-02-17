let memory = [];

async function addToMemory(prompt, completion) {

    // Add the prompt and completion to memory
    memory.push({
        prompt: prompt,
        completion: completion,
        count: memory.length + 1
    });

}

// Return the memory array to the caller
async function getMemory() {

    return memory;

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