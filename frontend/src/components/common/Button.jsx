const themeStyles = {
    black: "bg-neutral-900 text-neutral-50",
    white: "bg-white text-neutral-900 border border-neutral-200 shadow-sm",
};

function Button({ onClick, text, theme = "black" }) {
    return (
        <button
            className={`flex items-center justify-center px-5 py-1 rounded-lg text-sm ${themeStyles[theme]}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default Button;