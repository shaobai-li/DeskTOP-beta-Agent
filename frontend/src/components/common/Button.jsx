const themeStyles = {
    black: "px-5 py-1 text-sm bg-neutral-900 text-neutral-50 hover:bg-neutral-800 active:bg-neutral-700 rounded-md",
    white: "px-5 py-1 text-sm bg-white text-neutral-900 border border-neutral-200 shadow-sm hover:bg-neutral-100 active:bg-neutral-50 rounded-md",
    blackCircle: "w-10 h-10 bg-neutral-900 text-neutral-50 hover:bg-neutral-800 active:bg-neutral-700 rounded-full",
    whiteCircle: "w-10 h-10 bg-white text-neutral-900 border border-neutral-200 shadow-sm hover:bg-neutral-100 active:bg-neutral-50 rounded-full"
};

function Button({ onClick, text, theme = "black", icon = null, disabled = false }) {
    return (
        <button
            className={`flex items-center justify-center ${themeStyles[theme]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <img src={icon} alt="icon" className="w-6 h-6"/>}
            {text}
        </button>
    );
}

export default Button;