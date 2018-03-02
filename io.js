const io = require('socket.io')();

var users = {}

io.sockets.on('connection', (socket) => {
    console.log(`${new Date().toISOString()} ID ${socket.id} connected.`);
    users[socket.id] = JSON.parse(socket.request._query['user']);
    // console.log(users)
    socket.join('waiting room')
    console.log(Object.keys(io.sockets.adapter.rooms['waiting room'].sockets).length)
    
    socket.on('move', function (data) {
        io.emit('move', data);
        // console.log(data)
    });
    socket.on('game-over', function (data) {
        console.log(data)
        // console.log(users)
    })
    socket.on('disconnect', () => {
        delete users[socket.id]
        console.log('disconnected')
    })
    // let position = JSON.parse(socket.request._query['location'])
    // console.log(position)
});


module.exports = io;