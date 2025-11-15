import React, { useState } from 'react';
import './AgentSelector.css';
import expandArrowIcon from '../../assets/icons8-expand-arrow-52.png';
import MenuItem from './MenuItem';

const AgentSelector = ({ selectedItem, handleMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  // 模拟的智能体数据
  const agents = [
    { id: 1, name: '智能体1' },
    { id: 2, name: '智能体2' },
    { id: 3, name: '智能体3' }
  ];

  return (
    <div className="agent-selector">
      <div className="agent-selector__header" onClick={() => setIsOpen((prev) => !prev)}>
        <h4 className="agent-selector__header-title">智能体库</h4>
        <span
          className={`agent-selector__header-icon ${isOpen ? 'agent-selector__header-icon--expanded' : 'agent-selector__header-icon--collapsed'}`}
          style={{
            WebkitMaskImage: `url(${expandArrowIcon})`,
            maskImage: `url(${expandArrowIcon})`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
            maskSize: 'contain'
          }}
        />
      </div>

      {isOpen && (
        <div className="agent-selector__list">
          {agents.map((agent) => (
            <MenuItem
              key={agent.id}
              title={agent.name}
              path="#"
              icon={null} 
              selectedItem={selectedItem}
              handleMenuItemClick={handleMenuItemClick}
              hasFeature={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentSelector;