/**
 * Created by claude on 04.03.16.
 */

var express = require('express');
var app = express();

// defining static folder
app.use(express.static('static'));

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var cCount = 0;

io.on('connection', function(client){
    cCount++;
    console.log('Client connected... ' + cCount);

    client.on('messages', function(data) {
       console.log(data);
       client.emit('messages', {hello: 'Hello Client ' + cCount + '!'});
    });

});

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});
server.listen(8080);
