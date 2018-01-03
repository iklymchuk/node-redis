const express = require('express'),
process = require('process'),
redis = require('./util/sortedSets.js');

var app = express();

redis.client.flushall();
redis.client.hmset('test:1', ['name', 'login', 'status', 'pass']);
redis.client.hmset('test:2', ['name', 'logout', 'status', 'pass']);
redis.client.hmset('test:3', ['name', 'registration', 'status', 'fail']);

//name is unique
redis.client.set('test:name:login', 'test:1');
redis.client.set('test:name:logout', 'test:2');
redis.client.set('test:name:registration', 'test:3');

app.use((req, res, next) => {
    console.time('request');
    next();
})

app.get('/test/name/:name', (req, res) => {
    var now = Date.now();
    redis.client.zadd('test:last-date', [now, 'test:name:' + req.params.name]);
    //first find the id
    redis.get('test:name:' + req.params.name)
    .then((data) => {
        redis.client.hset(data, 'last-date', now);
        return data;
    })
    .then(redis.hgetall)
    .then((data) => res.send(data));
    console.timeEnd('request');
});

app.get('/test/any', (req, res) => {
    redis.zrevrangebyscore('test:last-date', '+inf', '-inf')
    .then((data) => Promise.all(data.map(redis.get)))
    .then((data) => Promise.all(data.map(redis.hgetall)))
    .then((data) => res.send(data));
    console.timeEnd('request');
});

app.get('/test/latest', (req, res) => {
    var now = Date.now();
    var minuteAgo = now - 60000;
    redis.zrevrangebyscore('test:last-date', now, minuteAgo)
    .then((data) => Promise.all(data.map(redis.get)))
    .then((data) => Promise.all(data.map(redis.hgetall)))
    .then((data) => res.send(data));
    console.timeEnd('request');
});

app.listen(process.argv[2]);