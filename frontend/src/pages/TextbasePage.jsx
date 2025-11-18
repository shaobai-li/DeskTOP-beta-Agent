import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './TextbasePage.css';


function TextbasePage() {

    return (
        <div className="textbase">
            
            <div className="textbase__header">
                <h1 className="textbase__title">我的文本库</h1>
                <nav className="textbase__navbar">
                    <NavLink to="/textbase/articles" className="textbase__nav-item">文章</NavLink>
                    <NavLink to="/textbase/tags" className="textbase__nav-item">标签</NavLink>
                </nav>
            </div>

            <div className="textbase__content">
                <Outlet />
            </div>
        </div>
    )

}

export default TextbasePage;