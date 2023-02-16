// Middlware that checks if the request is a challenge request and responds accordingly
function challengeCheck(req, res, next) {
    if (req.body.challenge) {
        res.send(req.body.challenge);
    } else {
        next();
    }
}

// Export the function
module.exports = {
    challengeCheck
};