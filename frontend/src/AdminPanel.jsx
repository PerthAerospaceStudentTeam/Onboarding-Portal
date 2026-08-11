import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/Button";
import { Dropdown } from "./components/Dropdown";
import { Badge, STAGE_CONFIG } from "./components/Badge";
import { Table } from "./components/Table";
import { Input } from "./components/Input";
import "./AdminPanel.css";

const MOCK_RECRUITS = [
    {
        id: 1,
        name: "Recruit 1",
        email: "recruit1@student.edu.curtin.au",
        team: "Mechanical",
        stage: "applied",
        attendance: 85
    },
    {
        id: 2,
        name: "Recruit 2",
        email: "recruit2@student.edu.curtin.au",
        team: "Software",
        stage: "onboarding",
        attendance: 80
    },
    {
        id: 3,
        name: "Recruit 3",
        email: "recruit3@student.edu.curtin.au",
        team: "ADCS",
        stage: "onboarding",
        attendance: 90
    },
    {
        id: 4,
        name: "Recruit 4",
        email: "recruit4@student.edu.curtin.au",
        team: "Marketing",
        stage: "interview",
        attendance: 90
    },
];

const TEAMS = [
    { value: "software", label: "Software" },
    { value: "mechanical", label: "Mechanical" },
    { value: "avionics", label: "Avionics" },
    { value: "marketing", label: "Marketing" },
    { value: "ADCS", label: "ADCS"},
    { value: "team dev", label: "Team Dev"}
];

const STAGE = STAGE_CONFIG
    ? Object.entries(STAGE_CONFIG).map(([value, config]) => ({
    value,
    label: config.label
})) : [];

async function fetchCandidates() {
    return Promise.resolve(MOCK_RECRUITS);
}

export default function AdminPanel({ onViewCandidate }) {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [teamFilter, setTeam] = useState(null);
    const [stageFilter, setStage] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());

    useEffect(() => {
        let cancelled = false;
        async function loadCandidates() {
            setLoading(true);
            setError(null);
            try {   
                const data = await fetchCandidates();
                if (!cancelled) setCandidates(data ?? []);
            } catch(error) {
                if (!cancelled) setError(error?.message || "An error occurred.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadCandidates();
        return () => {
            cancelled = true;
        };
    }, []);

    const filteredRows = useMemo(() => {
        const query = search.trim().toLowerCase();
        return candidates.filter((c) => {
            const matchesSearch = !query || c.name?.toLowerCase().includes(query);
            const matchesTeam = !teamFilter || c.team?.toLowerCase() === teamFilter.toLowerCase();
            const matchesStage = !stageFilter || c.stage === stageFilter;
            return matchesSearch && matchesTeam && matchesStage;
        });
    }, [candidates, search, teamFilter, stageFilter]);

    const toggleRow = useCallback((id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id); 
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const toggleAll = useCallback((checked) => {
        if (checked) {
            setSelectedIds(new Set(filteredRows.map((row) => row.id)));
        } else {
            setSelectedIds(new Set());
        }
    }, [filteredRows]);

    const handleSearchChange = (e) => {
        const value = typeof e === "string" ? e : e?.target?.value ?? "";
        setSearch(value);
    };

    const visibleSelectedCount = useMemo(() => {
        return filteredRows.filter((r) => selectedIds.has(r.id)).length;
    }, [filteredRows, selectedIds]);

    const columns = [
        { key: "name", header: "Candidate Name" },
        { key: "stage", header: "Stage", render: (row) => <Badge stage={row.stage}/> },
        { key: "team", header: "Team", render: (row) => <strong className="admin-panel-team">{row.team}</strong> }, 
        { key: "attendance", header: "Attendance", render: (row) => `${row.attendance ?? 0}%` }, 
        {
            key: "action", 
            header: "Action", 
            render: (row) => ( 
                <Button variant="primary" onClick={() => onViewCandidate?.(row.id)}> 
                    View Details 
                </Button>
            )
        }
    ];

    return (
        <div className="admin-panel">
            <header className="admin-panel-header">
                <span className="admin-panel-logo">PAST</span>
                <span className="admin-panel-account">Admin</span>
                <span className="admin-panel-avatar" aria-hidden="true" />
            </header>

            <main className="admin-panel-body">
                <div className="admin-panel-toolbar">
                    <div className="admin-panel-filters">
                        <Input 
                            placeholder="Search Candidates"
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <Dropdown
                            placeholder="Filter Teams"
                            options={TEAMS}
                            value={teamFilter}
                            onChange={setTeam}
                        />
                        <Dropdown
                            placeholder="Stage"
                            options={STAGE}
                            value={stageFilter}
                            onChange={setStage}
                        />
                    </div>
                    
                    <div className="admin-panel-actions">
                        <Button variant="accent">Share as</Button>
                        <Button variant="action" disabled={visibleSelectedCount === 0}>
                            Email ( {visibleSelectedCount} ) selected
                        </Button>
                    </div>
                </div>

                {loading && <p className="admin-panel-status">Loading Recruits..</p>}

                {error && !loading && (
                    <p className="admin-panel-error">{error}</p>
                )}

                {!loading && !error && (
                    <Table
                        candidates={filteredRows}
                        selectedIds={Array.from(selectedIds)}
                        onToggleSelect={toggleRow}
                        onViewDetails={(id)=> onViewCandidate?.(id)}
                    />
                )}
            </main>
        </div>
    );
}
