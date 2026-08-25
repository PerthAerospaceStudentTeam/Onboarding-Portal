import { useState, useRef, useEffect } from "react";
import { STAGE_CONFIG } from "./Badge";
import "./StageSelect.css";

export default function StageSelect({ value, onChange, options }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const stageKeys = options ??  Object.keys(STAGE_CONFIG);
    const currentStage = STAGE_CONFIG[value];

    useEffect(() => {
        function handleClickOutside(e) {
            if(ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return(() => document.removeEventListener("mousedown", handleClickOutside));
    }, []);

    return (
        <div className="stage-select" ref={ref}>
          <button
            type="button"
            className={`stage-select-trigger stage-select-trigger--${currentStage?.variant ?? "gray"}`}
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span>{currentStage?.label ?? "Set stage"}</span>
            <svg
              className={`stage-select-chevron ${open ? "stage-select-chevron--open" : ""}`}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
    
          {open && (
            <ul className="stage-select-menu" role="listbox">
              {stageKeys.map((key) => (
                <li
                  key={key}
                  className={`stage-select-option ${value === key ? "stage-select-option--active" : ""}`}
                  role="option"
                  aria-selected={value === key}
                  onClick={() => {
                    onChange?.(key);
                    setOpen(false);
                  }}
                >
                  {STAGE_CONFIG[key].label}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
}