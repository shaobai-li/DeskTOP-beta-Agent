import React from 'react';
import './FeatureMenu.css';
import renameIcon from '../../assets/featuremenu-rename.svg';
import deleteIcon from '../../assets/featuremenu-delete.svg';

const FeatureMenu = ({ selectedItem, handleMenuItemClick }) => {
    return (
        <div className="feature-menu-wrapper">
            <div className="feature-menu">
                <div className="feature-menu-item">
                    <div 
                        className={`feature-menu-item__button ${selectedItem === '重命名' ? 'feature-menu-item__button--selected' : ''}`}
                        onClick={() => handleMenuItemClick('重命名')}
                    >
                        <img className="feature-menu-item__icon" src={renameIcon} alt="重命名" />
                        <span className="feature-menu-item__text">重命名</span>
                    </div>
                </div>
                <div className="feature-menu-item">
                    <div 
                        className={`feature-menu-item__button ${selectedItem === '删除' ? 'feature-menu-item__button--selected' : ''}`}
                        onClick={() => handleMenuItemClick('删除')}
                    >
                        <img className="feature-menu-item__icon" src={deleteIcon} alt="删除" />
                        <span className="feature-menu-item__text">删除</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureMenu;
