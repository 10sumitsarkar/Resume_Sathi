"use client";

import TemplateDetailClient from "../TemplateDetailClient";

function TeacherResumeTemplateContent() {
  return (
    <>
      <p>This teacher resume template is made for teachers, tutors, trainers, and school staff who want to show classroom work, subject knowledge, lesson planning, and student support in a clear format.</p>
      <h2>Who should use this template</h2>
      <p>Use this template if you teach in a school, coaching center, online class, or training institute.</p>
      <h2>How to write the summary</h2>
      <p>Start with the classes or subjects you teach. Mention classroom handling, lesson planning, parent communication, or student progress work.</p>
      <h2>What to include</h2>
      <ul>
        <li>Subjects taught, class levels, and teaching methods.</li>
        <li>Lesson planning, worksheets, tests, and classroom activities.</li>
        <li>Parent updates, student progress, and school responsibilities.</li>
      </ul>
      <blockquote>A teacher resume should show patience, planning, subject comfort, and everyday classroom responsibility.</blockquote>
    </>
  );
}

export default function TeacherResumeTemplateClient() {
  return (
    <TemplateDetailClient
      slug="teacher-resume-template"
      ContentComponent={TeacherResumeTemplateContent}
    />
  );
}
