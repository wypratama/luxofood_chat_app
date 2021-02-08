import { signIn, signOut, useSession } from 'next-auth/client';
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';

export default function Chatroom() {
  const messageEl = useRef(null);
  const router = useRouter();
  const [session, loading] = useSession();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const socket = io({
    autoConnect: false,
  });
  const doSignOut = async () => {
    socket.connect();
    await socket.emit(
      'disconnectRoom',
      {
        user: session.user,
        room: router.query.name,
      },
      () => {
        signOut();
      }
    );
  };
  const backToBoard = async () => {
    socket.connect();
    await socket.emit(
      'disconnectRoom',
      {
        user: session.user,
        room: router.query.name,
      },
      () => {
        router.push('/rooms');
      }
    );
  };

  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener('DOMNodeInserted', (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, []);

  useEffect(() => {
    if (session) {
      socket.connect();
      socket.emit('join', { room: router.query.name, user: session.user });
    } else {
      router.push('/');
    }
    return () => {
      if (session) {
        socket.emit(
          'disconnectRoom',
          {
            user: session.user,
            room: router.query.name,
          },
          () => {
            socket.disconnect();
          }
        );
      }
    };
  }, [session]);
  const sendMessage = (e) => {
    e.preventDefault();
    if (input) {
      socket.connect();
      socket.emit('chatMessage', {
        msg: input,
        user: session.user,
        room: router.query.name,
      });
      setInput('');
    }
  };
  socket.on('message', (data) => {
    console.log(messages);
    setMessages((messages) => [...messages, data]);
  });

  return (
    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen bg-bg">
      <div className="flex sm:items-center justify-between py-3 px-2 border-b-2 border-gray-300">
        <div className="flex items-center gap-x-4">
          {session && (
            <img
              src={session.user.image}
              alt=""
              className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
            />
          )}
          <div className="font-custom flex flex-col leading-tight">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-3">
                {session?.user.name}
              </span>
              {/* <span className="text-green-500">
                <svg width="10" height="10">
                  <circle cx="5" cy="5" r="5" fill="currentColor"></circle>
                </svg>
              </span> */}
            </div>
            <span className="text-sm text-gray-600">
              {router.query.name}'s room
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={backToBoard}
            className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={doSignOut}
            className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        id="messages"
        ref={messageEl}
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch h-full justify-start"
      >
        {messages[0] &&
          messages.map((el, i) => {
            if (el.user.name === 'admin') {
              return (
                <div className="chat-message" key={i}>
                  <div className="flex items-end justify-center">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                      <div>
                        <span className="px-2 py-1 rounded-md inline-block text-gray-400 ">
                          {el.msg}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else if (el.user.email === session.user.email) {
              return (
                <div className="chat-message" key={i}>
                  <div className="flex items-end justify-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                      <div>
                        <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-primary text-white ">
                          {el.msg}
                        </span>
                      </div>
                    </div>
                    <img
                      src={el.user.image}
                      alt="My profile"
                      className="w-6 h-6 rounded-full order-2"
                    />
                  </div>
                </div>
              );
            } else {
              return (
                <div className="chat-message" key={i}>
                  <div className="flex items-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                      <div>
                        <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                          {el.msg}
                        </span>
                      </div>
                    </div>
                    <img
                      src={el.user.image}
                      alt="My profile"
                      className="w-6 h-6 rounded-full order-1"
                    />
                  </div>
                </div>
              );
            }
          })}
      </div>
      <div className="border-t-2 border-gray-300 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <span className="absolute inset-y-0 flex items-center right-0">
            <button
              type="button"
              onClick={sendMessage}
              className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                className="w-6 h-6 transform rotate-90 "
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </span>
          <input
            type="text"
            placeholder="Write Something"
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyPress={(e) => {
              e.key === 'Enter' && sendMessage(e);
            }}
            value={input}
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-full py-3"
          />
          <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6 transform rotate-90"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
