$(function() {
    var socket = io();
    var user = 'Guest';

    $('form').on('submit', function(e) {
        e.preventDefault();
        var input = $('#m');

        if (input.attr('placeholder') === 'Enter Username') {
            user = input.val();
            socket.emit('new user', input.val());
            input.attr('placeholder', 'Enter message.');
        }
        else {
            socket.emit('chat message', {
                user: user,
                text: input.val()
            });
        }
        input.val('');
        input.focus();
    });

    socket.on('chat message', function(msg) {
        $('#messages').append($('<li>').html(msg));
    });

    socket.on('new user', function(msg) {
        $('#messages').append($('<li>')
                      .css('color', 'red')
                      .html(msg));
    });
});
