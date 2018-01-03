const express = require('express');
    socketio = require('socket.io'),
    redis = require('./util/redis');

var app = express();
var server = app.listen(7000);
var io = socketio(server);

//app.use(express.static('static'));

app.get('/test', (req, res, next) => {
    res.sendFile(__dirname + '/static/disconnect.html');
})

var errorEmit = (socket) => {
    return (err) => {
        console.log(err);
        socket.broadcast.emit('user.events', 'something went wrong!');
    };
};

io.on('connection', (socket) => {
    //broadcast
    socket.broadcast.emit('user.events', 'new connection');

    socket.on('url', (url) => {
        redis.storeUser(socket.id, url)
            .then(() => {
                console.log(url + ' was filled. Connection id is: ' + socket.id);
                socket.broadcast.emit('url', url);                
            }, errorEmit(socket));

    });

    socket.on('disconnect', () => {
        redis.getUser(socket.id)
            .then((user) => {
                if(user === null) return 'someone'
                else return user
            })
            .then((user) => {
                console.log(user + ' left');
                socket.broadcast.emit('user.events', user + ' left');
            }, errorEmit(socket))
    });
});