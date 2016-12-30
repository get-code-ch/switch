var socket = io.connect('http://' + window.location.hostname + ':8080');

$(document).ready(function(){
});

socket.on('connect', function (data) {
  socket.emit('get', {gpio: 12, cmd: 'state'});
  socket.emit('get', {gpio: 16, cmd: 'state'});
});

socket.on('gpiostatus', function (data) {
    console.log('gpiostatus :' + JSON.stringify(data));
    $('#servername').text(data.servername);
    $('#gpio').text(data.gpio);
    $('#state').text(data.state);
});

function state_change_click(evt, state) {
    var lst = document.getElementById('gpioIn');
    var gpioIn = lst.options[lst.selectedIndex].text;
    console.log(gpioIn);
    state ? socket.emit('send', {gpio: gpioIn, 'cmd': 'state', value: 'ON'}) : socket.emit('send', {gpio: gpioIn, 'cmd': 'state', value: 'OFF'});
}

function gpioIn_change() {
    var lst = document.getElementById('gpioIn');
    var gpioIn = lst.options[lst.selectedIndex].text;
    socket.emit('get', {gpio: gpioIn, cmd: 'state'});
}

function timer_save_click() {
    var interval = document.getElementById('interval');
    var lst = document.getElementById('gpioIn');
    var gpioIn = lst.options[lst.selectedIndex].text;
    socket.emit('send', {gpio: gpioIn, cmd: 'timer', value: interval.value});
}