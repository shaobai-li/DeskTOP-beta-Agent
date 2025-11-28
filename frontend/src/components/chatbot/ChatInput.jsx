import './ChatInput.css';
import { useState, useRef, useEffect, use } from 'react';
import sendButton from '@assets/icon-action-send.png';
import agentIcon from '@assets/icon-ui-robot.svg';
import Button from '@components/common/Button';
import PopupMenu from '@components/common/PopupMenu';
import { useChatPageContext } from '@pages/ChatPage';

export default function ChatInput({ onSendMessage, setAgentId, availableAgents }) {
  const [inputValue, setInputValue] = useState('');
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const { selectedAgentId } = useChatPageContext();


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

  const handleClick = (agentId ) => {
      setAgentId(agentId);
      setShowAgentMenu(false);
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
            {availableAgents.map((agent) => (
              <div 
              key={agent.agentId} 
              className={`px-2 py-2 rounded-md cursor-pointer hover:bg-neutral-100 ${selectedAgentId === agent.agentId ? "bg-neutral-100" : ""}`} 
              onClick={() => handleClick(agent.agentId)}>
                {agent.title}
              </div>
            ))}
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