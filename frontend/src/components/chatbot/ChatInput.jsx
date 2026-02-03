import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import sendButton from '@assets/icon-action-send.png';
import addIcon from '@assets/icon-ui-add.svg';
import agentIcon from '@assets/icon-ui-robot.svg';
import closeIcon from '@assets/icon-ui-chatinput-close.svg';

import Button from '@components/common/Button';
import PopupMenu from '@components/common/PopupMenu';

import { useChat } from '@contexts/ChatContext';
import { useChatStreaming } from '@hooks/useChatStreaming';

export function AgentLabel({ text, onClick, isFixed = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`
        h-10 inline-flex items-center justify-center
        rounded-full px-4 text-sm font-medium
        text-blue-600 bg-blue-50
        ${isFixed ? 'cursor-default' : 'cursor-pointer hover:bg-blue-100'}
      `}
      onMouseEnter={() => !isFixed && setHovered(true)}
      onMouseLeave={() => !isFixed && setHovered(false)}
      onClick={isFixed ? undefined : onClick}
    >
      <img
        src={hovered && !isFixed ? closeIcon : agentIcon}
        alt=""
        className="w-4 h-4 mr-2"
      />
      {text}
    </div>
  );
}

export default function ChatInput() {
  const { state, actions } = useChat();
  const { chatId = 'new' } = useParams();

  const [selectedAgentId, setSelectedAgentId] = useState(
    actions.getSelectedAgentId(chatId)
  );

  const [inputValue, setInputValue] = useState('');
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (chatId !== 'new') {
      setSelectedAgentId(actions.getSelectedAgentId(chatId));
    }
  }, [chatId, actions]);

  const selectedAgent = actions.getAgentById(selectedAgentId);
  const { handleSendMessage } = useChatStreaming(chatId, selectedAgentId);

  const handleSendMessageStream = () => {
    if (!inputValue.trim()) return;
    handleSendMessage(inputValue.trim());
    setInputValue('');

    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const autoResizeTextarea = (element) => {
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    autoResizeTextarea(textareaRef.current);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageStream();
    }
  };

  const handleToggleAgentMenu = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAnchorRect(rect);
    setShowAgentMenu(true);
  };

  const updateSelectedAgentId = (agentId) => {
    setSelectedAgentId(agentId);
    if (chatId !== 'new') {
      actions.setSelectedAgentId(chatId, agentId);
    }
  };

  return (
    <div
      className="
        w-full max-w-[1000px]
        flex flex-col
        border border-gray-300
        rounded-[30px]
        bg-white
        shadow-[1px_1px_10px_rgba(0,0,0,0.1)]
      "
    >
      <textarea
        ref={textareaRef}
        rows={1}
        className="
          m-[5px]
          px-[10px] py-[10px]
          rounded-[20px]
          border-none outline-none
          text-[18px] font-normal
          resize-none
          overflow-y-auto
          leading-6
          max-h-[168px]
        "
        placeholder="Ask anything"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      <div className="flex items-center justify-between px-2 py-2 gap-2">
        <div className="flex items-center gap-2">
          {!selectedAgent ? (
            <Button
              onClick={handleToggleAgentMenu}
              icon={addIcon}
              theme="whiteCircle"
            />
          ) : (
            <AgentLabel
              text={selectedAgent.title}
              onClick={() => updateSelectedAgentId(null)}
              isFixed={chatId !== 'new'}
            />
          )}
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
                onClick={() => {
                  updateSelectedAgentId(agent.agentId);
                  setShowAgentMenu(false);
                }}
                className={`
                  px-2 py-2 rounded-md cursor-pointer
                  hover:bg-neutral-100
                  ${selectedAgentId === agent.agentId ? 'bg-neutral-100' : ''}
                `}
              >
                {agent.title}
              </div>
            ))}
          </PopupMenu>
        )}

        <Button
          disabled={!selectedAgent || state.isStreaming[chatId]}
          onClick={handleSendMessageStream}
          icon={sendButton}
          theme="blackCircle"
        />
      </div>
    </div>
  );
}
