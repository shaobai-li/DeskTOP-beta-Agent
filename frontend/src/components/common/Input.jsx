function Input({ placeholder, value, onChange }) {
    return (
        <input
            type="text"
            className="px-4 py-1 border border-[#e0e0e0] rounded-lg text-sm outline-none text-[#333] w-[280px]"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
}

export default Input;
