import io from 'socket.io-client';
import { useRouter } from 'next/router';

export default function RoomCard({ el, user, setOnError }) {
  const router = useRouter();
  const socket = io({
    autoConnect: false,
  });
  const joinRoom = () => {
    router.push(`/rooms/${el.name}`);
  };

  const deleteRoom = () => {
    if (el.createdBy) {
      if (el.createdBy === user.email) {
        if (el.users[0]) {
          setOnError('Cant delete when room is active');
          setTimeout(() => {
            setOnError(null);
          }, 3000);
        } else {
          socket.connect();
          socket.emit('deleteRoom', { room: el.name, user: user });
        }
      } else {
        setOnError('Room created by other user');
        setTimeout(() => {
          setOnError(null);
        }, 3000);
      }
    } else {
      setOnError('Room created by other user');
      setTimeout(() => {
        setOnError(null);
      }, 3000);
    }
  };

  return (
    <li className="border-gray-400 flex flex-row w-full">
      <div className="w-full select-none bg-primary text-bg flex flex-1 justify-between items-center gap-8 px-2 py-2 transition duration-500 ease-in-out transform hover:-translate-y-2 rounded-md border-2 hover:shadow-2xl border-primary">
        <div className="flex-1">
          <div className="font-medium">
            {el.name} <small>[{el.users.length} joined]</small>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          {el.users.length === 2 ? (
            <div className="text-wrap text-center flex text-gray-400 text-bold flex-col rounded-md justify-center items-center">
              Full
            </div>
          ) : (
            <div
              onClick={joinRoom}
              className="text-wrap text-center flex text-bg text-bold flex-col rounded-md justify-center items-center"
            >
              Join
            </div>
          )}
          <div
            onClick={joinRoom}
            className="text-wrap text-center flex text-bg text-bold flex-col rounded-md justify-center items-center"
          ></div>
          <div
            onClick={deleteRoom}
            className="text-wrap text-center flex text-bg text-bold flex-col rounded-md justify-center items-center"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
        </div>
      </div>
    </li>
  );
}
