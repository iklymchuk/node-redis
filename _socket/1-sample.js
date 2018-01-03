const express = require('express');
    socketio = require('socket.io');

var app = express();
var server = app.listen(7000);
var io = socketio(server);

//app.use(express.static('static'));

app.get('/test', (req, res, next) => {
    res.sendFile(__dirname + '/static/sample.html');
})

io.on('connection', (socket) => {
    socket.on('socketping', () => {
        console.log('received socketing, sending socketpong');
        socket.emit('socketpong');
    })
})