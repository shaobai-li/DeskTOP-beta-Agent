import './Input.css';

function Input({ placeholder, value, onChange }) {
    return (
        <input
            type="text"
            className="input"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
}

export default Input;

