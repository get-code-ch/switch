var fs = require('fs');

var SwitchConfig = function() {
  var content = fs.readFileSync('switch.conf');
  console.log('content : ' + content);
  this.data = JSON.parse(content);
  console.log(this.data);
}


SwitchConfig.prototype.getConfig = function() {
  //fs.open('switch.conf');
  return this.data;
}

module.exports = SwitchConfig;