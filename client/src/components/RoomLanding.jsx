import { useState } from 'react';

export function RoomLanding({ onJoin }) {
  const [roomId, setRoomId] = useState('');

  function handleCreateRoom() {
    const newId = crypto.randomUUID().split('-')[0];
    onJoin(newId);
  }

  function handleJoinExisting(e) {
    e.preventDefault();
    if (!roomId.trim()) return;
    onJoin(roomId.trim());
  }

  return (
    <div className="landing-container">
      <div className="landing-card">
        <div className="branding">
          <h1 className="app-title">PEERLINK</h1>
          <p className="app-subtitle">
            Minimal, secure one-to-one video meetings in your browser.
          </p>
        </div>

        <form className="join-form" onSubmit={handleJoinExisting}>
          <label htmlFor="roomId" className="label">
            Join with Room ID
          </label>
          <input
            id="roomId"
            type="text"
            className="input"
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button type="submit" className="primary-button full-width">
            Join Room
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button type="button" className="secondary-button" onClick={handleCreateRoom}>
          Create New Room
        </button>
      </div>
    </div>
  );
}

