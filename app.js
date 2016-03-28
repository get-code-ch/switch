/**
 * Created by claude on 04.03.16.
 */

var express = require('express');
var logger = require('./logger');

var app = express();

// defining client folder

app.use(logger);
app.use(express.static('client'));
app.use(express.static('socket.io'));

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

var blks ={
    'Fixed': 'Fastened securely in position' ,
    'Movable': 'Capable of being moved' ,
    'Rotating': 'Moving in a circle around its center'
};

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});

app.get('/blocks', function(req,res) {

    if (req.query.limit >= 0) {
        res.json(blks.slice(0, req.query.limit));
    } else {
        res.json(blks);
    }
});

server.listen(8080);
