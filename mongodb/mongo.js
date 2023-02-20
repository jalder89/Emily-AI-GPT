const { MongoClient } = require("mongodb");
require('dotenv').config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@aiconversationcluster0.4tyg45o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function create({ event: { team_id: teamID, channel: channelID, user: userID } }, isAIListening, memory) {
    try {
        await client.connect();
        const database = client.db('open_ai');
        const conversations = database.collection('conversations');

        await conversations.insertOne({
            team: [{
                teamID: teamID,
                channel: [{
                    channelID: channelID,
                    user: [{
                        userID: userID,
                        isAIListening: isAIListening,
                        memory: memory
                    }]
                }]
            }]
        });
    } finally {
        await client.close();
    }
}

async function update({ event: { team_id: teamID, channel: channelID, user: userID } }, memory, isAIListening) {
    try {
        await client.connect();
        const database = client.db('open_ai');
        const conversations = database.collection('conversations');

        const filter = {
            "team.teamID": [teamID],
            "team.channel.channelID": [channelID],
            "team.channel.user.userID": [userID]
        };

        const update = {
            $set: {
                "team.$[t].channel.$[c].user.$[u].isAIListening": isAIListening,
                "team.$[t].channel.$[c].user.$[u].memory": memory
            }
        };

        const options = {
            arrayFilters: [{ "t.teamID": [teamID] }, { "c.channelID": [channelID] }, { "u.userID": [userID] }],
            upsert: true
        }

        const existingConversation = await conversations.findOne(filter);

        if (existingConversation && Array.isArray(existingConversation.team)) {
            await conversations.updateOne(filter, update, options);
        } else {
            const newDocument = {
                conversation_id: userID,
                team: [{
                    teamID: [teamID],
                    channel: [{
                        channelID: [channelID],
                        user: [{
                            userID: [userID],
                            isAIListening: isAIListening,
                            memory: memory
                        }]
                    }]
                }]
            };

            await conversations.insertOne(newDocument);
        }
    } finally {
        await client.close();
    }
}


async function find({ event: { team_id: teamID, channel: channelID, user: userID } }) {
    try {
        await client.connect();
        const database = client.db('open_ai');
        const conversations = database.collection('conversations');

        const conversation = await conversations.findOne(
            { "team.teamID": teamID, "team.channel.channelID": channelID, "team.channel.user.userID": userID },
            { projection: {_id: 0, "team": { $elemMatch: { "teamID": teamID, "channel.channelID": channelID, "channel.user.userID": userID } } } }
        );

        if (conversation && conversation.team[0].channel[0].user[0].memory) {
            return conversation.team[0].channel[0].user[0].memory;
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