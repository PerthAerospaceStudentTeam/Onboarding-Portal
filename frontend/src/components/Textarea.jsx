import "./Textarea.css";

export default function Textarea({
    value,
    onChange,
    placeholder = "Text here..",
    rows = 4,
    ...rest
}) {
    return (
        <textarea
            className="textarea" value={value} placeholder={placeholder} rows={rows} onChange={(e)=> onChange?.(e.target.value)} {...rest} />
    );
}