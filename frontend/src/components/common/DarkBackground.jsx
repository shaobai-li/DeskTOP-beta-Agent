export default function DarkBackground({ children, onClose }) {

    const handleClickOutside = (e) => {
        if (e.target.classList.contains("dark-background")) {
            onClose();
        }
    };

    return (
        <div className="dark-background fixed inset-0 w-full h-full bg-neutral-300/50 flex items-center justify-center z-[9999]" onClick={handleClickOutside}>
            {children}
        </div>
    )
}