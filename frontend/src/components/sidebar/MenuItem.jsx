import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import featureIcon from '@assets/icon-ui-ellipsis-horizontal.png';
import './MenuItem.css';
import FeatureMenu from './FeatureMenu';


export default function MenuItem({ title, path, itemId, selectedItem, handleMenuItemClick, icon, onRename = null, hasFeature = false, renderOnSelected = true }) {
    const isSelected = itemId === selectedItem;
    const featureIconRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState(null);
    const [showFeatureMenu, setShowFeatureMenu] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const inputRef = useRef(null);
    const [localTitleOriginal, setLocalTitleOriginal] = useState(title);
    const [localTitle, setLocalTitle] = useState(title);

    const handleFeatureClick = () => {
        if (featureIconRef.current) {
            const rect = featureIconRef.current.getBoundingClientRect();
            setMenuPosition({
                left: rect.left,
                top: rect.top,
                bottom: rect.bottom,
                right: rect.right
            });
            setShowFeatureMenu(prev => !prev);
        }
    };

    const handleRename = () => {
        setIsRenaming(true)
    }

    useEffect(() => {
        if (isRenaming && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isRenaming]);

    const handleRenameSubmit = (text) => {
        if (text !== localTitleOriginal) {
            onRename?.(text);
        }        
        setLocalTitle(text);
        setLocalTitleOriginal(text);
        setIsRenaming(false);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleRenameSubmit(localTitle.trim());
        } else if (e.key === 'Escape') {
            handleRenameSubmit(localTitleOriginal);
        }
    }
    
    return (
        
        <div className="menu-item">
            <div className={`menu-item__main ${isSelected && renderOnSelected? 'menu-item__main--selected' : ''}`}>
                {isRenaming ? (
                    <input
                        ref={inputRef}
                        className="menu-item__rename-input"
                        value={localTitle}
                        onChange={(e) => setLocalTitle(e.target.value)}
                        onBlur={() => handleRenameSubmit(localTitle.trim())}
                        onKeyDown={handleKeyPress}
                    />
                ) : (
                    <Link 
                        to={path} 
                        className="menu-item__link"
                        onClick={() => handleMenuItemClick(itemId)}
                    >
                        {icon && <img className="menu-item__icon" src={icon}></img>}
                        <span className="menu-item__text">{localTitle}</span>
                    </Link>
                )}
                
            </div>
            {hasFeature && (
                <div className="menu-item__feature">
                    <img
                        ref={featureIconRef}
                        className="menu-item__feature-icon"
                        src={featureIcon} 
                        onClick={handleFeatureClick}
                    />
                </div>
            )}
            {showFeatureMenu && menuPosition && (
                <FeatureMenu
                    handleMenuItemClick={handleMenuItemClick}
                    position={menuPosition}
                    onClose={() => setShowFeatureMenu(false)}
                    onRename={handleRename}
                />
            )}
        </div>
    )
}