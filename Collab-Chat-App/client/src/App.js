import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import {nanoid} from "nanoid";


const socket = io.connect("http://localhost:3001");

function App() {

  const [username, setUsername] = useState("");
  const room=nanoid();
 
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      const joinData = { room, username }
      socket.emit("join_room", joinData);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      <div className="nav">
        <h2>COLLABER</h2>

      </div>
      <div className="boxes">
        {!showChat ? (
          <div className="joinChatContainer">
            <div className="joinbox">
              <h3>Join A Room</h3>
              <input
                type="text"
                placeholder="John..."
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
              

              <button onClick={joinRoom}>Enter Room</button>
              <button onClick={joinRoom}>Create Room</button>
            </div></div>



        ) : (
          <Chat socket={socket} username={username} room={room} />
        )}

      </div>
    </div>
  );
}

export default App;
