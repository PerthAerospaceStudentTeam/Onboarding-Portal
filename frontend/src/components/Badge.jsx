import './Badge.css';

export function Badge ({variant='default', children}) {
    return <span className={`badge badge-${variant}`}>{children}</span>;
}