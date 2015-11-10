var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('request');

var giphy = 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=';

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
        io.emit('new user', userName + ' has joined the chat.');
    });

    socket.on('chat message', function(msg) {
        var output = msg.user + ': ' + msg.text;
        io.emit('chat message', output);
    });

    socket.on('giphy', function(msg) {
        var tags = msg.tags.trim().split(' ');

        requestGiphy(tags)
        .then(function(data) {
            io.emit('giphy', {
                text: msg.text,
                gif: data.data.image_original_url
            });
        })
        .catch(function(error) {
            console.log(error);
        });
    });
});


function requestGiphy(tags) {
    return new Promise(function(resolve, reject) {
        var url = tags.reduce(function(prev, curr) {
            prev += '+' + curr;
            return prev;
        }, giphy);

        request(url, function(err, res, body) {
            if (err) {
                console.log(err);
                reject('Error connecting to Giphy API');
            }
            if (res && res.statusCode === 200) {
                resolve(JSON.parse(body));
            }
            else {
                reject('Something weird happened.');
            }
        });
    });
}
