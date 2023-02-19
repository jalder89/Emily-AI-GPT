function parseBody(req, res, next) {
    req.setEncoding('utf8');
  
    let data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });
  
    req.on('end', function() {
      req.bodyRaw = data;
      req.body = JSON.parse(data);
      next();
    });
  }

  // Export function
    module.exports = {
        parseBody
    };