    import { Link } from "react-router-dom";
    import './MenuItem.css';

    export default function MenuItem({ title, path, selectedItem, handleMenuItemClick, icon }) {
        const isSelected = selectedItem === title;
        const shouldRenderSelected = title !== '新聊天';

        return (
            <Link 
                to={path} 
                className={`menu-item ${isSelected && shouldRenderSelected ? 'selected' : ''}`}
                onClick={() => handleMenuItemClick(title)}
            >
                <img className="menu-item-icon" src={icon}></img>
                <span className="menu-item-text">{title}</span>
            </Link>
        )
    }