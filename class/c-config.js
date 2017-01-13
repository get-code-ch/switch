let fs = require('fs');

let CConfig = function () {
  this._configuration = JSON.parse(fs.readFileSync('switch.conf'));
  console.log(this._configuration);
};


CConfig.prototype.getConfig = function () {
  return this._configuration;
};

CConfig.prototype.updateConfig = function (data) {
  this._configuration = data;
  fs.writeFileSync('switch.conf', '{ "data":' + JSON.stringify(data) + '}');
  return this._configuration;
};

CConfig.prototype.insertGpio = function (gpio) {
  let newPin = {};
  newPin.id = gpio.id;
  ("description" in gpio) ? newPin.description = gpio.description : newPin.description = 'N/D';
  ("state" in gpio) ? newPin.state = gpio.state : newPin.state = false;
  this._configuration.gpios.push(newPin);
  fs.writeFileSync('switch.conf', '{ "data":' + JSON.stringify(this._configuration) + '}');
  return this._configuration;
};

CConfig.prototype.isNewGpio = function (id) {
  return (this._configuration.gpios.findIndex(element => element.id === id) === -1);
};

module.exports = CConfig;