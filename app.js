var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index');
});

server.listen(3000, function() {
    console.log('listening on localhost:3000');
});

io.on('connection', function(socket) {
    socket.on('new user', function(userName) {
        console.log(userName);
        io.emit('new user', userName + ' has joined the chat.');
    });

    socket.on('chat message', function(msg) {
        var output = msg.user + ': ' + msg.text;
        io.emit('chat message', output);
    });
});
