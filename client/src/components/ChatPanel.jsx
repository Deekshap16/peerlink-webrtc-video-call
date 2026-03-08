import { useState } from 'react';

export function ChatPanel({ isOpen, messages, onSend }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
  }

  return (
    <div className={`chat-panel ${isOpen ? 'chat-panel-open' : ''}`}>
      <div className="chat-header">In-call messages</div>
      <div className="chat-messages">
        {messages.map((m, idx) => (
          <div key={idx} className="chat-message">
            <div className="chat-message-meta">
              <span className="chat-sender">{m.sender}</span>
              <span className="chat-timestamp">
                {m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : ''}
              </span>
            </div>
            <div className="chat-text">{m.message}</div>
          </div>
        ))}
      </div>
      <form className="chat-input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Send a message to everyone"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="chat-send-button">
          Send
        </button>
      </form>
    </div>
  );
}

