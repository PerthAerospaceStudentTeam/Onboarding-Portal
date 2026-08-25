import './Dropdown.css';

export function Dropdown({ options = [], value, onChange, placeholder = "", ...props }) {
    const handleChange = (e) => {
        onChange?.(e.target.value);
    };

    return (
        <select className="dropdown" value={value ?? ""} onChange={handleChange} {...props}>
            <option value="">{placeholder}</option>
            {options.map((option) => {
                const optionValue = typeof option === "object" ? option.value : option;
                const optionLabel = typeof option === "object" ? option.label : option;

                return (
                    <option key={optionValue} value={optionValue}>
                        {optionLabel}
                    </option>
                );
            })}
        </select>
    );
}