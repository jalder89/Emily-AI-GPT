import { MongoClient } from "mongodb";

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@aiconversationcluster0.4tyg45o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

// Updates a document in the conversations collection or creates a new document if one does not exist.
async function processConversation({ event: { team: teamID, channel: channelID, user: userID } }, memory, isAIListening) {
    try {
        await client.connect();
        const database = client.db('open_ai');
        const conversations = database.collection('conversations');

        // Check if the teamID exists in the conversations collection
        const teamFound = await conversations.findOne({
            "team.teamID": teamID
        });

        // If the teamID exists, check if the user exists in any channel on the team.
        if (teamFound) {
            const userFound = await conversations.findOne({
                "team.teamID": teamID,
                "team.channel": {
                    $elemMatch: {
                        "user.userID": userID
                    }
                }
            });

            // If the user exists, check if the channel exists on the team.
            if (userFound) {
                const channelFound = await conversations.findOne({
                    "team.teamID": teamID,
                    "team.channel": {
                        $elemMatch: {
                            channelID: channelID,
                            "user.userID": userID
                        }
                    }
                });

                // If the channel exists, update the user's memory and isAIListening.
                if (channelFound) {
                    const result = await conversations.updateOne({
                        "team.teamID": teamID,
                        "team.channel": {
                            $elemMatch: {
                                channelID: channelID,
                                "user.userID": userID
                            }
                        }
                    }, {
                        $set: {
                            "team.$.channel.$[channel].user.$[user].memory": memory,
                            "team.$.channel.$[channel].user.$[user].isAIListening": isAIListening
                        }
                    }, {
                        arrayFilters: [
                            { "channel.channelID": channelID },
                            { "user.userID": userID }
                        ]
                    });
                    if (result.modifiedCount === 1) {
                        console.log("Successfully updated user conversation in database.");
                    } else {
                        console.log("Failed to update user conversation in database.");
                    }
                } else {
                    // If the channel does not exist, create a new channel and add the user to it.
                    const result = await conversations.updateOne({
                        "team.teamID": teamID,
                        "team.channel": {
                            $elemMatch: {
                                "user.userID": userID
                            }
                        }
                    }, {
                        $push: {
                            "team.$.channel": {
                                channelID: channelID,
                                user: [{
                                    userID: userID,
                                    isAIListening: isAIListening,
                                    memory: memory
                                }]
                            }
                        }
                    });
                    if (result.modifiedCount === 1) {
                        console.log("Successfully added channel to conversation in database.");
                    } else {
                        console.log("Failed to add channel to conversation in database.");
                    }
                }
            } else {
                // If the user does not exist, these conversations belongs to another user. Create a new document for this user.
                const result = await conversations.insertOne({
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
                if (result.insertedCount === 1) {
                    console.log("Successfully created new conversation document for user in database.");
                } else {
                    console.log("Failed to create new conversation document for user in database.");
                }
            }
        } else {
            // If the teamID does not exist, create a new document for this team.
            const result = await conversations.insertOne({
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
            if (result.insertedCount === 1) {
                console.log("Successfully created new conversation document for team in database.");
            } else {
                console.log("Failed to create new conversation document for team in database.");
            }
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
            "team.channel": {
                $elemMatch: {
                    channelID: channelID,
                    user: {
                        $elemMatch: {
                            userID: userID
                        }
                    }
                }
            }
        }, 
        {
            projection: {
                _id: 0,
                "team.channel.user.$": 1
            }
        });

        if (conversation && conversation.team[0]?.channel[0]?.user[0]?.memory) {
            console.log("Found conversation in database: " + conversation.team[0].channel[0].user[0].memory);
            return conversation.team[0].channel[0].user[0].memory;
        } else {
            return [];
        }
    } finally {
        await client.close();
    }
}

// Removes a document from the conversations collection. User to clear a conversation after telling emily bye.
async function remove({ event: { team: teamID, channel: channelID, user: userID } }) {
    try {
        await client.connect();
        const database = client.db('open_ai');
        const conversations = database.collection('conversations');

        const result = await conversations.deleteOne({ 
            team: {
                $elemMatch: {
                    teamID: teamID,
                    "channel.channelID": channelID,
                    "channel.user.userID": userID
                }
            }
        });
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
export {
    processConversation,
    find,
    remove
};