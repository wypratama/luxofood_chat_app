const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');

const port = parseInt(process.env.PORT, 10) || 3000;
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

    socket.on('signIn', Controller.userSignIn);
    socket.on('join', (data) => {
      Controller.joinRoom(data, socket);
    });
    socket.on('chatMessage', (data) => {
      Controller.sendChat(data, io, socket);
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
