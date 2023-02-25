const { parseBody } = require('./functions/bodyParser');
const { verifySignature } = require('./functions/signature-verification');
const { challengeCheck } = require('./functions/challenge');

// export the functions
module.exports = {
    parseBody,
    verifySignature,
    challengeCheck
};