"use client";

import TemplateDetailClient from "../TemplateDetailClient";

function HrCoordinatorResumeTemplateContent() {
  return (
    <>
      <p>This HR coordinator resume template is for candidates who support hiring, onboarding, employee records, attendance, document collection, and daily HR communication.</p>
      <h2>Who should use this template</h2>
      <p>Use this template if you work as an HR assistant, recruiter, HR coordinator, admin executive, or people operations support candidate.</p>
      <h2>How to write the summary</h2>
      <p>Start with the HR processes you have handled. Mention screening, interview scheduling, onboarding, documentation, HRMS, or employee communication.</p>
      <h2>What to include</h2>
      <ul>
        <li>Recruitment support, screening, calling, and interview scheduling.</li>
        <li>Joining formalities, document checks, employee files, and HRMS updates.</li>
        <li>Attendance records, employee communication, and admin support.</li>
      </ul>
      <blockquote>Good HR resume writing is clear, warm, and process-aware.</blockquote>
    </>
  );
}

export default function HrCoordinatorResumeTemplateClient() {
  return (
    <TemplateDetailClient
      slug="hr-coordinator-resume-template"
      ContentComponent={HrCoordinatorResumeTemplateContent}
    />
  );
}
