import './ChatInput.css';
import { useState, useRef, useEffect } from 'react';
import sendButton from '@assets/icon-action-send.png';

export default function ChatInput({ onSendMessage }) {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <div className="chat-input">
      <input
        className="input-field"
        placeholder="Ask anything"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="chat-button-container">
        <button 
        className="send-button"
        onClick={handleSendMessage}>
          <img src={sendButton} alt="Send" width={20} height={20}/>
        </button>
      </div>
    </div>
  )
}