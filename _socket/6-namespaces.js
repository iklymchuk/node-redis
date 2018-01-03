const express = require('express');
socketio = require('socket.io'),
redis = require('./util/redis');

var app = express();
var server = app.listen(7000);
var io = socketio(server);

//app.use(express.static('static'));

app.get('/test', (req, res, next) => {
    res.sendFile(__dirname + '/static/namespaces.html');
})

var namespace = io.of('/namespace');

namespace.on('connection', (socket) => {
    namespace.emit('event', 'connected to namespace');
    //this is a different namespace
    io.emit('event', 'normal');
})