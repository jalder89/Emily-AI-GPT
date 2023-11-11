// Description: This file contains the code to send a message to a Slack channel
const axios = require('axios');
const oauth = require('../../mongodb/oauth');

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
        console.log(`Response Data: ${JSON.stringify(response.data)}`);
    }).catch(function (error) {
        console.log(error);
    });
}

// Export the function
module.exports = {
    postMessage
};