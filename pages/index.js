import { useEffect } from 'react';
// import Head from 'next/head';
// import styles from '../styles/Home.module.css';
import { signIn, signOut, useSession } from 'next-auth/client';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import { Layout } from '../components';

export default function Home() {
  const router = useRouter();
  const [session, loading] = useSession();
  const socket = io({
    autoConnect: false,
  });

  useEffect(() => {
    if (session) {
      socket.connect();
      socket.on('now', (message) => {
        // console.log('message', message);
      });
      socket.emit('signIn', session);
      router.push('/rooms');
    }
  }, [session]);

  const googleSignIn = async () => {
    await signIn('google', { callbackUrl: '/rooms' });
    // router.push('/rooms');
  };
  const googleSignOut = () => {
    signOut();
    console.log(session, 'dari logout');
  };

  return (
    // <div className={styles.container}>
    <Layout title="Welcome to Ngobrol">
      <div className="bg-primary w-full h-20 flex justify-center">
        <span className="text-3xl font-black font-custom text-bg pt-2">
          ngobrol
        </span>
      </div>
      <div
        className="relative bg-bg w-full rounded-t-2xl 
                  -top-5 flex flex-col 
                  items-center justify-center
                  overflow-hidden h-52 sm:h-96"
      >
        <img src="/hero.jpg" alt="" className="onject-cover" />
      </div>
      <div className="py-4 flex flex-col items-center">
        <span className="text-lg font-custom">Welcome to ngobrol chat app</span>
        <span className="text-lg font-custom">please sign in to continue</span>
      </div>
      {!session ? (
        <button
          className="flex flex-row gap-3 py-2 justify-center bg-gray-900 w-2/3 font-custom text-white px-3 rounded text-sm focus:outline-none shadow"
          onClick={() => googleSignIn()}
        >
          <img src="/google.png" className="w-6 h-6" alt="google logo" />
          Sign In with Google
        </button>
      ) : (
        <button
          className="flex flex-row gap-3 py-2 justify-center bg-gray-900 w-2/3 font-custom text-white px-3 rounded text-sm focus:outline-none shadow"
          onClick={() => googleSignOut()}
        >
          <img src="/google.png" className="w-6 h-6" alt="google logo" />
          Sign Out with Google
        </button>
      )}
      <div className="bg-primary w-full h-16 flex justify-center absolute bottom-0">
        <div
          className="relative bg-bg w-full rounded-b-2xl 
                  top-0 flex flex-col 
                  items-center justify-center
                  overflow-hidden h-5"
        ></div>
      </div>
    </Layout>
  );
}
