const { MongoClient } = require("mongodb");
require('dotenv').config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@aiconversationcluster0.4tyg45o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function create(conversationID, message, response, count) {
    try {
        await client.connect();
        const database = client.db('open_ai');
        const conversations = database.collection('conversations');

        await conversations.insertOne({
            conversation_id: conversationID,
            memory: [{
                message: message,
                response: response,
                count: count
            }]
        });
    } finally {
        await client.close();
    }
}

async function update(conversationID, memory) {
    try {
        await client.connect();
        const database = client.db('open_ai');
        const conversations = database.collection('conversations');

        const result = await conversations.updateOne(
            { conversation_id: conversationID },
            { $set: { memory: memory  } },
            { upsert: true }
        );

        if (result) {
            return result.memory || [];
        } else {
            return [];
        }
    } finally {
        await client.close();
    }
}


async function find(conversationID) {
    try {
        await client.connect();
        const database = client.db('open_ai');
        const conversations = database.collection('conversations');

        const conversation = await conversations.findOne(
            { conversation_id: conversationID },
            { projection: { _id: 0, memory: 1 } }
        );

        if (conversation) {
            return conversation.memory || [];
        } else {
            return [];
        }
    } finally {
        await client.close();
    }
}

async function remove(conversationID) {
    try {
        await client.connect();
        const database = client.db('open_ai');
        const conversations = database.collection('conversations');

        const result = await conversations.deleteOne({ conversation_id: conversationID });
        if (result.deletedCount === 1) {
            console.log("Successfully deleted conversation from database.");
        } else {
            console.log("No conversation found in database.");
        }
    } finally {
        await client.close();
    }
}

// export the function
module.exports = {
    create,
    update,
    find,
    remove
};