import { useState, useEffect } from "react";
import { Button } from "./components/Button";
import Textarea from "./components/Textarea";
import { Dropdown } from "./components/Dropdown";
import { Input } from "./components/Input";
import StageSelect from "./components/StageSelect";
import './Email.css';

const EMAIL_TEMPLATES = [
  {
    value: "onboarding",
    label: "Onboarding Workshop Template",
    subject: "Invitation to onboarding workshop",
    body: ""
  },
  {
    value: "acceptance",
    label: "Recruitment Stage Acceptance Template",
    subject: "Update on your PAST Application",
    body: ""
  },
  {
    value: "interview",
    label: "Interview Template",
    subject: "PAST team interview schedule",
    body: ""
  },
  {
    value: "logbook",
    label: "Logbook submission Template",
    subject: "Logbook Submision",
    body: ""
  }
];

export default function SendEmailView({ selectedRecruits = [], onBack }) {
  const [recipients, setRecipients] = useState(selectedRecruits);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false); // Tracks copy button status

  useEffect(() => {
    if (!selectedTemplate) return;
    const templateObj = EMAIL_TEMPLATES.find((t) => t.value === selectedTemplate);
    if (templateObj) {
      setSubject(templateObj.subject);
      setMessage(templateObj.body);
    }
  }, [selectedTemplate]);

  function handleRemoveRecipient(id) {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  }

  // Copy all recipient emails to clipboard for manual pasting 
  function handleCopyBcc() {
    if (recipients.length === 0) return;
    const bccList = recipients.map((r) => r.email).join(", ");
    navigator.clipboard.writeText(bccList);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  // Opens the native desktop email app with pre-filled Subject, and Body
  function handleSendAll() {
    if (recipients.length === 0) return;

    setSending(true);

    try {
      const emailList = recipients.map((r) => r.email).join(",");
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(message);

      // Using bcc= keeps recipient emails hidden from each other
      const mailtoUrl = `mailto:?bcc=${emailList}&subject=${encodedSubject}&body=${encodedBody}`;

      // Open email client
      window.location.href = mailtoUrl;

      // Return back to admin list
      onBack();
    } catch (err) {
      console.error("Failed to open email client", err);
      alert("Failed to open default email application.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="send-email-view">
      <header className="send-email-header">
        <button
          type="button"
          className="send-email-back-btn"
          onClick={onBack}
          aria-label="Back to Admin Panel"
        >
          <span className="back-arrow">&larr;</span> Send Email
        </button>
      </header>

      <main className="send-email-body">
        <div className="send-email-card recipients-card">
          <div className="recipients-left">
            <span className="recipients-title">
              Recipients selected - {recipients.length}
            </span>
            <div className="recipients-chips">
              {recipients.map((recruit) => (
                <div className="recipient-chip" key={recruit.id}>
                  <span>{recruit.email}</span>
                  <button
                    type="button"
                    className="chip-remove"
                    onClick={() => handleRemoveRecipient(recruit.id)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="reselect-btn"
            onClick={onBack}
          >
            Reselect ({recipients.length})
          </button>
        </div>

        <div className="send-email-field">
          <label className="field-label">Template</label>
          <Dropdown
            placeholder="Select Template"
            options={EMAIL_TEMPLATES}
            value={selectedTemplate}
            onChange={setSelectedTemplate}
          />
        </div>

        <div className="send-email-field">
          <label className="field-label">Subject</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email Subject"
          />
        </div>

        <div className="send-email-field">
          <label className="field-label">Message</label>
          <Textarea
            value={message}
            onChange={(v) => setMessage(v)}
            rows={8}
            placeholder="Write your email here"
          />
        </div>

        <div className="send-email-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCopyBcc}
            disabled={recipients.length === 0}
          >
            {copied ? "Copied Emails!" : "Copy Emails (BCC)"}
          </Button>

          <Button
            variant="accent"
            onClick={handleSendAll}
            disabled={sending || recipients.length === 0}
            className="send-all-btn"
          >
            {sending ? "Opening..." : "Open in Email Client"}
          </Button>
        </div>
      </main>
    </div>
  );
}
