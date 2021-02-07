import io from 'socket.io-client';
import { useRouter } from 'next/router';

export default function RoomCard({ el, user }) {
  const router = useRouter();
  const socket = io({
    autoConnect: false,
  });
  const joinRoom = () => {
    socket.connect();
    socket.emit('join', { room: el.name, user: user });
    router.push(`/rooms/${el.name}`);
  };

  return (
    <li className="border-gray-400 flex flex-row w-full">
      <div className="select-none bg-secondary text-bg flex flex-1 justify-between items-center gap-3 px-8 py-2 transition duration-500 ease-in-out transform hover:-translate-y-2 rounded-md border-2 hover:shadow-2xl border-primary">
        <div className="flex-1 pl-1">
          <div className="font-medium">{el.name}</div>
        </div>
        <div
          onClick={joinRoom}
          className="text-wrap text-center flex text-bg text-bold flex-col rounded-md bg-primary justify-center items-center p-2"
        >
          Join
        </div>
      </div>
    </li>
  );
}
