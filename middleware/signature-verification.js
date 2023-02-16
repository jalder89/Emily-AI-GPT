const crypto = require('crypto');
require('dotenv').config();

// Middleware to verify the signature of Slack requests before processing them further
function verifySignature(req, res, next) {
    // Get the raw body of the request and the signature and timestamp headers
    request_body = JSON.stringify(req.body);
    const slackSignature = req.headers['x-slack-signature'];
    const slackRequestTimestamp = req.headers['x-slack-request-timestamp'];

    // Check if the timestamp is too old, reject the request if it is
    if (Math.abs(new Date().getTime() / 1000 - slackRequestTimestamp) > 300) {
        res.status(400).send('Slack request timestamp expired');
        return;
    }

    // Create the signature and compare it to the one in the header as detailed here: https://api.slack.com/authentication/verifying-requests-from-slack
    const baseString = 'v0:' + slackRequestTimestamp + ':' + request_body;
    const hmac = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET);
    my_signature = 'v0=' + hmac.update(baseString).digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(my_signature, 'utf8'), Buffer.from(slackSignature, 'utf8'))) {
        next();
    } else {
        res.status(401).send('Invalid signature');
    }
}
  
 // export the functions
module.exports = {
    verifySignature
};