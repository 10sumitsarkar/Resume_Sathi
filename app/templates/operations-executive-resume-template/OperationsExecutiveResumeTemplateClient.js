"use client";

import TemplateDetailClient from "../TemplateDetailClient";

function OperationsExecutiveResumeTemplateContent() {
  return (
    <>
      <p>This operations executive resume template is built for candidates who manage daily work, follow-ups, reports, coordination, and process tracking.</p>
      <h2>Who should use this template</h2>
      <p>Use this template if your work includes vendor calls, internal updates, documentation, MIS reports, inventory checks, scheduling, or issue follow-up.</p>
      <h2>How to write the summary</h2>
      <p>Start with the kind of operations work you handle. Mention the teams, reports, or processes you support.</p>
      <h2>Skills to add</h2>
      <ul>
        <li>Excel, MIS, reporting, data entry, and documentation.</li>
        <li>Vendor coordination, follow-up, scheduling, and communication.</li>
        <li>Process tracking, issue handling, and team support.</li>
      </ul>
      <blockquote>Operations resumes become stronger when they show consistency, ownership, and clean documentation.</blockquote>
    </>
  );
}

export default function OperationsExecutiveResumeTemplateClient() {
  return (
    <TemplateDetailClient
      slug="operations-executive-resume-template"
      ContentComponent={OperationsExecutiveResumeTemplateContent}
    />
  );
}
