/**
 * Created by claude on 04.03.16.
 */
const os = require('os');
let rpio = require('rpio');

let express = require('express');
let app = express();
app.use(express.static('./'));
//app.use(express.static('socket.io'));

let logger = require('./logger');
app.use(logger);

let cors = require('cors');
app.use(cors());

let CConfig = require('./class/c-config');
let confInstance = new CConfig();
let configuration = confInstance.getConfig().data;



let server = require('http').createServer(app);
let io = require('socket.io')(server);
let gpioArray = [];

configuration.gpios.filter(element => {
  rpio.open(element.id, rpio.OUTPUT);
  rpio.write(element.id, element.state ? 1 : 0);
});

function broadcastStatus(socket, data) {
  data = {server: os.hostname(), gpio: Number(data.gpio), state: rpio.read(data.gpio) === 1, description: data.description};

  socket.broadcast.emit('gpiostatus', data);
  socket.emit('gpiostatus', data);
}

io.on('connection', function (socket) {
  console.log('Client connected... ');

  socket.on('set', function (data) {
    //console.log(data);

    let i = configuration.gpios.findIndex(element => element.id === data.gpio);
    if (i === -1) {
      rpio.open(data.gpio, rpio.OUTPUT);
      let newpin = {};
      newpin.id = data.gpio;
      ("description" in data) ? newpin.description = data.description : newpin.description = 'N/D';
      ("state" in data) ? newpin.state = data.state : newpin.state = false;
      configuration.gpios.push(newpin);
      confObject.updateConfig(configuration);
    }

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
        (data.value == 1 || data.value.toUpperCase() == 'ON') ? rpio.write(data.gpio, rpio.HIGH) : rpio.write(data.gpio, rpio.LOW);
        break;
      default:
        break;
    }
    broadcastStatus(socket, data);
  });

  socket.on('get', function (data) {
    //console.log(data);

    let i = configuration.gpios.findIndex(element => element.id === data.gpio);
    if (i === -1) {
      rpio.open(data.gpio, rpio.OUTPUT);
      let newpin = {};
      newpin.id = data.gpio;
      ("description" in data) ? newpin.description = data.description : newpin.description = 'N/D';
      ("state" in data) ? newpin.state = data.state : newpin.state = false;
      configuration.gpios.push(newpin);
      confObject.updateConfig(configuration);
    }

    switch (data.cmd.toUpperCase()) {
      case 'STATE':
        broadcastStatus(socket, data);
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
