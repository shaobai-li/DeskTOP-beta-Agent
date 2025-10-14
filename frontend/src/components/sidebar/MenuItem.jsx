// import './MenuItem.css';

export default function MenuItem({ title, selectedItem, handleMenuItemClick }) {
    return (
        <div className={`menu-item ${selectedItem === title ? 'selected' : ''}`}
         onClick={() => handleMenuItemClick(title)}>
            <span className="menu-item-text">{title}</span>
            <span className="menu-item-dots">...</span>
        </div>
    )
}