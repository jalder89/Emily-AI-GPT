// Description: This file contains the code to send a message to a Slack channel
import axios from 'axios';
import * as oauth from '../../mongodb/oauthStore.js';

// Send a message to a Slack channel using Axios
async function postMessage(req, message) {
    axios({
        method: 'post',
        url: 'https://slack.com/api/chat.postMessage',
        headers: {
            'Authorization': 'Bearer ' + await oauth.find(req.body.team_id),
            'Content-Type': 'application/json'
        },
        data: {
            channel: req.body.event.channel,
            text: message
        }
    }).then(function (response) {
        console.log(`Status Code: ${response.status}`);
    }).catch(function (error) {
        console.log(error);
    });
}

// Export the function
export {
    postMessage
};