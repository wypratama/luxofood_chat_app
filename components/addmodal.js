import { useState } from 'react';
import { trigger } from 'swr';
import io from 'socket.io-client';

export default function AddRoom({ setOnAdd, user }) {
  const socket = io({
    autoConnect: false,
  });
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const postRoom = async () => {
    if (!input) {
      setError(`name can't be empty`);
      setTimeout(() => {
        setError(null);
      }, 2500);
    } else {
      const data = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: input, createdBy: user.email, users: [] }),
      });
      const parsed = await data.json();
      if (parsed.error) {
        setError(parsed.error);
        setTimeout(() => {
          setError(null);
        }, 2500);
      } else {
        socket.connect();
        socket.emit('reload', () => {
          socket.emit('justAdd', { room: input, user: user });
        });
        trigger('/api/rooms');
        setOnAdd(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-white bg-opacity-10">
      <div className="flex items-center justify-center min-h-screen text-center">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        </div>

        <div
          className="inline-block px-2 py-6 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl lg:w-2xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="pb-2 bg-white">
            <div className="flex-col items-center sm:flex">
              {/* <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 p-4 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-16 sm:w-16">
                <svg
                  className="w-full h-full text-red-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="5" x2="5" y2="19"></line>
                  <circle cx="6.5" cy="6.5" r="2.5"></circle>
                  <circle cx="17.5" cy="17.5" r="2.5"></circle>
                </svg>
              </div> */}
              {error && (
                <span className="w-full flex justify-center font-mono text-red-500 text-sm">
                  {error}
                </span>
              )}
              <div className="mt-3 mb-1 text-center sm:ml-4 sm:text-left">
                <h3
                  className="pt-1 text-3xl font-black leading-6 text-gray-900"
                  id="modal-headline"
                >
                  Add Room
                </h3>
              </div>
            </div>
          </div>
          <div className="w-full text-base text-center text-gray-600">
            max 15 characters
          </div>
          <div className="px-4 pt-1 pt-3 text-xs bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              maxLength="15"
              className="w-full p-4 my-3 font-mono text-lg text-center text-gray-600 border-4 border-primary border-dashed rounded select-all focus:outline-none"
            />
          </div>
          <div className="flex justify-around w-full px-4 mt-2 font-custom text-sm leading-6 text-center text-gray-500">
            <button
              className="bg-gray-900 text-white w-16"
              onClick={() => {
                setOnAdd(false);
              }}
            >
              Cancel
            </button>
            <button className="bg-primary text-white w-16" onClick={postRoom}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
