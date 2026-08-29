"use client";

import TemplateDetailClient from "../TemplateDetailClient";

function UiDesignerResumeTemplateContent() {
  return (
    <>
      <p>This UI designer resume template is for designers who need portfolio links, design tools, project details, and practical design work to stand out.</p>
      <h2>Who should use this template</h2>
      <p>Use this format if you design websites, apps, dashboards, landing pages, brand screens, or product flows.</p>
      <h2>How to write the summary</h2>
      <p>Keep the summary focused on the kind of design work you do. Mention Figma, wireframes, user flows, responsive design, or handoff only if you have used them properly.</p>
      <h2>What to include</h2>
      <ul>
        <li>Portfolio link, design tools, and project categories.</li>
        <li>Wireframes, UI screens, design systems, and prototypes.</li>
        <li>Developer handoff, client feedback, and usability improvements.</li>
      </ul>
      <blockquote>Your portfolio shows the visuals. Your resume should explain the thinking and responsibility behind them.</blockquote>
    </>
  );
}

export default function UiDesignerResumeTemplateClient() {
  return (
    <TemplateDetailClient
      slug="ui-designer-resume-template"
      ContentComponent={UiDesignerResumeTemplateContent}
    />
  );
}
