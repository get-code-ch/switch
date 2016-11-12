/**
 * Created by claude on 04.03.16.
 */
const os = require('os');
var rpio = require('rpio');

var express = require('express');
var logger = require('./logger');

var app = express();

// defining client folder
app.use(logger);
app.use(express.static('client'));
app.use(express.static('socket.io'));

var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('Client connected... ');

    socket.on('gpiostatus', function (data) {
        rpio.open(data.gpio, rpio.OUTPUT, rpio.LOW);
        socket.emit('gpiostatus', {servername: os.hostname(), gpio: data.gpio, state: rpio.read(data.gpio)});
    });


    socket.on('off', function (data) {
        rpio.open(data.gpio, rpio.OUTPUT, rpio.LOW);
        rpio.write(data.gpio, rpio.LOW);
        socket.broadcast.emit('gpiostatus', {servername: os.hostname(), gpio: data.gpio, state: rpio.read(data.gpio)});
        socket.emit('gpiostatus', {servername: os.hostname(), gpio: data.gpio, state: rpio.read(data.gpio)});
    });

    socket.on('on', function (data) {
        rpio.open(data.gpio, rpio.OUTPUT, rpio.LOW);
        rpio.write(data.gpio, rpio.HIGH);
        socket.broadcast.emit('gpiostatus', {servername: os.hostname(), gpio: data.gpio, state: rpio.read(data.gpio)});
        socket.emit('gpiostatus', {servername: os.hostname(), gpio: data.gpio, state: rpio.read(data.gpio)});
    });

});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

server.listen(8080);
