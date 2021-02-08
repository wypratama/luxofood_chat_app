const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const setServer = require('http').Server(server);
  const io = require('socket.io')(setServer);
  const router = require('./server/routes');
  const Controller = require('./server/controllers');

  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());

  io.on('connection', (socket) => {
    // console.log('socket', socket);

    socket.on('signIn', (data) => {
      Controller.userSignIn(data, socket);
    });
    socket.on('join', (data) => {
      Controller.joinRoom(data, socket, io);
    });
    socket.on('chatMessage', ({ msg, user, room }) => {
      const trimmedRoom = room.trim().toLowerCase();
      io.to(trimmedRoom).emit('message', { msg, user });
    });

    socket.on('disconnectRoom', ({ user, room }, callback) => {
      Controller.leaveRoom({ user, room }, callback, io, socket);
    });

    socket.on('reload', (callback) => {
      if (callback) {
        callback();
      }
      socket.broadcast.emit('triggerReload');
    });

    socket.on('justAdd', ({ room, user }) => {
      socket.broadcast.emit('alert', {
        msg: `added room ${room}`,
        user: user,
      });
    });

    socket.on('deleteRoom', ({ room, user }) => {
      Controller.deleteRoom({ room, user }, io, socket);
    });

    socket.emit('now', {
      message: 'zeit',
    });
  });

  server.use('/api', router);

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  setServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
