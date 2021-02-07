import { useEffect } from 'react';
import { Layout, RoomCard } from '../../components';
import useSWR from 'swr';
import { signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

export default function Roomlist() {
  const router = useRouter();
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR('/api/rooms', fetcher);
  const [session, loading] = useSession();
  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [session]);

  const googleSignOut = () => {
    signOut();
    router.push('/');
    console.log(session, 'dari logout');
  };

  if (error) return <div>Error...!!</div>;
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
      <div className="bg-bg flex w-full items-center justify-center font-custom text-sm">
        <ul className="flex flex-col p-4 gap-2">
          {data &&
            data.rooms.map((el, i) => {
              return <RoomCard el={el} key={i} user={session.user} />;
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>

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
    </Layout>
  );
}
