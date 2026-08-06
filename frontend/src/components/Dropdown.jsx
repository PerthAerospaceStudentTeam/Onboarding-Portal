import './Dropdown.css';

export function Dropdown({ options = [], value, onChange, ...props}) {
    return(
        <select className="dropdown" value={value} onChange={onChange} {...props}>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}