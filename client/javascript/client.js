var socket = io.connect('http://localhost:8080');

$(document).ready(function(){
    $('.block-list').clear;
    $.get('/blocks', appendToList);
});

function appendToList(blocks){
    var list = [];
    for(var i in  blocks){
        list.push($('<li>', { text: blocks[i]}));
    }
    $('.block-list').append(list);
}



socket.emit('messages', 'Hello Server!');

socket.on('connect', function (data) {
    var nickname = prompt('What\'s your name?');
    $('#hello').text(nickname);
    socket.emit('messages', 'Client nickname ' + nickname);
});
