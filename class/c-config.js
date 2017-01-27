const fs = require('fs');

function CConfig () {
  let self = this;
  fs.watch('switch.conf', function (event, filename) {
    self._configuration = JSON.parse(fs.readFileSync('switch.conf'));
  });

  this._configuration = JSON.parse(fs.readFileSync('switch.conf'));
}

CConfig.prototype.getConfig = function () {
  return this._configuration;
};

CConfig.prototype.updateConfig = function (data) {
  this._configuration = data;
  fs.writeFileSync('switch.conf',JSON.stringify(data));
  return this._configuration;
};

CConfig.prototype.removeGpio = function (id) {
  this._configuration.data.gpios.splice (this._configuration.data.gpios.findIndex(element => element.id === id), 1);

  console.log('Remove GPIO: ' + id);
  this._configuration.data.gpios.sort((a, b) => a.id > b.id);
  fs.writeFileSync('switch.conf', JSON.stringify(this._configuration));
  return this._configuration;
};


CConfig.prototype.insertGpio = function (gpio) {
  let newPin = {};
  newPin.id = gpio.id;
  ("description" in gpio) ? newPin.description = gpio.description : newPin.description = 'N/D';
  ("state" in gpio) ? newPin.state = gpio.state : newPin.state = false;
  this._configuration.data.gpios.push(newPin);
  this._configuration.data.gpios.sort((a, b) => a.id > b.id);
  console.log('Insert GPIO: ' + JSON.stringify(this._configuration.data));
  fs.writeFileSync('switch.conf', JSON.stringify(this._configuration));
  return this._configuration;
};

CConfig.prototype.isNewGpio = function (id) {
  // console.log("CConfig isNewGpio : " + JSON.stringify(this._configuration));
  return (this._configuration.data.gpios.findIndex(element => element.id === id) === -1);
};

module.exports = CConfig;