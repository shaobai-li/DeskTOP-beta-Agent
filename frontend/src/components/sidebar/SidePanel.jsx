import React, { useState } from 'react';
import './SidePanel.css';
import MenuItem from './MenuItem';
import ChatHistory from './ChatHistory';
import AgentSelector from './AgentSelector';
import NewAgentModal from '../layout/NewAgentModal';
import databaseIcon from '../../assets/sidebar_database-16.png';
import newChatIcon from '../../assets/sidebar_new-chat-24.png';
import newAgentIcon from '../../assets/sidebar_new-agent.svg';
import logo from '../../assets/logo.png';

const SidePanel = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [showNewAgentModal, setShowNewAgentModal] = useState(false);

    const handleMenuItemClick = (itemName) => {
        setSelectedItem(itemName);
    };

    const handleNewAgentClick = () => {
        setShowNewAgentModal(true);
    };

    return (
      <>
        <aside className="side-panel">
                  <div className="side-panel__logo-container">
            <img src={logo} alt="logo" className="side-panel__sidebar-logo" />
          </div>
          <MenuItem title="新建聊天" 
                    path="/"
                    selectedItem={selectedItem} 
                    handleMenuItemClick={handleMenuItemClick}
                    icon={newChatIcon} />
          <MenuItem title="我的知识库" 
                    path="/textbase"
                    selectedItem={selectedItem} 
                    handleMenuItemClick={handleMenuItemClick}
                    icon={databaseIcon} />
          <MenuItem title="新建知能体" 
                    path="#"
                    selectedItem={selectedItem} 
                    handleMenuItemClick={handleNewAgentClick}
                    icon={newAgentIcon} />
          <AgentSelector selectedItem={selectedItem} handleMenuItemClick={handleMenuItemClick}/>          
          <ChatHistory selectedItem={selectedItem} handleMenuItemClick={handleMenuItemClick}/>

        </aside>
        {
          showNewAgentModal && (
            <NewAgentModal onClose={() => setShowNewAgentModal(false)} />
          )
        }
      </>
    )
};

export default SidePanel;