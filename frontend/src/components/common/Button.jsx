function Button({ onClick, text }) {
    return (
        <button
            className="flex items-center justify-center px-3 py-1 bg-[#1a1a1a] text-white rounded-lg text-sm"
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default Button;