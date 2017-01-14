let fs = require('fs');

function CConfig () {
  this._configuration = JSON.parse(fs.readFileSync('switch.conf'));
  // console.log("CConfig constructor : " + JSON.stringify(this._configuration));
};


CConfig.prototype.getConfig = function () {
  return this._configuration;
};

CConfig.prototype.updateConfig = function (data) {
  this._configuration = data;
  fs.writeFileSync('switch.conf',JSON.stringify(data));
  return this._configuration;
};

CConfig.prototype.insertGpio = function (gpio) {
  let newPin = {};
  newPin.id = gpio.id;
  ("description" in gpio) ? newPin.description = gpio.description : newPin.description = 'N/D';
  ("state" in gpio) ? newPin.state = gpio.state : newPin.state = false;
  this._configuration.data.gpios.push(newPin);
  console.log('Insert GPIO: ' + JSON.stringify(this._configuration.data));
  fs.writeFileSync('switch.conf', JSON.stringify(this._configuration));
  return this._configuration;
};

CConfig.prototype.isNewGpio = function (id) {
  // console.log("CConfig isNewGpio : " + JSON.stringify(this._configuration));
  return (this._configuration.data.gpios.findIndex(element => element.id === id) === -1);
};

module.exports = CConfig;