/**
 * Created by claude on 04.03.16.
 */

var http = require('http');

http.createServer(function(request, response) {
    response.writeHead(200);
    response.write('Hello World!');
    response.end();
}).listen(8080);

console.log('Listening on port 8080...');