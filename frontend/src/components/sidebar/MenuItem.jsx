import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import featureIcon from '../../assets/icons8-sidebar_ellipsis-h-30.png';
import './MenuItem.css';
import FeatureMenu from './FeatureMenu';


export default function MenuItem({ title, path, selectedItem, handleMenuItemClick, icon, hasFeature = false }) {
    const isSelected = selectedItem === title;
    const shouldRenderSelected = title !== '新聊天';
    const featureIconRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState(null);
    const [showFeatureMenu, setShowFeatureMenu] = useState(false);


    const handleFeatureClick = (e) => {
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


    return (
        
        <div className="menu-item">
            <Link 
                to={path} 
                className={`menu-item__link ${isSelected && shouldRenderSelected ? 'menu-item__link--selected' : ''}`}
                onClick={() => handleMenuItemClick(title)}
            >

                {icon && <img className="menu-item__icon" src={icon}></img>}
                <span className="menu-item__text">{title}</span>
            </Link>
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
                    selectedItem={selectedItem}
                    handleMenuItemClick={handleMenuItemClick}
                    position={menuPosition}
                    onClose={() => setShowFeatureMenu(false)}
                />
            )}
        </div>
    )
}