"use client";

import TemplateDetailClient from "../TemplateDetailClient";

function FreshGraduateResumeTemplateContent() {
  return (
    <>
      <p>This fresh graduate resume template is made for candidates who are applying for their first full-time role. It gives proper space to education, internships, college projects, certifications, and basic skills.</p>
      <h2>Who should use this template</h2>
      <p>Use this format if you are a fresher, final-year student, recent graduate, or someone shifting from training into a first job.</p>
      <h2>How to write the summary</h2>
      <p>Your summary should be honest and simple. Mention your degree, the role you are applying for, and the practical work you have done.</p>
      <h2>What to include</h2>
      <ul>
        <li>Degree, college name, year, and important coursework.</li>
        <li>Internships, training programs, and workshops.</li>
        <li>Projects with tools used and your actual contribution.</li>
      </ul>
      <h2>Project writing tips</h2>
      <p>Do not only write the project title. Add what the project did, which tools were used, and what part you handled.</p>
    </>
  );
}

export default function FreshGraduateResumeTemplateClient() {
  return (
    <TemplateDetailClient
      slug="fresh-graduate-resume-template"
      ContentComponent={FreshGraduateResumeTemplateContent}
    />
  );
}
