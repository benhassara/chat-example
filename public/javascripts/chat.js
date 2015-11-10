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
            $('#users').append($('<li>').html(input.val()));
        }
        else if (input.val().trim().substr(0, 6) === '/giphy') {
            var tags = input.val().substr(6).trim();
            socket.emit('giphy', {
                text: input.val(),
                tags: tags
            });
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
        scrollDown();
    });

    socket.on('new user', function(msg) {
        $('#messages').append($('<li>')
                      .css('color', 'red')
                      .html(msg));
        scrollDown();
    });

    socket.on('giphy', function(msg) {
        $('#messages').append($('<li>').html(user + ': ' + msg.text))
        .append($('<li>').html(user + ': ')
        .append($('<ul class="unstyled">')
        .html('<li><img class="giphy-gif" src="' + msg.gif + '" /></li>')));
        scrollDown();
    });
});

function scrollDown() {
    $('html, body').animate({scrollTop: $(document).height()}, 'slow');
}
