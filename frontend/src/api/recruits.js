const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function getDashboardRecruits() {
  const res = await fetch(`${API_BASE}/dashboard_recruits`);
  if (!res.ok) throw new Error('Failed to fetch dashboard recruits');
  return res.json();
}

export async function getCandidateProfile(id) {
  const res = await fetch(`${API_BASE}/candidate_profile?id=${id}`);
  if (!res.ok) throw new Error('Failed to fetch candidate profile');
  return res.json();
}

export async function updateOnboardingNotes(id, notes) {
  const res = await fetch(`${API_BASE}/update/onboarding_notes`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, notes }),
  });
  if (!res.ok) throw new Error('Failed to update onboarding notes');
  return res.json();
}

export async function updateCandidateGrades(id, grades) {
  const res = await fetch(`${API_BASE}/update/candidate_grades`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...grades }),
  });
  if (!res.ok) throw new Error('Failed to update grades');
  return res.json();
}

export async function updateCandidateStage(id, stage) {
  const res = await fetch(`${API_BASE}/update/candidate_stage`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, stage }),
  });
  if (!res.ok) throw new Error('Failed to update stage');
  return res.json();
}