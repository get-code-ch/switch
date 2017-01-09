var fs = require('fs');

var CConfig = function() {
  var content = fs.readFileSync('switch.conf');
  console.log('content : ' + content);
  this.data = JSON.parse(content);
  console.log(this.data);
}


CConfig.prototype.getConfig = function() {
  //fs.open('switch.conf');
  return this.data;
}

CConfig.prototype.updateConfig = function(data) {
  this.data = data;
  fs.writeFileSync('switch.conf', '{ "data":' + JSON.stringify(data) + '}');
  return this.data;
}

module.exports = CConfig;