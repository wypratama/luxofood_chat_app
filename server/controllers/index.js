let rooms = [
  { name: 'Santai', users: [] },
  { name: 'Kerja', users: [] },
  { name: 'Bantu saya', users: [] },
];
let users = [];

class Controller {
  static async getRooms(req, res) {
    try {
      res.status(200).send({ rooms });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  static async userSignIn(message, socket) {
    try {
      const user = await users.filter(
        (user) => user.email === message.user.email
      );
      if (!user[0]) {
        users = [...users, message.user];
      }
      socket.broadcast.emit('alert', { msg: 'signed in', user: message.user });
    } catch (err) {
      console.log(err);
    }
  }

  static async joinRoom({ room, user }, socket, io) {
    try {
      const trimmedRoom = await room.trim().toLowerCase();
      const findRoom = await rooms.find((el) => el.name === room);
      const roomWithUser = { ...findRoom, users: [...findRoom.users, user] };
      const newRoom = await rooms.map((el) =>
        el.name === findRoom.name ? roomWithUser : el
      );
      rooms = newRoom;
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
      const checkName = await rooms.find(
        (el) => el.name.toLowerCase() === req.body.name.toLowerCase()
      );
      if (checkName) {
        res.status(400).send({ error: 'name already exist' });
      } else {
        const newRoomList = [...rooms, req.body];
        rooms = newRoomList;
        res.status(400).send({ rooms: newRoomList });
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async leaveRoom({ user, room }, callback, io, socket) {
    try {
      const findRoom = await rooms.find((el) => el.name === room);
      const removeUser = await findRoom.users.filter(
        (el) => el.email !== user.email
      );
      const roomWithRemovedUser = { ...findRoom, users: removeUser };
      const newRoom = await rooms.map((el) =>
        el.name === findRoom.name ? roomWithRemovedUser : el
      );
      rooms = newRoom;
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
      const filteredRooms = await rooms.filter((el) => el.name !== room);
      rooms = filteredRooms;
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
