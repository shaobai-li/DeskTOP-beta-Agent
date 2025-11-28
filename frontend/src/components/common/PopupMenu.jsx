import { createPortal } from "react-dom";
import { useEffect } from "react";

export default function PopupMenu({ position, onClose, children, direction = "bottom" }) {
    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest(".popup-menu-panel")) {
                onClose?.();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return createPortal(
        <div
            className="fixed z-50 popup-menu-panel bg-white shadow-lg rounded-lg px-2 py-2"
            style={{
                top: direction === "top" ? position.top - 4 : position.bottom + 4,
                left: position.right ? undefined : position.left,
                right: position.right ? `${window.innerWidth - position.right}px` : undefined,
                transform: direction === "top" ? "translateY(-100%)" : "none"
            }}
        >
            {children}
            
        </div>,
        document.body
    );
}
