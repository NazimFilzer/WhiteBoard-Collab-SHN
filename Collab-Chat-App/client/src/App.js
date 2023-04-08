import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import { nanoid } from "nanoid";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// const socket = io.connect("https://collaber-whiteboard.herokuapp.com/");
const socket = io.connect("https://collaber-server.onrender.com/");

function App() {
  const uniqueId = nanoid(4);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(uniqueId);
  const [showChat, setShowChat] = useState(false);
  const [roomBool, setRoomBool] = useState(true);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      const joinData = { room, username };
      socket.emit("join_room", joinData);
      setShowChat(true);
    }
  };

  const createid = () => {
    const uniqueId = nanoid(8);
    setRoom(uniqueId);
    setRoomBool(false);
  };

  const notify = () => toast.success('Copied to Clipboard', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", });
  const handleClick = event => {
    navigator.clipboard.writeText(room)
    notify()
  };

  return (
    <>
      <div className="App">
        <div className="nav">
          <h2>COLLABER</h2>
        </div>
        <div className="boxes">
          {!showChat ? (
            <div className="joinChatContainer">
              <div className="joinbox">
                <div className="box1">
                  <h3>Create a Room</h3>
                  <input
                    type="text"
                    placeholder="John..."
                    onChange={(event) => {
                      setUsername(event.target.value);
                    }}
                  />

                  <button onClick={joinRoom}>Create Room</button>

                  <div className="roomcode">
                    <p className="room-id">{room}</p>
                    <button className="" title="Click to Copy" onClick={handleClick} >
                      <span className="copy-icon">Copy</span>
                      <ContentCopyIcon></ContentCopyIcon>
                      <div>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="box2">
                  <h3>Join A Room</h3>

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
                </div>
              </div>
            </div>
          ) : (
            <Chat socket={socket} username={username} room={room} />
          )}
        </div>
      </div>
      <div >
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
    </>
  );

}

export default App;
