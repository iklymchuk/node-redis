const express = require('express');
socketio = require('socket.io'),
redis = require('./util/redis');

var app = express();
var server = app.listen(7000);
var io = socketio(server);

//app.use(express.static('static'));

app.get('/test', (req, res, next) => {
    res.sendFile(__dirname + '/static/namespaces-app.html');
})

var namespaceHandler = (namespace) => {
    return (socket) => {
        socket.emit('event', 'You joined ' + namespace.name);
        //just resend it
        socket.on('event', (data) => {
            socket.broadcast.emit('event', data);
        });
    };
}

var one = io.of('/namespace1');
var two = io.of('/namespace2');

one.on('connection', namespaceHandler(one));
two.on('connection', namespaceHandler(two));
