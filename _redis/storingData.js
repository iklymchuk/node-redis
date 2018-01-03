const express = require('express'),
    process = require('process'),
    redis = require('./util/sortedData');

    var app = express();

    redis.client.flushall();
    redis.client.hmset('test:1', ['name', 'login', 'status', 'pass']);
    redis.client.hmset('test:2', ['name', 'logout', 'status', 'pass']);
    redis.client.hmset('test:3', ['name', 'registration', 'status', 'fail']);

    //name is unique
    redis.client.set('test:name:login', 'test:1');
    redis.client.set('test:name:logout', 'test:2');
    redis.client.set('test:name:registration', 'test:3');

    //status isn't unique
    redis.client.lpush('test:status:pass', ['test:1', 'test:2']);
    redis.client.lpush('test:status:fail', 'test:3');

    app.use((req, res, next) => {
        console.time('request');
        next();
    })
    
    app.get('/test/name/:name', (req, res) => {
        //first find the id
        redis.get('test:name:' + req.params.name)
        .then(redis.hgetall)
        .then((data) => res.send(data));
        console.timeEnd('request');
    });

    app.get('/test/status/:status', (req, res) => {
        redis.lrange('test:status:' + req.params.status)
        .then((data) => Promise.all(data.map(redis.hgetall)))
        .then((data) => res.send(data));
        console.timeEnd('request');
    })

    app.listen(process.argv[2]);