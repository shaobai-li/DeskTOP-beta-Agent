import './ChatInput.css';
import { useState, useRef, useEffect, use } from 'react';
import sendButton from '@assets/icon-action-send.png';
import addIcon from '@assets/icon-ui-add.svg';
import agentIcon from '@assets/icon-ui-robot.svg';
import closeIcon from '@assets/icon-ui-chatinput-close.svg';
import Button from '@components/common/Button';
import PopupMenu from '@components/common/PopupMenu';
import { useChat } from '@contexts/ChatContext';
import { useChatStreaming } from '@hooks/useChatStreaming';
import { useParams } from 'react-router-dom';

export function AgentLabel({ text, }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="group h-10 inline-flex items-center justify-center rounded-full px-4 text-sm font-medium
                 text-blue-600 bg-blue-50 hover:bg-blue-100"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span>
        {hovered
          ? <img src={closeIcon} alt="" className="w-4 h-4 mr-2"/>
          : <img src={agentIcon} alt="" className="w-4 h-4 mr-2"/>
        }
      </span>
      {text}
    </div>
  );
}


export default function ChatInput() {

  const { state, actions } = useChat();
  const { chatId } = useParams();
  const [selectedAgentId, setSelectedAgentId] = useState(actions.getSelectedAgentId(chatId));
  
  const selectedAgent = actions.getAgentById(selectedAgentId)
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
        <div className="flex items-center gap-2">
            <Button 
              className="agent-selector-button"
              onClick={handleToggle}
              icon={addIcon}
              theme="whiteCircle"
            />
            {
             selectedAgent && <AgentLabel text={selectedAgent.title} />
            }
          </div>

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