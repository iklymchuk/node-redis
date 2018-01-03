const express = require('express');
socketio = require('socket.io'),
redis = require('./util/redis');

var app = express();
var server = app.listen(7000);
var io = socketio(server);

//app.use(express.static('static'));

app.get('/test', (req, res, next) => {
    res.sendFile(__dirname + '/static/rooms-app.html');
})

io.on('connection', (socket) => {
    socket.on('room.join', (room) => {
        console.log(socket.rooms);
        Object.keys(socket.rooms).filter((r) => {
                r != socket.id
            }).forEach((r) => {
                socket.leave(r)
            });

    setTimeout(() => {
        socket.join(room);
        socket.emit('event', 'Joined room ' + room);
        socket.broadcast.to(room).emit('event', 'someone joined room ' + room);
        }, 0);
    });

    socket.on('event', (e) => {
        socket.broadcast.to(e.room).emit('event', e.name + ' say hello');
    });

});
