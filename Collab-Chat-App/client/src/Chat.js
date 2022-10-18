import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Container from "./components/container/Container";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [user,setUser]=useState(username);
  const[usercheck,setUsercheck]=useState(username);

 

  const sendMessage = async () => {
    if(usercheck!==""){
      await socket.emit("join_room",username);
      setUsercheck("")
      
  

    }

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

  socket.on('back', data => {
    console.log(data)
  })

  return (
    <div className="main-page">
      <div className="chat-window">
        <div className="chat-header">
          <p> Room : <span>{room}</span></p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent) => {
              return (
                <div
                  className="message"
                  id={username === messageContent.author ? "you" : "other"}
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
      </div>
      <Container />
    </div>
  );
}

export default Chat;
