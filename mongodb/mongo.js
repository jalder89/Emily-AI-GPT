const { MongoClient } = require("mongodb");
require('dotenv').config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@aiconversationcluster0.4tyg45o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {

    try {
      const database = client.db('sample_mflix');
      const movies = database.collection('movies');
      // Query for a movie that has the title 'Back to the Future'
      const query = { title: 'Back to the Future' };
      const movie = await movies.findOne(query);
      console.log(movie);
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }

}

async function create(conversationID, message, response, count) {

    try {
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

async function update(conversationID, message, response, count) {

    try {
        const database = client.db('open_ai');
        const conversations = database.collection('conversations');
        await conversations.updateOne(
            { conversation_id: conversationID },
            { $push: { memory: { message: message, response: response, count: count } } },
            { upsert: true }
        );
    } finally {
        await client.close();
    }

}


async function find(conversationID) {
    try {
        const database = client.db('open_ai');
        const conversations = database.collection('conversations');
        console.log("Running find()...");
        const result = await conversations.findOne({ conversation_id: conversationID });

        if (result) {
            return result.memory || [];
        } else {
            return [];
        }

    } finally {
        await client.close();
    }

}

// export the function
module.exports = {
    run,
    create,
    update,
    find
};