"use client";

import TemplateDetailClient from "../TemplateDetailClient";

function SoftwareDeveloperResumeTemplateContent() {
  return (
    <>
      <p>This software developer resume template is for candidates who want their technical work to be easy to read. It gives space to skills, projects, work history, and contact details without making the resume feel packed.</p>
      <h2>Who should use this template</h2>
      <p>Use this format if you work with frontend, backend, full stack development, mobile apps, or web products. It also works well for developers who have internship projects and want to show tools clearly.</p>
      <h2>How to write the summary</h2>
      <p>Keep the summary short. Mention your stack, the type of applications you have built, and the work you can handle.</p>
      <h2>What to add in skills</h2>
      <ul>
        <li>Languages and frameworks you use regularly.</li>
        <li>Databases, APIs, deployment tools, and testing basics.</li>
        <li>Tools you can explain during an interview.</li>
      </ul>
      <h2>Work experience tips</h2>
      <p>Write about features shipped, bugs fixed, pages improved, API work, deployment support, and code reviews.</p>
      <blockquote>Write what you actually handled. That is usually more convincing than trying to sound bigger.</blockquote>
    </>
  );
}

export default function SoftwareDeveloperResumeTemplateClient() {
  return (
    <TemplateDetailClient
      slug="software-developer-resume-template"
      ContentComponent={SoftwareDeveloperResumeTemplateContent}
    />
  );
}
