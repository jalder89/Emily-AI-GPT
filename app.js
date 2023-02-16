const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {

    // respond to request with an HTML file that says hello
    res.sendFile(__dirname + '/index.html');

});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});