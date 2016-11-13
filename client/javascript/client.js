var socket = io.connect('http://' + window.location.hostname + ':8080');

$(document).ready(function(){
});

socket.on('connect', function (data) {
    //socket.emit('gpiostatus', {gpio: 16})
});

socket.on('gpiostatus', function (data) {
    console.log('gpiostatus :' + JSON.stringify(data));
    $('#servername').text(data.servername);
    $('#gpio').text(data.gpio);
    $('#state').text(data.state);
});

function circle_click(evt, state) {
    var lst = document.getElementById('gpioIn');
    var gpioIn = lst.options[lst.selectedIndex].text;
    console.log(gpioIn);
    state ? socket.emit('on', {gpio: gpioIn}) : socket.emit('off', {gpio: gpioIn});
}

function gpioIn_change() {
    var lst = document.getElementById('gpioIn');
    var gpioIn = lst.options[lst.selectedIndex].text;
    console.log(gpioIn);
    //socket.emit('gpiostatus', {gpio: gpioIn});
}