// src/components/RoomSelector.tsx
import React from "react";
import { db } from "../firebase";
import { ref, set } from "firebase/database";
import { useGame } from "../contexts/GameContext";
import { useToast } from "../contexts/ToastContext";
import { useRoom } from "../hooks/useRoom";

const RoomSelector: React.FC = () => {
  const { gameState, setGameState } = useGame();
  const { pushToast } = useToast();
  const { createRoom: createRoomHook, joinRoom: joinRoomHook } = useRoom({ 
    gameState, 
    setGameState 
  });

  const createRoom = () => {
    // Generate a random number between 10000 and 99999
    const id = Math.floor(10000 + Math.random() * 90000).toString();
    set(ref(db, `rooms/${id}`), { cookie: 0 }); // initialize Firebase room
    createRoomHook(id); // assign as player 1
    pushToast("Room created! Share ID: " + id, "all", 3000, id); // Pass roomId directly
  };

  const joinRoom = () => {
    const id = prompt("Enter room ID:");
    if (id) {
      joinRoomHook(id); // assign as player 2
      pushToast("Player 2 joined!", "all", 3000, id); // Pass roomId directly
    }
  };

  return (
    <div className="room-selector">
      <button onClick={createRoom}>Create Room</button>
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};

export default RoomSelector;