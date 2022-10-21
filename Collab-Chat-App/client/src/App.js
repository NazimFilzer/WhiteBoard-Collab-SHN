import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import {nanoid} from "nanoid";


const socket = io.connect("https://collaber-whiteboard.herokuapp.com/");

function App() {
   const uniqueId=nanoid(4);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(uniqueId);
  const [showChat, setShowChat] = useState(false);
  const [roomBool, setRoomBool] = useState(true);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      const joinData = { room, username }
      socket.emit("join_room", joinData);
      setShowChat(true);
      
    }
  };
  
  const createid =()=>
  {
    const uniqueId=nanoid(8);
    setRoom(uniqueId);
    setRoomBool(false);
    
  }


  return (
    <div className="App">
    
      <div className="nav">
        <h2>COLLABER</h2>

      </div>
      <div className="boxes">
        {!showChat ? (
          <div className="joinChatContainer">
            <div className="joinbox">
              <h3>Create a Room</h3>
              <input
                type="text"
                placeholder="John..."
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
             

              <button onClick={joinRoom} >Create Room</button>
             
              
             <div className="roomcode">
              <p className="room-id">{room}</p>
              <button onClick={createid} >Generate</button>
              </div>
              <h2>Join A Room</h2>

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
               <button onClick={joinRoom}>Enter Room</button>





            </div></div>



        ) : (
          <Chat socket={socket} username={username} room={room} />
        )}

      </div>
    </div>
  );
}

export default App;
