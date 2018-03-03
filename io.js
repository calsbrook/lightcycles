const io = require('socket.io')();

var users = {}

io.sockets.on('connection', (socket) => {
    console.log(`${new Date().toISOString()} ID ${socket.id} connected.`);
    users[socket.id] = JSON.parse(socket.request._query['user']);
    // console.log(users)
    socket.join('waiting room')
    // console.log(io.sockets.adapter.rooms['waiting room'].sockets)
    // console.log(users[socket.id].email)
    // console.log(Object.keys(io.sockets.adapter.rooms['waiting room'].sockets).length)
    
    socket.on('move', function (data) {
        io.emit('updatePlayer2', data);
        // console.log(data)
    });
    if(getClientsInRoom('waiting room').length > 2) {
        let waitingRoom = getClientsInRoom('waiting room')
        waitingRoom.forEach(function (boy) {
            console.log('hi' + boy)
        })
        console.log(waitingRoom)
        console.log('waiting room = 2')
    }
    socket.on('game-over', function (data) {
        console.log(data)
        // console.log(users)
    })
    socket.on('disconnect', () => {
        delete users[socket.id]
        console.log('disconnected')
        console.log(users)
    })
    // let position = JSON.parse(socket.request._query['location'])
    // console.log(position)
});

function getClientsInRoom(room) {
    var clients = [];
    for (var clientId in io.sockets.adapter.rooms[room].sockets) {
      clients.push(io.sockets.connected[clientId]);
    }
    return clients;
  }

module.exports = io;