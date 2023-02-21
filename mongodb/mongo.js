const { MongoClient } = require("mongodb");
require('dotenv').config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@aiconversationcluster0.4tyg45o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

// Creates a new document in the conversations collection. Update is currently used in place of this function.
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

// Updates a document in the conversations collection or creates a new document if one does not exist.
async function update({ event: { team: teamID, channel: channelID, user: userID } }, memory, isAIListening) {
    try {
        await client.connect();
        const database = client.db('open_ai');
        const conversations = database.collection('conversations');

        // Check if team exists
        const teamExists = await conversations.findOne({ 
            team: { 
                $elemMatch: { 
                    teamID: teamID 
                } 
            } 
        });

        if (teamExists) {
            // Check if channel exists
            const channelExists = await conversations.findOne({ 
                team: { 
                    $elemMatch: { 
                        teamID: teamID, 
                        "channel.channelID": channelID 
                    } 
                } 
            });

            if (channelExists) {
                // Check if user exists
                const userExists = await conversations.findOne({ 
                    team: { 
                        $elemMatch: { 
                            teamID: teamID, 
                            "channel.channelID": channelID, 
                            "channel.user.userID": userID 
                        } 
                    } 
                });

                if (userExists) {
                    // Update user
                    const filter = {
                        team: {
                            $elemMatch: {
                                teamID: teamID,
                                "channel.channelID": channelID,
                                "channel.user.userID": userID
                            }
                        }
                    };

                    const update = {
                        $set: {
                            "team.$[t].channel.$[c].user.$[u].isAIListening": isAIListening,
                            "team.$[t].channel.$[c].user.$[u].memory": memory
                        }
                    };

                    const options = {
                        arrayFilters: [{ "t.teamID": teamID }, { "c.channelID": channelID }, { "u.userID": userID }],
                        upsert: false
                    }

                    await conversations.updateOne(filter, update, options);
                } else {
                    // Add user
                    const filter = {
                        team: {
                            $elemMatch: {
                                teamID: teamID,
                                "channel.channelID": channelID
                            }
                        }
                    };

                    const update = {
                        $push: {
                            "team.$[t].channel.$[c].user": {
                                userID: userID,
                                isAIListening: isAIListening,
                                memory: memory
                            }
                        }
                    };

                    const options = {
                        arrayFilters: [{ "t.teamID": teamID }, { "c.channelID": channelID }],
                        upsert: false
                    };

                    await conversations.updateOne(filter, update, options);
                }
            } else {
                // Add channel
                const filter = {
                    team: {
                        $elemMatch: {
                            teamID: teamID
                        }
                    }
                };

                const update = {
                    $push: {
                        "team.$[t].channel": {
                            channelID: channelID,
                            user: [{
                                userID: userID,
                                isAIListening: isAIListening,
                                memory: memory
                            }]
                        }
                    }
                };

                const options = {
                    arrayFilters: [{ "t.teamID": teamID }],
                    upsert: false
                };

                await conversations.updateOne(filter, update, options);
            }
        } else {
            // Add team to team array
            const filter = {};

            const update = {
                $push: {
                    team: {
                        teamID: teamID,
                        channel: [{
                            channelID: channelID,
                            user: [{
                                userID: userID,
                                isAIListening: isAIListening,
                                memory: memory
                            }]
                        }]
                    }
                }
            };

            const options = {
                upsert: true
            };

            await conversations.updateOne(filter, update, options);
        }
    } finally {
        await client.close();
    }
}

// Finds a document in the conversations collection and returns the memory array.
async function find({ event: { team: teamID, channel: channelID, user: userID } }) {
    try {
        await client.connect();
        const database = client.db('open_ai');
        const conversations = database.collection('conversations');

        const conversation = await conversations.findOne({
            "team.teamID": teamID,
            "team.channel.channelID": channelID,
            "team.channel.user.userID": userID
        }, 
        {
            projection: {
                _id: 0,
                "team": {
                    $elemMatch: {
                        "teamID": teamID,
                        "channel.channelID": channelID,
                        "channel.user.userID": userID
                    }
                }
            }
        });

        if (conversation && conversation.team[0]?.channel[0]?.user[0]?.memory) {
            return conversation.team[0].channel[0].user[0].memory;
        } else {
            return [];
        }
    } finally {
        await client.close();
    }
}

// Removes a document from the conversations collection. User to clear a conversation after telling emily bye.
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