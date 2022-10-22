import React from "react";
import { nanoid } from "nanoid";
import io from "socket.io-client";
import "./style.scss";

import { useState } from "react";
import { useEffect } from "react";
import Container from "../container/Container";

const socket = io.connect("http://localhost:5000");
const username = nanoid(4);

const Chat = () => {
  const [isShown, setIsShown] = useState(false);

  const handleClick = (event) => {
    // 👇️ toggle shown state
    setIsShown((current) => !current);

    // 👇️ or simply set it to true
    // setIsShown(true);
  };

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [userName, setUsername] = useState("");
  const sendChat = (e) => {
    e.preventDefault();
    socket.emit("chat", { message, username });
    setMessage("");
  };
  useEffect(() => {
    socket.on("chat", (payload) => {
      setChat([...chat, payload]);
    });
  });

  return (
    <div className="container1">
      <div className="container-chat">
        {chat.map((payload, index) => {
          return (
            <p key={index}>
              <span>{payload.username} :</span>
              {payload.message}
            </p>
          );
        })}
        <form onSubmit={sendChat} className="">
          <input
            type="text"
            className=""
            name="chat"
            placeholder="send text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button className="" type="submit">
            send
          </button>
        </form>
      </div>

      {isShown && <Container />}
      <button onClick={handleClick}>drawboard</button>
    </div>
  );
};

export default Chat;
