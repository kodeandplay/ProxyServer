var http = require('http');
var sys  = require('sys');
var url  = require('url');

function notFound(response) {
  response.writeHead(404, {'Content-Type' : 'text/plain'});
  response.end('404: File not found');
}

http.createServer(function(b_req, b_res) {
  var b_url = url.parse(b_req.url, true);

  if(!b_url.query || !b_url.query.url) return notFound(b_res);

  var proxy_url = url.parse(b_url.query.url);

  var options = {
    hostname: proxy_url.hostname,
    port: proxy_url.port || 80,
    path: '/'
  };

  var proxy_request = http.request(options, function(proxy_response) {
    b_res.writeHead(proxy_response.statusCode, proxy_response.headers);

    proxy_response.setEncoding('utf8');
    proxy_response.on('data', function(chunk) {
      b_res.write(chunk);
    });

    proxy_response.on('error', function(err) {
      console.log('problem with request: ', err.message);
    });

    proxy_response.on('end', function() {
      console.log('******************* ENDED ********************');
      b_res.end();      
    });
  });

  /*
   * Note that proxy_request.end() was called. With http.request()
   * one must always call request.end() to signify that you are
   * done with the request - even if there is no data being written
   * to the request body.
   */
  proxy_request.end();  


}).listen(3000);

sys.puts("Server listening on port 3000");
