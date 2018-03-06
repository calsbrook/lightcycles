const io = require('socket.io')();

var users = {}
var gameID = 1

class Game {
    constructor( ID, player1, player2) {
        this.id = ID;
        this.player1 = {
            id: player1,
            win: false
        }
        this.player2 = {
            id: player2,
            win: false
        }
    }
}

io.sockets.on('connection', (socket) => {
    console.log(`SOCKET ID: ${socket.id} connected.`);
    users[socket.id] = JSON.parse(socket.request._query['user']);
    console.log(users)
    socket.join('waiting room')
    // console.log('users vvv')
    // console.log(users)
    // console.log(io.sockets.adapter.rooms['waiting room'].sockets)
    // console.log(users[socket.id].email)
    // console.log(Object.keys(io.sockets.adapter.rooms['waiting room'].sockets).length)
    
    
    socket.on('move', function (data) {
        let game = users[socket.id].currentGame
        if (game) {
            socket.to(`game room ${game.id}`).emit('updatePlayer2', data);
        }
        // console.log(data)
    });

    socket.on('game over', function (data) {
        let game = users[socket.id].currentGame
        if (game) {
            socket.to(`game room ${game.id}`).emit('winner', data)
            console.log(`game over received on ${socket.id}`)
        }
        // console.log(data)
        // console.log(users)
    })
    socket.on('winner', function (data) {
        console.log(`winner received on ${socket.id}`)
    })
    socket.on('disconnect', () => {
        delete users[socket.id]
        console.log(`${socket.id} disconnected`)
    })
    // let position = JSON.parse(socket.request._query['location'])
    // console.log(position)

    migratePlayers()
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
    console.log('NUMBER OF PLAYERS IN WAITING ROOM: ' + players.length)
    if (players.length >= 2) {
        var game = new Game(gameID++, users[players[0].id], users[players[0].id])
        players[0].leave('waiting room')
        players[1].leave('waiting room')
        players[0].join(`game room ${game.id}`)
        players[1].join(`game room ${game.id}`)
        io.to(`game ${game}`).emit('join')
        users[players[0].id].currentGame = game
        users[players[1].id].currentGame = game
        users.save
        console.log(`${JSON.stringify(users[players[0].id].name)} and ${JSON.stringify(users[players[1].id].name)} have joined game ID ${game.id}`)
    }
}

module.exports = io;