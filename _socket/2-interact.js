const express = require('express');
socketio = require('socket.io');

var app = express();
var server = app.listen(7000);
var io = socketio(server);

//app.use(express.static('static'));

app.get('/test', (req, res, next) => {
res.sendFile(__dirname + '/static/interact.html');
})

io.on('connection', (socket) => {
socket.on('url', (url) => {
    console.log(url + ' was filled');
    socket.emit('url', url);
})
})