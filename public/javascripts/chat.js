$(function() {
    var socket = io();

    $('form').on('submit', function(e) {
        e.preventDefault();
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
    });

    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').html(msg));
    });
});
