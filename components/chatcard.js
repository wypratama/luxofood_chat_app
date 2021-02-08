export default function ChatCard({ el, i }) {
  if (el.user.email === session.user.email) {
    return (
      <div className="chat-message" key={i}>
        <div className="flex items-end justify-end">
          <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
            <div>
              <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
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
}
