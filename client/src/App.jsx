import { useState } from 'react';
import { RoomLanding } from './components/RoomLanding';
import { VideoRoom } from './components/VideoRoom';

export default function App() {
  const [activeRoomId, setActiveRoomId] = useState(null);

  function handleJoin(roomId) {
    setActiveRoomId(roomId);
  }

  function handleLeave() {
    setActiveRoomId(null);
  }

  return (
    <div className="app-shell">
      {activeRoomId ? (
        <VideoRoom roomId={activeRoomId} onLeave={handleLeave} />
      ) : (
        <RoomLanding onJoin={handleJoin} />
      )}
    </div>
  );
}

