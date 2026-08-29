"use client";

import TemplateDetailClient from "../TemplateDetailClient";

function SalesResumeTemplateContent() {
  return (
    <>
      <p>This sales resume template is for business development, telecalling, field sales, inside sales, and client-facing roles.</p>
      <h2>Who should use this template</h2>
      <p>Use this format if your work involves speaking with customers, finding leads, handling calls, managing CRM records, giving demos, or closing deals.</p>
      <h2>How to write the summary</h2>
      <p>Mention the customer type, sales channel, and kind of work you handle. If you have target-based experience, include it in a simple way.</p>
      <h2>What to include</h2>
      <ul>
        <li>Lead generation, cold calling, field visits, and demos.</li>
        <li>CRM updates, follow-ups, proposals, and client meetings.</li>
        <li>Targets, conversion work, and customer relationship handling.</li>
      </ul>
      <blockquote>A sales resume should sound confident, but it should still sound like a real work record.</blockquote>
    </>
  );
}

export default function SalesResumeTemplateClient() {
  return (
    <TemplateDetailClient
      slug="sales-resume-template"
      ContentComponent={SalesResumeTemplateContent}
    />
  );
}
