import { useEffect, useRef, useState } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import { ControlsBar } from './ControlsBar';
import { ChatPanel } from './ChatPanel';

export function VideoRoom({ roomId, onLeave }) {
  const [chatOpen, setChatOpen] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const {
    localStream,
    remoteStream,
    micMuted,
    cameraOff,
    chatMessages,
    toggleMic,
    toggleCamera,
    sendChatMessage,
    cleanup
  } = useWebRTC(roomId);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  function handleLeave() {
    cleanup();
    onLeave();
  }

  return (
    <div className="room-container">
      <header className="room-header">
        <span className="room-title">PEERLINK</span>
        <span className="room-id-badge">Room: {roomId}</span>
      </header>

      <main className="room-main">
        <div className="video-area">
          <div className="remote-video-wrapper">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="remote-video"
              />
            ) : (
              <div className="remote-placeholder">
                Waiting for someone to join this call…
              </div>
            )}
          </div>

          {localStream && (
            <div className="local-video-wrapper">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="local-video"
              />
            </div>
          )}
        </div>

        <ControlsBar
          micMuted={micMuted}
          cameraOff={cameraOff}
          onToggleMic={toggleMic}
          onToggleCamera={toggleCamera}
          onToggleChat={() => setChatOpen((open) => !open)}
          onLeave={handleLeave}
        />

        <ChatPanel
          isOpen={chatOpen}
          messages={chatMessages}
          onSend={(text) => sendChatMessage(text, 'You')}
        />
      </main>
    </div>
  );
}

