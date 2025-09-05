// src/components/RoomSelector.tsx

import { db } from "../firebase";
import { ref, set } from "firebase/database";

interface RoomSelectorProps {
  onCreateRoom: (id: string) => void;
  onJoinRoom: (id: string) => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ onCreateRoom, onJoinRoom }) => {
  const createRoom = () => {
    // Generate a random number between 10000 and 99999
    const id = Math.floor(10000 + Math.random() * 90000).toString();
    set(ref(db, `rooms/${id}`), { cookie: 0 }); // initialize Firebase room
    onCreateRoom(id); // assign as player 1
  };

  const joinRoom = () => {
    const id = prompt("Enter room ID:");
    if (id) onJoinRoom(id); // assign as player 2
  };

  return (
    <div>
      <button onClick={createRoom}>Create Room</button>
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};

export default RoomSelector;
