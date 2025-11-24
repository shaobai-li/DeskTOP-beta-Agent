function Input({ placeholder, value, onChange }) {
    return (
        <input
            type="text"
            className="px-4 py-1 border border-neutral-200 rounded-lg text-sm outline-none text-neutral-900"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
}

export default Input;
