import { useState, useEffect } from "react";
import { Button } from "./components/Button";
import Textarea from "./components/Textarea";
import StageSelect from "./components/StageSelect";
import './RecruitsDetails.css';

const MOCK_RECRUITS = [
    {
        id: 1,
        name: "Recruit 1",
        email: "recruit@student.edu.curtin.au",
        department: "Mechanical",
        stage: "Onboarding",
        onboardingNotes: "",
        logbookNotes: "",
        interviewNotes: "",
        grades: { total : "", teamDevelopment: "", technical: "" }
    }
]

const GRADE_FIELDS = [ 
    { key: "total", label: "Total" },
    { key: "teamDevelopment", label: "Team Dev"},
    { key: "technical", label: "Technical"}
]

export default function RecruitsDetails({ candidateId, onBack }) {
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        async function fetchCandidate() {
            try {
                // this is just for testing nowwww -> will replace this with real candidate data from backend/supabase 
                const data = MOCK_RECRUITS.find((c) => c.id === candidateId) || MOCK_RECRUITS[0];
                if (isMounted) {
                    setCandidate(data);
                }
            }
            catch(error) {
                console.error("Cannto fetch the recruit!", error);
            }
            finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchCandidate();

        return() => {
            isMounted = false;
        };
    }, [candidateId]);

    function updateField(field, value) {
        setCandidate((prev) => ({...prev, [field]:value}));
    }

    function updateGrade(field, value) {
        setCandidate((prev) => ({...prev, grades: {...prev.grades, [field]:value}}));
    }

    async function handleSave() {
        setSaving(true);
        setSaveStatus(null);
        try {
            setSaveStatus("success");
        }
        catch(error) {
            console.error("Cannot save candidate!", error);
            setSaveStatus("error");
        }
        finally{
            setSaving(false);
        }
    }

    if (loading || !candidate) {
        return <div className="recruit-details-loading">Loading recruit details..</div>
    }

    return (
        <div className="recruit-details">
            <header className="recruit-details-header">
                <button
                    type="button"
                    className="recruit-details-back"
                    onClick={onBack}
                    aria-label="Back to admin panel"
                >
                Back
                </button>
                <h1>{candidate.name}</h1>
            </header>

            <main className="recruit-details-body">
                <section className="recruit-details-stage-card">
                    <div className="recruit-details-stage-info">
                        <h2>Recruitment Process</h2>
                        <a className="recruit-details-email" href={`mailto:${candidate.email}`}>
                            {candidate.email}
                        </a>
                        <p className="recruit-details-department">{candidate.department}</p>
                    </div>
                    <StageSelect value={candidate.stage} onChange={(v) => updateField("stage", v)}/>
                </section>

                <div className="recruit-details-grid">
                    <section className="recruit-details-panel">
                        <h3>Onboarding Notes</h3>
                        <Textarea
                            value={candidate.onboardingNotes|| ""}
                            onChange={(v) => updateField("onboardingNotes", v)} 
                        />
                    </section>

                    <section className="recruit-details-panel">
                        <h3>Logbook Submission Notes</h3>
                        <Textarea
                            value={candidate.logbookNotes || ""}
                            onChange={(v)=> updateField("logbookNotes", v)}
                        />
                    </section>

                    <section className="recruit-details-panel">
                        <h3>Interview Notes</h3>
                        <Textarea
                            value={candidate.interviewNotes || ""}
                            onChange={(v)=> updateField("interviewNotes", v)}
                            placeholder="Placeholder Notes..."
                        />
                    </section>

                    <section className="recruit-details-panel">
                        <h3>Grades</h3>
                        <div className="recruit-details-grades">
                            {GRADE_FIELDS.map(({ key, label }) => {
                                const inputId= `grade-${key}`;
                                return (
                                    <div className="recruit-details-grade-row" key={key}>
                                    <label htmlFor={inputId}>{label}</label>
                                    <input
                                        id={inputId}
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="recruit-details-grade-input"
                                        value={candidate.grades?.[key] ?? ""}
                                        onChange={(e) => updateGrade(key, e.target.value)}
                                    />
                                     </div>
                                );
                            })}
                        </div>
                    </section>
                 </div>

                <div className="recruit-details-save">
                    {saveStatus==="success" && (
                        <span className="recruit-details-status recruit-details-status-success">
                            Changes saved successfully!
                        </span>
                    )}
                    {saveStatus==="error" && (
                        <span className="recruit-details-status recruit-details-status-error">
                            Changes failed to save! Try again.
                        </span>
                    )}
                    <Button variant="accent" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </main>
        </div>
    )
}
