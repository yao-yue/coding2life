//modules 
let express = require('express'),
    sio = require('socket.io')

// create app
app = express.createServer(
    express.bodyParser(),
    express.static('public')
);

//listen
app.listen(3000);

var io = sio.listen(app);

io.sockets.on('connection', function(socket) {
    console.log('Someone connected');

    socket.on('join', function(name) {
        socket.nickname = name,
        socket.broadcast.emit('announcement', name + 'joined the chat.')
    })

    socket.on('text', function(msg) {
        socket.broadcast.emit('text', socket.nickname, msg);
    })
})
