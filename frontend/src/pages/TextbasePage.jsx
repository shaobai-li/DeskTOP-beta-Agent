import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';



function TextbasePage() {

    return (
        <div className="textbase flex flex-col h-full">
            
            <div className="textbase__header flex flex-col px-8 py-8 gap-8">
                <h1 className="textbase__title text-4xl font-bold">我的文本库</h1>
                <nav className="textbase__navbar flex gap-4 items-center text-xl">
                    <NavLink to="/textbase/articles" className="textbase__nav-item active:text-neutral-500">文章</NavLink>
                    <NavLink to="/textbase/tags" className="textbase__nav-item active:text-neutral-500">标签</NavLink>
                </nav>
            </div>

            <div className="textbase__content">
                <Outlet />
            </div>
        </div>
    )

}

export default TextbasePage;