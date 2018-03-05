const io = require('socket.io')();

var users = {}
var gameID = 1

io.sockets.on('connection', (socket) => {
    console.log(`${new Date().toISOString()} SOCKET ID: ${socket.id} connected.`);
    users[socket.id] = JSON.parse(socket.request._query['user']);
    // console.log(users)
    socket.join('waiting room')
    // migratePlayers();
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
        console.log(`waiting room = ${waitingRoom.length}`)
    }
    socket.on('game-over', function (data) {
        console.log(data)
        // console.log(users)
    })
    socket.on('disconnect', () => {
        delete users[socket.id]
        console.log(`${socket.id} disconnected`)
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

function migratePlayers() {
    let players = getClientsInRoom('waiting room')
    if (players.length >= 2) {
        let game = {id: gameID}
        players[0].leave('waiting room')
        players[1].leave('waiting room')
        players[0].join(`game ${game}`)
        players[1].join(`game ${game}`)
        io.to(`game ${game}`).emit('join')
        console.log(getClientsInRoom(`game ${game}`).length)

    }
}

module.exports = io;