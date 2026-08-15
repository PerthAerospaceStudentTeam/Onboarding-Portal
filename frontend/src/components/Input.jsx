import './Input.css';

export function Input({ placeholder, value, onChange, ...props }) {
    return (
        <input
            type="text"
            className="input"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...props}
        />
    );
}