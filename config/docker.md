#start redis server
docker run --name node-redis -p 16379:6379 -d redis:3.2.4

#stop or restart redis server
docker stop node-redis
docker start node-redis

#remove redis
docker rm node-redis

#connect redis-cli
docker run -it --link node-redis:redis --rm redis redis-cli -h redis -p 6379

docker run -it --rm redis redis-cli --help