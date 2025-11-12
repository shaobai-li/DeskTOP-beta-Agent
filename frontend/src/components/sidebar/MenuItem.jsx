    import { Link } from "react-router-dom";
    import featureIcon from '../../assets/icons8-sidebar_ellipsis-h-30.png';
    import './MenuItem.css';

    export default function MenuItem({ title, path, selectedItem, handleMenuItemClick, icon, hasFeature = false }) {
        const isSelected = selectedItem === title;
        const shouldRenderSelected = title !== '新聊天';

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
                    <div>
                        <img className="menu-item__feature-icon" src={featureIcon}  />
                    </div>
                )}
            </div>
        )
    }