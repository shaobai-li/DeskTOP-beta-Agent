import './ChatInput.css';
import { useState, useRef, useEffect, use } from 'react';
import sendButton from '@assets/icon-action-send.png';
import agentIcon from '@assets/icon-ui-robot.svg';
import Button from '@components/common/Button';
import PopupMenu from '@components/common/PopupMenu';
import { useChat } from '@contexts/ChatContext';
import { useChatStreaming } from '@hooks/useChatStreaming';
import { useParams } from 'react-router-dom';

export default function ChatInput() {

  const { state, actions } = useChat();
  const { chatId } = useParams();
  const [selectedAgentId, setSelectedAgentId] = useState(actions.getSelectedAgentId(chatId));
  
  const { handleSendMessage } = useChatStreaming(state, actions, {chatId, selectedAgentId});
  const [inputValue, setInputValue] = useState('');
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);

  const handleSendMessageStream = () => {
    if (inputValue.trim()) {
      console.log("flag");
      handleSendMessage(inputValue.trim());
      setInputValue('');
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageStream();
    }
  }

  const handleToggle = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAnchorRect(rect);
    console.log("selectedAgentId -1 ", selectedAgentId);
    setShowAgentMenu(true);
  };

    const handleClick = (agentId ) => {
      setSelectedAgentId(agentId);
      console.log("selectedAgentId -2 ", agentId);
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
            {state.agents.map((agent) => (
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
          onClick={handleSendMessageStream}
          icon={sendButton}
          theme="blackCircle"
        />
      </div>
    </div>
  )
}