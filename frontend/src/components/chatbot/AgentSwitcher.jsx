import React, { useState, useEffect, useRef } from 'react';
import './AgentSwitcher.css';
import expandArrow from '../../assets/icons8-expand-arrow-52.png';
import checkmark from '../../assets/icons8-checkmark.svg';
import robotIcon from '../../assets/icons8-robot-24.svg';

export default function AgentSwitcher() {
  const [selectedAgent, setSelectedAgent] = useState('Agent 1');
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef(null);

  // 预设的Agent列表
  const agents = [
    'Agent 1',
    'Agent 2',
    'Agent 3',
    'Agent 4'
  ];

  const handleAgentChange = (agent) => {
    setSelectedAgent(agent);
    setIsOpen(false);
    // 这里可以添加切换Agent的逻辑，目前先不实现功能性
  };

  // 点击下拉外部关闭（与 PageSizeSelect 保持一致）
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="chat-panel__agent-switcher" ref={switcherRef}>
      <div className="chat-panel__agent-switcher-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedAgent}</span>
        <img src={expandArrow} className="chat-panel__agent-switcher-arrow" alt="expand" />
      </div>
      {isOpen && (
        <div className="chat-panel__agent-switcher-dropdown">
          {agents.map((agent, index) => (
            <div 
              key={index} 
              className={`chat-panel__agent-switcher-option ${selectedAgent === agent ? 'chat-panel__agent-switcher-option--selected' : ''}`}
              onClick={() => handleAgentChange(agent)}
            >
              <div className="chat-panel__agent-switcher-left">
                <img src={robotIcon} className="chat-panel__agent-switcher-robot-icon" alt="robot" />
                <div className="chat-panel__agent-switcher-content">
                  <span>{agent}</span>
                  <div className="chat-panel__agent-switcher-role">{`角色${index + 1}`}</div>
                </div>
              </div>
              {selectedAgent === agent && <img src={checkmark} className="chat-panel__agent-switcher-checkmark" alt="selected" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}