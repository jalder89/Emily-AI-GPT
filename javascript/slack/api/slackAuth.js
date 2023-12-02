import axios from 'axios';
import * as oauth from '../../mongodb/oauth.js';

// Get eachange temporary code for access token from Slack
async function getAccessToken({ code }, res) {
    const config = {
        method: 'post',
        url: 'https://slack.com/api/oauth.v2.access',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${process.env.SLACK_CLIENT_ID}:${process.env.SLACK_CLIENT_SECRET}`).toString('base64')}`
        },
        data: {
            code: code,
            client_id: process.env.SLACK_CLIENT_ID,
            client_secret: process.env.SLACK_CLIENT_SECRET
        }
    };

    try {
        oauth.update(await axios(config));
    } catch (error) {
        console.log(error);
        res.status(500).send('Error getting access token');
    }
}

export {
    getAccessToken
};