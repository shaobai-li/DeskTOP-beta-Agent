import { Link } from "react-router-dom";
// import './MenuItem.css';

export default function MenuItem({ title, path, selectedItem, handleMenuItemClick }) {
    return (
        <Link to={path} className={`menu-item ${selectedItem === title ? 'selected' : ''}`}
            onClick={() => handleMenuItemClick(title)}>
            <span className="menu-item-text">{title}</span>
            <span className="menu-item-dots">...</span>
        </Link>
    )
}