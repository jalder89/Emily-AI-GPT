const {MongoClient} = require('mongodb');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@aiconversationcluster0.4tyg45o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

// Create a new document in the authorizations collection with the access token from Slack
async function update(res) {
    try {
        await client.connect();
        const database = client.db('slack');
        const authorizations = database.collection('authorizations');

        await authorizations.updateOne(
            { team_id: res.data.team.id },
            { $set: { bot_token: res.data.access_token } },
            { upsert: true }
        );
    } finally {
        await client.close();
    }
}

// Find the access token for the team in the authorizations collection
async function find(team_id) {
    try {
        await client.connect();
        const database = client.db('slack');
        const authorizations = database.collection('authorizations');

        const accessToken = await authorizations.findOne(
            { team_id: team_id },
            { projection: { _id: 0, bot_token: 1 } }
        );

        if (accessToken) {
            return accessToken.bot_token;
        } else {
            return 'NO TOKEN FOUND';
        }
    } finally {
        await client.close();
    }
}

// Delete the access token for the team in the authorizations collection
async function remove(team_id) {
    try {
        await client.connect();
        const database = client.db('slack');
        const authorizations = database.collection('authorizations');

        const result = await authorizations.deleteOne({ team_id: team_id });
        if (result.deletedCount === 1) {
            console.log("Successfully deleted access token from database.");
        } else {
            console.log("No team authorization found in database.");
        }
    } finally {
        await client.close();
    }
}

module.exports = {
    update,
    find,
    remove
};