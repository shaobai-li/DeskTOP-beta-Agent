import './ChatInput.css';
import { useState, useRef, useEffect } from 'react';
import sendButton from '@assets/icon-action-send.png';
import agentIcon from '@assets/icon-ui-robot.svg';
import Button from '../common/Button';

export default function ChatInput({ onSendMessage }) {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      console.log("flag1");
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

  const handleAgentSelector = () => {
    console.log("agent selector");
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
      <div className="flex flex-row justify-between px-2 py-2 gap-2">
        <Button 
          className="agent-selector-button"
          onClick={handleAgentSelector}
          icon={agentIcon}
          theme="whiteCircle"
        />
        <Button 
          className="send-button"
          onClick={handleSendMessage}
          icon={sendButton}
          theme="blackCircle"
        />
      </div>
    </div>
  )
}