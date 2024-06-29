import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function ChatUi() {
  const socket = io("http://192.168.0.116:5001");
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("called");
    socket.on("user-added", (data) => {
      setMessages((prevMsg) => [...prevMsg, data]);
    });
    socket.on("message-sended", (data) => {
      setMessages((prevMsg) => [...prevMsg, data]);
      console.log(data);
    });

    return () => {
      socket.off("user-added");
      socket.off("message-sended");
    };
  }, [socket]);
  console.log(messages);

  const handleJoinUser = (e) => {
    e.preventDefault();
    console.log(user);
    socket.emit("add-user", user);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit("send-message", { username: user, message });
  };

  return (
    <section className=" flex justify-center items-center h-screen">
      <div className=" h-full overflow-scroll">
        <div className=" flex-col space-y-2 mb-5 sticky top-4 z-10 bg-white ">
          <form
            onSubmit={handleJoinUser}
            className=" flex gap-2 justify-center"
          >
            <label className="input input-bordered flex items-center gap-2">
              UserName
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                type="text"
                className="grow"
              />
            </label>
            <button className="btn">Join</button>
          </form>
          <form
            onSubmit={handleSendMessage}
            className=" flex gap-2 justify-center"
          >
            <label
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input input-bordered flex items-center gap-2"
            >
              Message
              <input type="text" className="grow" />
            </label>
            <button className="btn">Send</button>
          </form>
        </div>
        <div>
          {messages.map((msg, index) => (
            <div key={index} className="chat chat-start">
              {msg?.message ? (
                <>
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                      />
                    </div>
                  </div>
                  <div className="chat-bubble">
                    {msg.username} saying: {msg.message}
                  </div>
                </>
              ) : (
                <p className="text-sm font-light text-center rounded text-slate-700 py-1 transition-all duration-200">
                  {msg.username} Joined
                </p>
              )}
            </div>
          ))}
        </div>
        {/* <div className="">
          <div>
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  />
                </div>
              </div>
              <div className="chat-bubble">
                It was said that you would, destroy the Sith, not join them.
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
