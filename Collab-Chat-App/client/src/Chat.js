import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Container from "./components/container/Container";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [user, setUser] = useState(username);
  const [onlineCount, setOnlineCount] = useState(1);
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  socket.on("back", (data) => {
    console.log(data);
  });

  socket.on("members", (data) => {
    let onlinePlayers = data.count;
    setOnlineCount(onlinePlayers);
  });

  const notify = () => toast.success('Copied to Clipboard', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
  const handleClick = event => {
    navigator.clipboard.writeText(room)
    notify()
  };
  return (
    <div className="main-page">
      <div className="chat-window">

        <div className="chat-header">
          <p className="roomidchat">
            Room :
            {room}
          </p>
          <div className="btn" onClick={handleClick} style={{ color: "#FFF" }}>

            <div>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
            <ContentCopyIcon></ContentCopyIcon>
          </div>
          <p>{" "}
            Online : <span id="green">{onlineCount ?? 5}</span>
          </p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent) => {
              return (
                <div
                  className="message"
                  id={username === messageContent.author ? "other" : "you"}
                >
                  <div>
                    <div className="message-content">
                      <p id="author">{messageContent.author}</p>
                      <p id="author1">{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={currentMessage}
            placeholder="Hey..."
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button onClick={sendMessage}>&#9658;</button>
        </div>
      </div >
      <Container socket={socket} room={room} />
    </div >
  );
}

export default Chat;
