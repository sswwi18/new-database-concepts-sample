const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const redis = require('redis');

// Create new redis database client -> if you need other connection options, please specify here
const redisClient = redis.createClient();

app.get('/', (req, res) => {
    res.send('It works!');
});

io.on('connection', socket => {
    console.log('a user connected');

    // After initial connection, send all existing posts to the user
    redisClient.lrange('wwi-tweety-posts', 0, -1, (err, postJsonStrings) => {
        if (err) {
            console.error(err);
            return;
        }

        // Parse all JSON strings, emit to client
        const objects = postJsonStrings.map(string => JSON.parse(string));
        socket.emit('previous posts', JSON.stringify(objects));
    });

    socket.on('post', postAsJson => {
        const post = JSON.parse(postAsJson);
        console.log('posting: ' + post);

        // Save post in redis
        redisClient.rpush('wwi-tweety-posts', JSON.stringify(post));
        

        // Send Post to everyone
        io.emit('post', JSON.stringify(post));
    });

    socket.on('like', postAsJson => {
        const post = JSON.parse(postAsJson);
        console.log(post);
        
        redisClient.lrange('wwi-tweety-posts', 0, -1, (err, postJsonStrings) => {
            if (err) {
                console.error(err);
                return;
            }
            const objects = postJsonStrings.map(string => JSON.parse(string));
            console.log(objects);
            console.log(post.id);
            
            for (var i = 0; i<objects.length; i++){
                if (objects[i].id == post.id){
                    redisClient.lset('wwi-tweety-posts', i, JSON.stringify(post) )
                    var position=i
                }
            }

        // Send Post to everyone
       io.emit('like', JSON.stringify(post), position);
    })
    });

    socket.on('dislike', postAsJson => {
        console.log('dislike');
        const post = JSON.parse(postAsJson);
        console.log(post);

        redisClient.lrange('wwi-tweety-posts', 0, -1, (err, postJsonStrings) => {
            if (err) {
                console.error(err);
                return;
            }
            const objects = postJsonStrings.map(string => JSON.parse(string));
            console.log(objects);
            console.log(post.id);
            
            for (var i = 0; i<objects.length; i++){
                if (objects[i].id == post.id){
                    redisClient.lset('wwi-tweety-posts', i, JSON.stringify(post) )
                    var position=i
                }
            }

        // Send Post to everyone
       io.emit('dislike', JSON.stringify(post), position);
    })
    });



    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
