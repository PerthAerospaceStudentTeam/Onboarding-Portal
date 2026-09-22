import { useState, useEffect } from "react";
import { Button } from "./components/Button";
import Textarea from "./components/Textarea";
import StageSelect from "./components/StageSelect";
<<<<<<< HEAD
import { getRecruitById, updateRecruitNotes } from "./services/recruits";
import './RecruitsDetails.css';

const GRADE_FIELDS = [ 
    { key: "total", label: "Total" },
    { key: "teamDevelopment", label: "Team Dev"},
    { key: "technical", label: "Technical"}
=======
import {
    getCandidateProfile,
    updateOnboardingNotes,
    updateCandidateGrades,
    updateCandidateStage,
} from "./api/recruits";
import './RecruitsDetails.css';

const GRADE_FIELDS = [
    { key: "onboarding_score", label: "Onboarding Score" },
    { key: "project_score", label: "Project Score" },
    { key: "interview_score", label: "Interview Score" }
>>>>>>> origin/development
];

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
<<<<<<< HEAD
                const data = await getRecruitById(candidateId);
=======
                const data = await getCandidateProfile(candidateId);
>>>>>>> origin/development
                if (isMounted) {
                    setCandidate({
                        ...data,
                        // Normalise stage casing for StageSelect if needed
                        stage: data.stage ? data.stage.charAt(0).toUpperCase() + data.stage.slice(1).toLowerCase() : "Applied"
                    });
                }
<<<<<<< HEAD
            }
            catch(error) {
                console.error("Cannot fetch the recruit!", error);
            }
            finally {
=======
            } catch (error) {
                console.error("Cannot fetch the recruit!", error);
            } finally {
>>>>>>> origin/development
                if (isMounted) setLoading(false);
            }
        }

        if (candidateId) {
            fetchCandidate();
        }

        return () => {
            isMounted = false;
        };
    }, [candidateId]);

    function updateField(field, value) {
        setCandidate((prev) => ({ ...prev, [field]: value }));
    }

    function updateGrade(field, value) {
<<<<<<< HEAD
        setCandidate((prev) => ({
            ...prev,
            grades: { ...prev.grades, [field]: value }
        }));
=======
        const numericVal = value === "" ? null : Number(value);
        setCandidate((prev) => ({ ...prev, [field]: numericVal }));
>>>>>>> origin/development
    }

    async function handleSave() {
        if (!candidate) return;
        setSaving(true);
        setSaveStatus(null);
        try {
<<<<<<< HEAD
            await updateRecruitNotes(candidateId, candidate);
=======
            // Save updates in parallel or sequence against respective endpoints
            await Promise.all([
                updateOnboardingNotes(candidate.id, candidate.notes || ""),
                updateCandidateStage(candidate.id, candidate.stage),
                updateCandidateGrades(candidate.id, {
                    onboarding_score: candidate.onboarding_score,
                    project_score: candidate.project_score,
                    interview_score: candidate.interview_score,
                }),
            ]);
>>>>>>> origin/development
            setSaveStatus("success");
        } catch (error) {
            console.error("Cannot save candidate!", error);
            setSaveStatus("error");
<<<<<<< HEAD
        }
        finally {
=======
        } finally {
>>>>>>> origin/development
            setSaving(false);
        }
    }

    if (loading || !candidate) {
        return <div className="recruit-details-loading">Loading recruit details..</div>;
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
                        <p className="recruit-details-department">{candidate.team}</p>
                        {candidate.course && <p className="recruit-details-course">{candidate.course} (Exp: {candidate.expected_grad_date})</p>}
                    </div>
                    <StageSelect value={candidate.stage} onChange={(v) => updateField("stage", v)} />
                </section>

                <div className="recruit-details-grid">
                    <section className="recruit-details-panel">
                        <h3>Onboarding Notes</h3>
                        <Textarea
<<<<<<< HEAD
                            value={candidate.onboardingNotes || ""}
                            onChange={(v) => updateField("onboardingNotes", v)} 
=======
                            value={candidate.notes || ""}
                            onChange={(v) => updateField("notes", v)}
>>>>>>> origin/development
                        />
                    </section>

                    <section className="recruit-details-panel">
<<<<<<< HEAD
                        <h3>Logbook Submission Notes</h3>
                        <Textarea
                            value={candidate.logbookNotes || ""}
                            onChange={(v) => updateField("logbookNotes", v)}
                        />
                    </section>

                    <section className="recruit-details-panel">
                        <h3>Interview Notes</h3>
                        <Textarea
                            value={candidate.interviewNotes || ""}
                            onChange={(v) => updateField("interviewNotes", v)}
                            placeholder="Placeholder Notes..."
                        />
=======
                        <h3>Logbook / Application Info</h3>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-muted, #555)", marginBottom: "8px" }}>
                            {candidate.reason_4_application || "No application reason provided."}
                        </p>
                        {candidate.cv_link && (
                            <a href={candidate.cv_link} target="_blank" rel="noopener noreferrer">
                                View CV Link
                            </a>
                        )}
>>>>>>> origin/development
                    </section>

                    <section className="recruit-details-panel">
                        <h3>Grades</h3>
                        <div className="recruit-details-grades">
                            {GRADE_FIELDS.map(({ key, label }) => {
                                const inputId = `grade-${key}`;
                                return (
                                    <div className="recruit-details-grade-row" key={key}>
<<<<<<< HEAD
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
=======
                                    <label htmlFor={inputId}>{label}</label>
                                    <input
                                        id={inputId}
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="recruit-details-grade-input"
                                        value={candidate[key] ?? ""}
                                        onChange={(e) => updateGrade(key, e.target.value)}
                                    />
                                     </div>
>>>>>>> origin/development
                                );
                            })}
                        </div>
                    </section>
                </div>

                <div className="recruit-details-save">
                    {saveStatus === "success" && (
                        <span className="recruit-details-status recruit-details-status-success">
                            Changes saved successfully!
                        </span>
                    )}
                    {saveStatus === "error" && (
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
    );
}
