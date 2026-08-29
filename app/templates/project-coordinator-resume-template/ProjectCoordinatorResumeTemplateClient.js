"use client";

import TemplateDetailClient from "../TemplateDetailClient";

function ProjectCoordinatorResumeTemplateContent() {
  return (
    <>
      <p>This project coordinator resume template is for candidates who manage tasks, reports, timelines, client updates, team follow-ups, and delivery coordination.</p>
      <h2>Who should use this template</h2>
      <p>Use this template if your work sits between teams, clients, and deadlines. It works for project coordinators, team leads, junior project managers, and operations managers.</p>
      <h2>How to write the summary</h2>
      <p>Begin with the type of projects or teams you coordinate. Mention planning, calls, task tracking, reports, or delivery support.</p>
      <h2>What to include</h2>
      <ul>
        <li>Task planning, status calls, client updates, and follow-ups.</li>
        <li>Reports, documents, timelines, blockers, and meeting notes.</li>
        <li>Team coordination, delivery tracking, and communication tools.</li>
      </ul>
      <blockquote>A coordinator resume should show clarity, ownership, and follow-through.</blockquote>
    </>
  );
}

export default function ProjectCoordinatorResumeTemplateClient() {
  return (
    <TemplateDetailClient
      slug="project-coordinator-resume-template"
      ContentComponent={ProjectCoordinatorResumeTemplateContent}
    />
  );
}
