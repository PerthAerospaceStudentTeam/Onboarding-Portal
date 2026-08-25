import { useState } from "react";
import "./theme.css"; 
import "./index.css";
import AdminPanel from "./AdminPanel";
import RecruitsDetails from "./RecruitsDetails";
import SendEmailView from "./Email";

export default function App() {
  //navigation/page transition (as 'admin','email',or'recruit' for different views)
  const[currentView, setCurrentView] = useState("admin");
  //for detailed view 
  const[selectedCandidateId, setSelectedCandidateId] = useState(null);
  //for bulk emailing 
  const[selectedRecruits, setSelectedRecruits] = useState([]);

  function handleViewCandidate(id) {
    setSelectedCandidateId(id);
    setCurrentView("details");
  }

  function handleOpenEmailView(recruits) {
    setSelectedRecruits(recruits);
    setCurrentView("email");
  }

  function handleBacktoAdmin() {
    setCurrentView("admin");
    setSelectedCandidateId(null);
  }

  return(
    <main>
      {currentView=="admin" && (
        <AdminPanel
          onViewCandidate={handleViewCandidate}
          onOpenEmailView={handleOpenEmailView}
        />
      )}

      {currentView=="details" && (
        <RecruitsDetails
          candidateId={selectedCandidateId}
          onBack={handleBacktoAdmin}
        />
      )}

      {currentView=="email" && (
        <SendEmailView
          selectedRecruits={selectedRecruits}
          onBack={handleBacktoAdmin}
        />
      )}
    </main>
  );
}
