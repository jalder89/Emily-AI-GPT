import { MongoClient } from 'mongodb';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@aiconversationcluster0.4tyg45o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

// Encrypt the access token before storing it in the database
function encrypt(accessToken) {
    const iv = randomBytes(16);
    let cipher = createCipheriv('aes-256-ctr', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), iv);
    let encryptedToken = cipher.update(accessToken, 'utf8', 'hex');
    encryptedToken += cipher.final('hex');

    return `${encryptedToken}.${iv.toString('hex')}}`;
}

// Decrypt the access token before using it to make API calls
function decrypt(encryptedData) {
    const [encryptedToken, iv] = encryptedData.split('.');
    let decipher = createDecipheriv('aes-256-ctr', Buffer.from(process.env.ENCRYPTION_KEY, 'hex'), Buffer.from(iv, 'hex'));
    let accessToken = decipher.update(encryptedToken, 'hex', 'utf8');
    accessToken += decipher.final('utf8');
    return accessToken;
}

// Create a new document in the authorizations collection with the access token from Slack
async function update(res) {
    try {
        encryptedData = encrypt(res.data.access_token);
        await client.connect();
        const database = client.db('slack');
        const authorizations = database.collection('authorizations');

        await authorizations.updateOne(
            { team_id: res.data.team.id },
            { $set: { bot_token: encryptedData } },
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

        const encryptedData = await authorizations.findOne(
            { team_id: team_id },
            { projection: { _id: 0, bot_token: 1 } }
        );

        if (encryptedData) {
            return decrypt(encryptedData.bot_token);
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

export {
    update,
    find,
    remove
};