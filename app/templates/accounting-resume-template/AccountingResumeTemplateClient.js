"use client";

import TemplateDetailClient from "../TemplateDetailClient";

function AccountingResumeTemplateContent() {
  return (
    <>
      <p>This accounting resume template is built for accounts assistants, billing executives, junior accountants, and finance support candidates.</p>
      <h2>Who should use this template</h2>
      <p>Use this format if your work includes billing, ledger entries, reconciliation, payment follow-ups, vouchers, GST support, TDS support, or monthly reports.</p>
      <h2>How to write the summary</h2>
      <p>Mention the accounting tasks you handle most often. Accounts hiring usually values accuracy, regularity, software knowledge, and careful documentation.</p>
      <h2>What to include</h2>
      <ul>
        <li>Tally, Excel, bookkeeping, billing, and data entry.</li>
        <li>Invoices, ledgers, statements, vouchers, and vendor records.</li>
        <li>GST, TDS, filing support, reconciliation, and reports.</li>
      </ul>
      <blockquote>An accounting resume should feel careful, organized, and believable.</blockquote>
    </>
  );
}

export default function AccountingResumeTemplateClient() {
  return (
    <TemplateDetailClient
      slug="accounting-resume-template"
      ContentComponent={AccountingResumeTemplateContent}
    />
  );
}
