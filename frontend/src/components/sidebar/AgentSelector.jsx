import React, { useState, useEffect } from 'react';
import './AgentSelector.css';
import expandArrowIcon from '@assets/icon-ui-arrow-expand.png';
import MenuItem from './MenuItem';
import { getAgents } from '../../services/agentsService';

const AgentSelector = ({ selectedItem, handleMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    async function loadAgents() {
      const { data, error } = await getAgents();
      if (error) {
        console.error("加载知能体失败：", error);
        return;
      }
      setAgents(data);
    }
    loadAgents();
  }, []);

  return (
    <div className="agent-selector">
      <div className="agent-selector__header" onClick={() => setIsOpen((prev) => !prev)}>
        <h4 className="agent-selector__header-title">知能体库</h4>
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
              key={agent.agentId}
              title={agent.title}
              path={`/agent/${agent.agentId}`}
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