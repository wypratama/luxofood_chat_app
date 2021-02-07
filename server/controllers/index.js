// const roomData = require('../fakedata/rooms.json');
const fs = require('fs');

class Controller {
  static async getRooms(req, res) {
    try {
      const rooms = await JSON.parse(
        fs.readFileSync('./server/fakedata/rooms.json', 'utf-8')
      );
      res.status(200).send({ rooms });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  static async userSignIn(message) {
    try {
      const users = await JSON.parse(
        fs.readFileSync('./server/fakedata/users.json', 'utf-8')
      );
      const user = await users.filter(
        (user) => user.email === message.user.email
      );
      if (!user[0]) {
        const newUserList = [...users, message.user];
        await fs.writeFileSync(
          './server/fakedata/users.json',
          JSON.stringify(newUserList)
        );
        console.log(newUserList);
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async joinRoom({ room, user }, socket) {
    const trimmedRoom = room.trim().toLowerCase();
    socket.join(trimmedRoom);
    console.log(room, socket, user, 'dari joinRoom menunjukkan socket');
  }

  static async sendChat({ msg, user, room }, io, socket) {
    console.log(socket, 'ini socket');
    const trimmedRoom = room.trim().toLowerCase();
    console.log({ msg, user, room }, 'message sampai server');
    io.to(trimmedRoom).emit('message', { msg, user });
  }
}

module.exports = Controller;
