import React, { useState } from 'react';
import './SidePanel.css';
import MenuItem from './MenuItem';
import ChatHistory from './ChatHistory';
import FeatureMenu from './FeatureMenu';
import databaseIcon from '../../assets/icons8-sidebar_database-16.png';
import newChatIcon from '../../assets/icons8-sidebar_new-chat-24.png';

const SidePanel = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleMenuItemClick = (itemName) => {
        setSelectedItem(itemName);
    };

    return (
      <aside className="side-panel">
        <MenuItem title="我的文本库" 
                  path="/textbase"
                  selectedItem={selectedItem} 
                  handleMenuItemClick={handleMenuItemClick}
                  icon={databaseIcon} />
        <MenuItem title="新聊天" 
                  path="/chat"
                  selectedItem={selectedItem} 
                  handleMenuItemClick={handleMenuItemClick}
                  icon={newChatIcon} />
        <ChatHistory selectedItem={selectedItem} handleMenuItemClick={handleMenuItemClick}/>
        <FeatureMenu 
                  selectedItem={selectedItem} 
                  handleMenuItemClick={handleMenuItemClick} />
      </aside>
    );
};

export default SidePanel;