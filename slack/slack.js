// Description: This file contains the code to send a message to a Slack channel
const axios = require('axios');

// Send a message to a Slack channel using Axios
async function postMessage(req, message) {

    const config = {
        method: 'post',
        url: 'https://slack.com/api/chat.postMessage',
        headers: {
            'Authorization': 'Bearer ' + process.env.SLACK_BOT_TOKEN,
            'Content-Type': 'application/json'
        },
        data: {
            channel: req.body.event.channel,
            text: message
        }
    };

    axios(config)
        .then(function (response) {
            console.log(`Status Code: ${response.status}`);
            console.log(`Status Code: ${JSON.stringify(response.data)}`);
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Export the function
module.exports = {
    postMessage
};