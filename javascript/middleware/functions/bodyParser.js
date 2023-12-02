import url from 'url';
import querystring from 'querystring';

function parseBody(req, res, next) {
    req.setEncoding('utf8');
    let data = '';

    req.on('data', function(chunk) {
      data += chunk;
    });
  
    req.on('end', function() {
      const contentType = req.headers['content-type'];

      if (contentType === 'application/json') {
        req.rawBody = data;
        req.body = JSON.parse(data);
      } else if (contentType === 'application/x-www-form-urlencoded') {
        req.rawBody = data;
        req.body = querystring.parse(data);
      } else if (contentType === undefined && req.method === 'GET') {
        const parsedURL = url.parse(req.url, true);
        req.queryParams = parsedURL.query;
      }

      next();
    });
  }

  // Export function
    export {
        parseBody
    };