const express = require('express');
socketio = require('socket.io'),
redis = require('./util/redis');

var app = express();
var server = app.listen(7000);
var io = socketio(server);

//app.use(express.static('static'));

app.get('/test', (req, res, next) => {
res.sendFile(__dirname + '/static/rooms.html');
})

io.on('connection', (socket) => {
    var now = Date.now();
    console.log(now);
    if ((now % 2) == 0) {
        socket.join('even');
    } else {
        socket.join('odd');
    }

    io.to('even').emit('event', "Even room " + now);
    io.to('odd').emit('event', "Odd room " + now);
    setTimeout(() => {
        io.to('even').emit('event', "Even room " + now);
        io.to('odd').emit('event', "Odd room " + now);
    }, 5000)

})