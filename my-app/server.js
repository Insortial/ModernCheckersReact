const express = require('express');
const favicon = require('express-favicon');
const http = require('http');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = module.exports.io = require('socket.io')(server)
app.use(favicon(__dirname + '/build/favicon.ico'));

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(port);

//Socket.io code
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
