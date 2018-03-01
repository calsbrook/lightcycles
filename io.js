const io = require('socket.io')();

var users = {}

io.sockets.on('connection', (socket) => {
    socket.broadcast.emit('broadcast', 'hello friends!');
    console.log(`${new Date().toISOString()} ID ${socket.id} connected.`);
    users[socket.id] = JSON.parse(socket.request._query['user']);
    // console.log(users)
    socket.join('waiting room')
    socket.on('disconnect', () => {
        console.log('disconnected')
    })
    // let position = JSON.parse(socket.request._query['location'])
    // console.log(position)
});


module.exports = io;