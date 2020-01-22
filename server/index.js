const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.send('It works!');
});

io.on('connection', socket => {
    console.log('a user connected');

    socket.on('post', postAsJson => {
        const post = JSON.parse(postAsJson);
        console.log(post);

        // Send Post to everyone
        io.emit('post', JSON.stringify(post));
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
