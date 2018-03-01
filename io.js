const io = require('socket.io')();

io.on('connection', (socket) => {
    console.log('C O N N E C T I O N');
  socket.on('subscribeToTimer', (interval) => {
    console.log('socket is subscribing to timer with interval ', interval);
    setInterval(() => {
      socket.emit('timer', new Date());
    }, interval);
  });
});

console.log('socket listening on the same port');
module.exports = io;