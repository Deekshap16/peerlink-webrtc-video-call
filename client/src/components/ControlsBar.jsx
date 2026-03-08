export function ControlsBar({
  micMuted,
  cameraOff,
  onToggleMic,
  onToggleCamera,
  onToggleChat,
  onLeave
}) {
  return (
    <div className="controls-bar">
      <button
        type="button"
        className={`control-button ${micMuted ? 'control-button-active' : ''}`}
        onClick={onToggleMic}
        aria-label="Toggle microphone"
      >
        {micMuted ? '🎤 Off' : '🎤 On'}
      </button>

      <button
        type="button"
        className={`control-button ${cameraOff ? 'control-button-active' : ''}`}
        onClick={onToggleCamera}
        aria-label="Toggle camera"
      >
        {cameraOff ? '📷 Off' : '📷 On'}
      </button>

      <button
        type="button"
        className="control-button"
        onClick={onToggleChat}
        aria-label="Toggle chat"
      >
        💬 Chat
      </button>

      <button
        type="button"
        className="control-button leave-button"
        onClick={onLeave}
        aria-label="Leave call"
      >
        Leave
      </button>
    </div>
  );
}

