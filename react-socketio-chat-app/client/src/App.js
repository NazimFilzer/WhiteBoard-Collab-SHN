import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import {TradingViewStockChartWidget} from 'react-tradingview-components'

const socket = io.connect("http://localhost:3001");

function App() {

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
<<<<<<< HEAD
      <div className="twoboxes">
=======
       
>>>>>>> 11f178e4e3ed7783b1c0d6e489944a5fbb81149f
      {!showChat ? (
        <div className="joinChatContainer">
          <div className="joinbox">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
          </div></div>
        
        
        
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}

           {!showChat ? (
        <div className="joinChatContainer">
          <div className="joinbox">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
          </div></div>
        
        
        
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
      </div>
    </div>
  );
}

export default App;
