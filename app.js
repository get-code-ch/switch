// Raspberry GPIO Access
let rpio = require('rpio');

// Express configuration
let express = require('express');
let app = express();
app.use(express.static('./'));

// Log connection to the server
let logger = require('./logger');
app.use(logger);

// To allow cross origin access - if client app hosted in other server
let cors = require('cors');
app.use(cors());

// Switch configuration Class to serve GPIO configuration
let CConfig = require('./class/c-config');
let confInstance = new CConfig();
let configuration = confInstance.getConfig().data;

// HTTP Server creation and Websocket Server
let server = require('http').createServer(app);
let socketServer = require('socket.io')(server);
let gpioArray = [];

// Init access to configured GPIO
configuration.gpios.filter(element => {
  rpio.open(element.id, rpio.OUTPUT);
  rpio.write(element.id, element.state ? 1 : 0);
});

/**
 * broadcastStatus
 * @param socket
 * @param gpio
 *
 * @description Broadcast Status to all connected clients
 */
function broadcastStatus(socket, gpio) {
  status = {server: configuration.server, id: Number(gpio.id), state: rpio.read(gpio.id) === 1, description: gpio.description};

  socket.broadcast.emit('gpiostatus', status);
  socket.emit('gpiostatus', status);
}

function broadcastConfiguration(socket) {
  socket.broadcast.emit('configuration', configuration);
  socket.emit('configuration', configuration);
}

socketServer.on('connection', function (socket) {
  console.log('Client connected... ');

  socket.on('set', function (gpio) {
    if (confInstance.isNewGpio(gpio.id)) {
      rpio.open(gpio.id, rpio.OUTPUT);
      configuration = confInstance.insertGpio(gpio);
      broadcastConfiguration(socket);
    }

    switch (gpio.cmd.toUpperCase()) {
      case 'TIMER':
        if (gpio.value > 0) {
          clearInterval(gpioArray[gpio.id]);
          gpioArray[gpio.id] = gpioArray[gpio.id] = setInterval(function () {
            rpio.write(gpio.id, (rpio.read(gpio.id) - 1) * -1);
            broadcastStatus(socket, gpio.id);
          }, 1000 * gpio.value);
        } else {
          clearInterval(gpioArray[gpio.id]);
        }
        break;
      case 'STATE':
        (gpio.value == 1 ||
         gpio.value == true ||
         gpio.value.toUpperCase() == 'ON') ? rpio.write(gpio.id, rpio.HIGH) : rpio.write(gpio.id, rpio.LOW);
        break;
      case 'REMOVE':
        configuration = confInstance.removeGpio(gpio.id);
        broadcastConfiguration(socket);
        break;
      default:
        break;
    }
    broadcastStatus(socket, gpio);
  });

  socket.on('get', function (gpio) {

    if (confInstance.isNewGpio(gpio.id)) {
      rpio.open(gpio.id, rpio.OUTPUT);
      configuration = confInstance.insertGpio(gpio);
      broadcastConfiguration(socket);
    }

    switch (gpio.cmd.toUpperCase()) {
      case 'STATE':
        broadcastStatus(socket, gpio);
        break;
      case 'CONFIGURATION':
        broadcastConfiguration(socket);
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
