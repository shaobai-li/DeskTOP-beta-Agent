const themeStyles = {
    black: "bg-neutral-900 text-neutral-50 hover:bg-neutral-800 active:bg-neutral-700",
    white: "bg-white text-neutral-900 border border-neutral-200 shadow-sm hover:bg-neutral-100 active:bg-neutral-50",
};

function Button({ onClick, text, theme = "black", disabled = false }) {
    return (
        <button
            className={`flex items-center justify-center px-5 py-1 rounded-lg text-sm ${themeStyles[theme]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

export default Button;