const app = require('express');
const http = require('http').createServer(app)
const io = require("socket.io")(http);



io.on('connection', socket => {
  console.log('User connected');

  socket.on('create-game', ({ gameId }) => {
    socket.join(gameId);
  })

  socket.on('join-game', ({ gameId }) => {
    socket.join(gameId);
    let numOfPlayers = io.sockets.adapter.rooms.get(gameId).size;
    if(numOfPlayers === 2) {
      io.in(gameId).emit('player-joined', { gameId })
    }
  })

  socket.on('player-name', ({ playerName, currentRoom, onlinePlayer }) => {
    let onlinePlayerNumber = onlinePlayer
    socket.broadcast.to(currentRoom).emit('finalized-names', { playerName, onlinePlayerNumber });
  })

  socket.on('make-move', ({ newOnlineState }) => {
    console.log(newOnlineState.currentRoom)
    socket.broadcast.to(newOnlineState.currentRoom).emit('made-move', { newOnlineState });
  })
})

http.listen(4000, function() {
  console.log('listening on port 4000')
})
