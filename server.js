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

  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  setServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});