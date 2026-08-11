import { useState } from "react";
import "./theme.css"; 
import "./index.css";
import AdminPanel from "./AdminPanel";
import RecruitsDetails from "./RecruitsDetails";


export default function App() {
  const[selectedCandidateId, setSelectedCandidateId] = useState(null);

  return(
    <main>
      {selectedCandidateId === null ? (
        <AdminPanel onViewCandidate={(id) => setSelectedCandidateId(id)}/>
      ) : (
        <RecruitsDetails candidateId={selectedCandidateId} onBack={() => setSelectedCandidateId(null)} />
      )}
    </main>
  );
}
