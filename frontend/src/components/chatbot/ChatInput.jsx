import './ChatInput.css';
import { useState, useRef, useEffect } from 'react';
import sendButton from '@assets/icon-action-send.png';
import agentIcon from '@assets/icon-ui-robot.svg';
import Button from '../common/Button';
import PopupMenu from '@components/common/PopupMenu';

export default function ChatInput({ onSendMessage }) {
  const [inputValue, setInputValue] = useState('');
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('Agent 1');
  const [anchorRect, setAnchorRect] = useState(null);

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

  const handleToggle = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAnchorRect(rect);
    setShowAgentMenu(true);
  };

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
          onClick={handleToggle}
          icon={agentIcon}
          theme="whiteCircle"
        />
        {showAgentMenu && anchorRect && (
          <PopupMenu
            direction="top"
            position={anchorRect}
            onClose={() => setShowAgentMenu(false)}
          >
            <div className="px-2 py-2 cursor-pointer">Agent 1</div>
            <div className="px-2 py-2 cursor-pointer">Agent 2</div>
            <div className="px-2 py-2 cursor-pointer">Agent 3</div>
          </PopupMenu>
        )}
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