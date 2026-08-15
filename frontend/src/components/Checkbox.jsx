import './Checkbox.css';

export function Checkbox({ checked, onChange, ...props}) {
    return(
        <input
            type="checkbox"
            className="checkbox"
            checked={checked}
            onChange={onChange}
            {...props}
        />
    );
}