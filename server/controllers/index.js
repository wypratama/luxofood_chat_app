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

  static async userSignIn(message, socket) {
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
      socket.broadcast.emit('alert', { msg: 'signed in', user: message.user });
    } catch (err) {
      console.log(err);
    }
  }

  static async joinRoom({ room, user }, socket, io) {
    try {
      const trimmedRoom = await room.trim().toLowerCase();
      const rooms = await JSON.parse(
        fs.readFileSync('./server/fakedata/rooms.json', 'utf-8')
      );
      const findRoom = await rooms.find((el) => el.name === room);
      console.log(findRoom);
      const roomWithUser = { ...findRoom, users: [...findRoom.users, user] };
      const newRoom = await rooms.map((el) =>
        el.name === findRoom.name ? roomWithUser : el
      );
      await fs.writeFileSync(
        './server/fakedata/rooms.json',
        JSON.stringify(newRoom)
      );
      await socket.join(trimmedRoom);
      socket.broadcast.emit('triggerReload');
      io.to(trimmedRoom).emit('message', {
        msg: `${user.name} joined the room`,
        user: { name: 'admin' },
      });
      socket.broadcast.emit('alert', {
        msg: `joined room ${room}`,
        user: user,
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async sendChat({ msg, user, room }, io, socket) {
    const trimmedRoom = room.trim().toLowerCase();
    io.to(trimmedRoom).emit('message', { msg, user });
  }

  static async addRoom(req, res) {
    try {
      const rooms = await JSON.parse(
        fs.readFileSync('./server/fakedata/rooms.json', 'utf-8')
      );
      const checkName = await rooms.find(
        (el) => el.name.toLowerCase() === req.body.name.toLowerCase()
      );
      if (checkName) {
        res.status(400).send({ error: 'name already exist' });
      } else {
        const newRoomList = [...rooms, req.body];
        await fs.writeFileSync(
          './server/fakedata/rooms.json',
          JSON.stringify(newRoomList)
        );
        res.status(400).send({ rooms: newRoomList });
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async leaveRoom({ user, room }, callback, io, socket) {
    try {
      const rooms = await JSON.parse(
        fs.readFileSync('./server/fakedata/rooms.json', 'utf-8')
      );
      const findRoom = await rooms.find((el) => el.name === room);
      const removeUser = await findRoom.users.filter(
        (el) => el.email !== user.email
      );
      const roomWithRemovedUser = { ...findRoom, users: removeUser };
      const newRoom = await rooms.map((el) =>
        el.name === findRoom.name ? roomWithRemovedUser : el
      );
      await fs.writeFileSync(
        './server/fakedata/rooms.json',
        JSON.stringify(newRoom)
      );
      const trimmedRoom = room.trim().toLowerCase();
      socket.leave(trimmedRoom);
      socket.broadcast.emit('triggerReload');
      io.to(trimmedRoom).emit('message', {
        msg: `${user.name} leave the room`,
        user: { name: 'admin' },
      });
      callback();
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteRoom({ room, user }, io, socket) {
    try {
      const rooms = await JSON.parse(
        fs.readFileSync('./server/fakedata/rooms.json', 'utf-8')
      );
      const filteredRooms = await rooms.filter((el) => el.name !== room);
      await fs.writeFileSync(
        './server/fakedata/rooms.json',
        JSON.stringify(filteredRooms)
      );
      socket.broadcast.emit('triggerReload');
      socket.broadcast.emit('alert', {
        msg: `deleted room ${room}`,
        user: user,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Controller;
