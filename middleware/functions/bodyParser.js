const querystring = require('querystring');

function parseBody(req, res, next) {
    req.setEncoding('utf8');
    let data = '';

    req.on('data', function(chunk) {
      data += chunk;
    });
  
    req.on('end', function() {
      const contentType = req.headers['content-type'];

      if (contentType === 'application/json') {
        rawBody = data;
        body = JSON.parse(data);

      } else if (contentType === 'application/x-www-form-urlencoded') {
        rawBody = data;
        body = querystring.parse(data);
      }
      
      next();
    });
  }

  // Export function
    module.exports = {
        parseBody
    };