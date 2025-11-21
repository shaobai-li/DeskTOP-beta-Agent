import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './FeatureMenu.css';
import renameIcon from '@assets/icon-action-rename.svg';
import deleteIcon from '@assets/icon-action-delete.svg';

const FeatureMenu = ({ handleMenuItemClick, position, onClose, onRename }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const menuStyle = {
        position: 'fixed',
        left: `${position.left}px`,
        top: `${position.bottom}px`,
        zIndex: 9999
    };

    return createPortal(
        <div ref={menuRef} className="feature-menu-wrapper" style={menuStyle}>
            <div className="feature-menu">
                <div className="feature-menu-item">
                    <div 
                        className="feature-menu-item__button"
                        onClick={() => {
                            onRename();
                            onClose();
                        }}
                    >
                        <img className="feature-menu-item__icon" src={renameIcon} alt="重命名" />
                        <span className="feature-menu-item__text">重命名</span>
                    </div>
                </div>
                <div className="feature-menu-item">
                    <div 
                        className="feature-menu-item__button"
                        onClick={() => {
                            handleMenuItemClick('删除');
                            onClose();
                        }}
                    >
                        <img className="feature-menu-item__icon" src={deleteIcon} alt="删除" />
                        <span className="feature-menu-item__text">删除</span>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default FeatureMenu;
