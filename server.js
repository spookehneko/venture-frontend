const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('Neuer Benutzer verbunden');
    socket.on('setUsername', (username) => {
        socket.username = username;
        socket.emit('message', `Welcome to Venture, ${username}!`);
        socket.broadcast.emit('message', `${username}was joined`);
    });
    socket.on('chatMessage', (msg) => {
        io.emit('message', `${socket.username}: ${msg}`);
    });
    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('message', `${socket.username} hat den Chat verlassen`);
        }
    });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
