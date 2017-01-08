/**
 * Created by claude on 04.03.16.
 */
const os = require('os');
var rpio = require('rpio');

var express = require('express');
var logger = require('./logger');

var SwitchConfig = require('./switch-config');
var confObject = new SwitchConfig();
var conf = confObject.getConfig().data;

var app = express();

// defining client folder
app.use(logger);
app.use(express.static('client'));
app.use(express.static('socket.io'));

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var gpioArray = [];

for (var i=0; i < conf.gpios.length; i++) {
  rpio.open(conf.gpios[i].id, rpio.OUTPUT);
  rpio.write(conf.gpios[i].id, conf.gpios[i].state ? 1 : 0);
}

function broadcastStatus(socket, gpio) {
  data = {server: os.hostname(), gpio: Number(gpio), state: rpio.read(gpio) === 1 };

  socket.broadcast.emit('gpiostatus', data);
  socket.emit('gpiostatus', data);
}

io.on('connection', function (socket) {
  console.log('Client connected... ');

  socket.on('set', function (data) {
    //console.log(data);

    let i = conf.gpios.findIndex(element => element.id === data.gpio);
    console.log("i set: " + i);


    switch (data.cmd.toUpperCase()) {
      case 'TIMER':
        if (data.value > 0) {
          clearInterval(gpioArray[data.gpio]);
          gpioArray[data.gpio] = gpioArray[data.gpio] = setInterval(function () {
            rpio.write(data.gpio, (rpio.read(data.gpio) - 1) * -1);
            broadcastStatus(socket, data.gpio);
          }, 1000 * data.value);
        } else {
          clearInterval(gpioArray[data.gpio]);
        }
        break;
      case 'STATE':
        (data.value == 1 || data.value.toUpperCase() == 'ON')  ? rpio.write(data.gpio, rpio.HIGH) : rpio.write(data.gpio, rpio.LOW);
        break;
      default:
        break;
    }
    broadcastStatus(socket, data.gpio);
  });

  socket.on('get', function (data) {
    //console.log(data);

    let i = conf.gpios.findIndex(element => element.id === data.gpio);
    if (i === -1) {
      rpio.open(data.gpio, rpio.OUTPUT);
    }

    switch (data.cmd.toUpperCase()) {
      case 'STATE':
        broadcastStatus(socket, data.gpio);
        break;
      default:
        break;
    }
  });
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

server.listen(8080);
