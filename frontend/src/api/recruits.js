const API_BASE_URL = 'http://localhost:8000/api/recruits';

// 1. Summary List View (AdminPanel)
export async function getRecruits() {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch recruits list');
    const data = await response.json();

    // Map nested FastAPI join payload to expected AdminPanel row fields
    return data.map((item) => ({
        id: item.id,
        name: `${item.users?.first_name || ''} ${item.users?.last_name || ''}`.trim() || 'Unknown',
        email: item.users?.email || '',
        team: item.applications?.department || 'N/A',
        stage: item.status || 'applied',
        attendance: 0 // Placeholder until attendance DB column is added
    }));
}

// 2. Candidate Details View (RecruitsDetails)
export async function getRecruitById(candidateId) {
    const response = await fetch(`${API_BASE_URL}/${candidateId}`);
    if (!response.ok) throw new Error('Failed to fetch recruit details');
    const data = await response.json();
    
    // Extract first evaluation record if present
    const evaluation = Array.isArray(data.internal_candidate_evaluations) 
        ? data.internal_candidate_evaluations[0] || {}
        : data.internal_candidate_evaluations || {};

    return {
        id: data.id,
        name: `${data.users?.first_name || ''} ${data.users?.last_name || ''}`.trim() || 'Unknown',
        email: data.users?.email || '',
        department: data.applications?.department || 'N/A',
        stage: data.status || 'applied',
        onboardingNotes: evaluation.onboarding_notes || '',
        logbookNotes: evaluation.logbook_notes || '',
        interviewNotes: evaluation.interview_notes || '',
        grades: {
            total: evaluation.grade_total ?? '',
            teamDevelopment: evaluation.grade_team_dev ?? '',
            technical: evaluation.grade_technical ?? ''
        }
    };
}

// 3. Update Candidate Notes/Stage (RecruitsDetails)
export async function updateRecruitNotes(candidateId, candidateData) {
    // Format payload to match expected keys in update_recruit_Notes endpoint
    const payload = {
        status: candidateData.stage,
        evaluations: {
            onboarding_notes: candidateData.onboardingNotes,
            logbook_notes: candidateData.logbookNotes,
            interview_notes: candidateData.interviewNotes,
            grade_total: candidateData.grades?.total,
            grade_team_dev: candidateData.grades?.teamDevelopment,
            grade_technical: candidateData.grades?.technical
        }
    };

    const response = await fetch(`${API_BASE_URL}/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Failed to update recruit details');
    return await response.json();
}