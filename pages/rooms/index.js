import { useEffect, useState } from 'react';
import { Layout, RoomCard, Toast, AddRoom, ErrorModal } from '../../components';
import useSWR, { trigger } from 'swr';
import { signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

export default function Roomlist() {
  const router = useRouter();
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR('/api/rooms', fetcher);
  const [session, loading] = useSession();
  const [alert, setAlert] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [onAdd, setOnAdd] = useState(false);
  const [onError, setOnError] = useState(null);
  const socket = io({
    autoConnect: false,
  });

  useEffect(() => {
    if (!session) {
      router.push('/');
    } else {
      socket.connect();
    }

    return () => socket.disconnect();
  }, [session]);

  const googleSignOut = () => {
    signOut();
  };
  socket.on('alert', (data) => {
    setAlert(data);
    setTimeout(() => {
      setAlert(null);
    }, 3000);
    setAlerts((alerts) => [...alerts, data]);
  });

  socket.on('triggerReload', () => {
    console.log('triggered');
    trigger('/api/rooms');
  });

  if (error) return <div>{JSON.stringify(error)}</div>;
  if (loading) return <div>Loading...!!</div>;
  return (
    <Layout title="Ngobrol Room List">
      <div className="bg-primary w-full h-20 flex justify-center">
        <span className="text-3xl font-black font-custom text-bg pt-2">
          ngobrol
        </span>
      </div>
      <div
        className="relative bg-bg w-full rounded-t-2xl 
                  -top-5 flex flex-col 
                  items-center justify-center
                  overflow-hidden h-5"
      ></div>
      <span className="text-2xl font-custom font-bold text-primary">
        select room:
      </span>
      <div className="bg-bg flex w-full items-center justify-center font-custom text-sm">
        <ul className="flex flex-col p-4 gap-2">
          {data?.rooms &&
            session &&
            data.rooms.map((el, i) => {
              return (
                <RoomCard
                  el={el}
                  key={i}
                  user={session.user}
                  setOnError={setOnError}
                />
              );
            })}
        </ul>
      </div>
      <div className="bg-primary w-full h-16 flex flex-col justify-between fixed bottom-0">
        <div
          className="relative bg-bg w-full rounded-b-2xl 
                  top-0 flex flex-col 
                  items-center justify-center
                  overflow-hidden h-5"
        ></div>
        <div className="flex flex-row justify-around text-bg pb-2">
          {session && (
            <img
              src={session.user.image}
              alt=""
              className="w-6 h-6 rounded-full"
            />
          )}

          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => {
              setOnAdd(!onAdd);
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            onClick={googleSignOut}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>
      </div>
      {alert && <Toast alert={alert} />}
      {onAdd && <AddRoom setOnAdd={setOnAdd} user={session.user} />}
      {onError && <ErrorModal onError={onError} />}
    </Layout>
  );
}
