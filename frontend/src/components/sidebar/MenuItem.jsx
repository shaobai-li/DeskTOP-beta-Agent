import { Link } from "react-router-dom";
import './MenuItem.css';

export default function MenuItem({ title, path, selectedItem, handleMenuItemClick, icon }) {
    return (
        <Link 
            to={path} 
            className={`menu-item ${selectedItem === title ? 'selected' : ''}`}
            onClick={() => handleMenuItemClick(title)}
        >
            <img className="menu-item-icon" src={icon}></img>
            <span className="menu-item-text">{title}</span>
        </Link>
    )
}