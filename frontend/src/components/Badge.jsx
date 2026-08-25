import './Badge.css';

export const STAGE_CONFIG = {
    applied : { label: "Applied", variant: "default"},
    onboarding : { label: "Onboarding", variant: "info"},
    logbook_submission : { label : "Logbook Submission", variant : "basic"},
    interview : { label: "Interview", variant : "warning"},
    accepted : { label: "Accepted", variant : "success"},
    rejected : { label: "Rejected", variant : "error"}
}

export function Badge ({ stage, variant='default', children}) {
    const config = stage ? STAGE_CONFIG[stage] : null;
    const badgeVariant = config?.variant || variant;
    const content = children || config?.label || stage;
    
    return <span className={`badge badge-${badgeVariant}`}>{content}</span>;
}