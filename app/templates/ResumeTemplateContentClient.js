"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import FooterNav from "../components/FooterNav";
import ReduxProvider from "../resume/store/reduxProvider";
import { setId, setResumeConfigration } from "../resume/reducer/resume-reducer";
import "./templates.css";

export const TEMPLATE_CONTENT = [
  {
    id: "ResumeTemplate1",
    slug: "software-developer-resume-template",
    title: "Software Developer Resume",
    role: "Full Stack Developer",
    layout: "two-column",
    color: "color-2",
    note: "A practical layout for developers who want contact details, skills, project work, and experience visible without making the page feel crowded.",
    content: [
      "Profile section keeps the introduction short and specific.",
      "Skills can be grouped around JavaScript, React, APIs, databases, and cloud tools.",
      "Work points can mention shipped features, bug fixes, reviews, and release work.",
    ],
    article: [
      {
        heading: "Who should use this template",
        body: "This resume page works well for developers who have a mix of technical skills, practical project work, and job experience. The two-column structure keeps contact details and skills easy to find while the main column gives enough room for work history.",
      },
      {
        heading: "What to write first",
        body: "Start with a simple profile that says what kind of developer you are, which stack you use, and what kind of product work you have handled. Avoid long claims. A recruiter should understand your role in the first few lines.",
      },
      {
        heading: "How to shape the experience section",
        body: "Write points around real work: features shipped, bugs fixed, APIs connected, performance issues solved, and release support. Plain details feel stronger than broad statements.",
      },
    ],
  },
  {
    id: "ResumeTemplate2",
    slug: "fresh-graduate-resume-template",
    title: "Fresh Graduate Resume",
    role: "Entry Level Analyst",
    layout: "single-column",
    color: "color-3",
    note: "A clean page for freshers where education, internship work, college projects, and basic skills can breathe properly.",
    content: [
      "Profile copy stays light and honest, with room for learning attitude.",
      "Education and internship sections can come before work history.",
      "Project points can show what was built, tools used, and the final result.",
    ],
    article: [
      {
        heading: "Who should use this template",
        body: "This layout is made for candidates who are starting out and do not want an empty-looking resume. It gives space to education, internships, college projects, courses, and basic skills.",
      },
      {
        heading: "What to write first",
        body: "Keep the profile short. Mention your degree, the kind of role you are applying for, and one or two areas you have practiced through projects or internships.",
      },
      {
        heading: "How to shape the project section",
        body: "Use project points that explain the problem, the tools used, and what you personally handled. Even small college projects can look useful when written clearly.",
      },
    ],
  },
  {
    id: "ResumeTemplate3",
    slug: "operations-executive-resume-template",
    title: "Operations Resume",
    role: "Operations Executive",
    layout: "two-column",
    color: "color-4",
    note: "Good for candidates who handle daily work, reporting, vendor calls, follow-ups, and team coordination.",
    content: [
      "Summary can speak about daily ownership without sounding overdone.",
      "Experience can cover process tracking, team updates, and issue handling.",
      "Skills can include Excel, MIS, coordination, communication, and documentation.",
    ],
    article: [
      {
        heading: "Who should use this template",
        body: "This template fits operations candidates who manage daily tasks, records, calls, follow-ups, and reports. It is useful when the work is steady and responsibility-based.",
      },
      {
        heading: "What to write first",
        body: "Begin with the type of operations work you handle. Mention reporting, coordination, process tracking, or vendor communication if those are part of your routine.",
      },
      {
        heading: "How to shape the experience section",
        body: "Write about daily duties in a clear way. Add details like reports prepared, teams supported, delays tracked, or documents maintained.",
      },
    ],
  },
  {
    id: "ResumeTemplate4",
    slug: "sales-resume-template",
    title: "Sales Resume",
    role: "Business Development Associate",
    layout: "single-column",
    color: "color-5",
    note: "Built for sales profiles where targets, calls, client follow-up, and conversion work should be easy to scan.",
    content: [
      "Profile text can sound like a real sales person with client exposure.",
      "Work section can show targets, lead quality, demos, and closures.",
      "Skills can cover negotiation, CRM updates, cold calling, follow-up, and reporting.",
    ],
    article: [
      {
        heading: "Who should use this template",
        body: "This resume page is useful for sales, business development, telecalling, and client-facing roles. It keeps numbers, targets, and follow-up work easy to read.",
      },
      {
        heading: "What to write first",
        body: "Open with the market or customer type you have worked with. If you handled calls, demos, field visits, or client accounts, say it directly.",
      },
      {
        heading: "How to shape the experience section",
        body: "Use simple sales details: leads handled, demos given, client follow-ups, conversion work, CRM updates, and monthly targets.",
      },
    ],
  },
  {
    id: "ResumeTemplate5",
    slug: "teacher-resume-template",
    title: "Teacher Resume",
    role: "Primary School Teacher",
    layout: "single-column",
    color: "color-6",
    note: "A steady format for teachers, tutors, and trainers who need classroom work, lesson planning, and student support in one place.",
    content: [
      "Summary can focus on classroom responsibility in a simple tone.",
      "Education and certificates stay visible without taking over the page.",
      "Experience can mention lesson plans, parent updates, and student progress.",
    ],
    article: [
      {
        heading: "Who should use this template",
        body: "This template is a good fit for teachers, tutors, trainers, and school staff who need to show classroom work, lesson planning, and student support.",
      },
      {
        heading: "What to write first",
        body: "Start with the classes or subjects you teach. Mention classroom handling, lesson planning, or student progress work if it is part of your experience.",
      },
      {
        heading: "How to shape the experience section",
        body: "Write about actual school work: lesson plans, worksheets, parent communication, exams, student progress, and classroom activities.",
      },
    ],
  },
  {
    id: "ResumeTemplate6",
    slug: "ui-designer-resume-template",
    title: "Designer Resume",
    role: "UI Designer",
    layout: "two-column",
    color: "color-1",
    note: "Useful for creative profiles where portfolio links, design tools, and project outcomes matter as much as job titles.",
    content: [
      "Intro copy keeps the tone simple and portfolio-friendly.",
      "Skills can include Figma, wireframes, design systems, research, and handoff.",
      "Project lines can mention screens designed, user flows, and client feedback.",
    ],
    article: [
      {
        heading: "Who should use this template",
        body: "This layout suits UI designers and creative candidates who need portfolio links, design tools, and project descriptions to stand out.",
      },
      {
        heading: "What to write first",
        body: "Keep the intro focused on the kind of design work you do. Mention apps, websites, dashboards, or brand work if those match your portfolio.",
      },
      {
        heading: "How to shape the project section",
        body: "Write project points around screens designed, user flows improved, design systems followed, and handoff work completed with developers.",
      },
    ],
  },
  {
    id: "ResumeTemplate7",
    slug: "accounting-resume-template",
    title: "Accounting Resume",
    role: "Accounts Assistant",
    layout: "single-column",
    color: "color-2",
    note: "Made for accounts and finance support roles where accuracy, software knowledge, and routine responsibility are important.",
    content: [
      "Summary can focus on billing, entries, reconciliation, and careful paperwork.",
      "Experience can cover invoices, GST or TDS support, ledgers, and vendor records.",
      "Skills can include Tally, Excel, bookkeeping, filing, and report preparation.",
    ],
    article: [
      {
        heading: "Who should use this template",
        body: "This resume page is useful for accounts assistants, junior accountants, billing executives, and finance support staff.",
      },
      {
        heading: "What to write first",
        body: "Mention the accounting tasks you handle most often. Billing, ledger entry, reconciliation, Tally, Excel, GST support, and filing are worth naming when relevant.",
      },
      {
        heading: "How to shape the experience section",
        body: "Use direct points about invoices, vouchers, statements, vendor records, payment follow-ups, and monthly reports.",
      },
    ],
  },
  {
    id: "ResumeTemplate8",
    slug: "hr-coordinator-resume-template",
    title: "HR Resume",
    role: "HR Coordinator",
    layout: "single-column",
    color: "color-3",
    note: "A neat option for HR profiles with hiring coordination, onboarding, employee records, and daily admin work.",
    content: [
      "Profile copy stays warm and professional without inflated claims.",
      "Work entries can show scheduling, document collection, joining formalities, and follow-ups.",
      "Skills can cover HRMS, screening, employee communication, and record keeping.",
    ],
    article: [
      {
        heading: "Who should use this template",
        body: "This format is made for HR coordinators, recruiters, HR assistants, and admin profiles that support hiring and employee records.",
      },
      {
        heading: "What to write first",
        body: "Start with the HR work you actually handle. Screening, interview scheduling, onboarding, documentation, and HRMS updates are useful details.",
      },
      {
        heading: "How to shape the experience section",
        body: "Write about coordination, joining documents, candidate follow-ups, attendance records, employee files, and internal communication.",
      },
    ],
  },
  {
    id: "ResumeTemplate9",
    slug: "project-coordinator-resume-template",
    title: "Manager Resume",
    role: "Project Coordinator",
    layout: "two-column",
    color: "color-4",
    note: "Best for people who manage timelines, task lists, reporting, clients, and small teams.",
    content: [
      "Opening paragraph can show calm ownership of people, work, and deadlines.",
      "Experience can cover planning, status calls, reports, and delivery tracking.",
      "Skills can include coordination, documentation, planning, client handling, and team updates.",
    ],
    article: [
      {
        heading: "Who should use this template",
        body: "This template works for project coordinators, team leads, and managers who track tasks, timelines, reports, clients, and delivery work.",
      },
      {
        heading: "What to write first",
        body: "Begin with the type of projects or teams you coordinate. Mention planning, client calls, status updates, and deadline tracking if those are part of your role.",
      },
      {
        heading: "How to shape the experience section",
        body: "Use points that show practical coordination: tasks assigned, reports shared, blockers followed up, calls handled, and delivery timelines tracked.",
      },
    ],
  },
];

export function createResumeFromTemplate(template, dispatch, router, setLoading, setLoadingTemplateId) {
  const id = `${Date.now()}`;

  setLoading(true);
  if (setLoadingTemplateId) setLoadingTemplateId(template.id);
  dispatch(setId(id));
  dispatch(setResumeConfigration({
    id,
    data: {
      font_style: "poppins",
      layout_style: template.layout,
      color_palette: template.color,
      selected_theme: template.id,
    },
  }));

  router.push(`/resume/personal-info/?id=${id}`);
}

export function getTemplateArticleSections(template) {
  return [
    ...(template.article || []),
    {
      heading: "How to write the profile summary",
      body: `For a ${template.role} resume, the profile summary should sound direct and useful. Write two or three lines that explain the work you handle, the kind of team or workplace you have worked with, and the strengths that matter for this role. Do not fill the opening with heavy words. A hiring manager should be able to read it once and understand your basic fit for the job.`,
    },
    {
      heading: "What to include in skills",
      body: `The skills section should match the work shown in the rest of the resume. Add tools, daily tasks, and role-specific strengths that you can explain in an interview. Keep the list clean. A shorter list with honest skills is better than a long list that feels copied from somewhere else.`,
    },
    {
      heading: "How to write work experience",
      body: `Work experience should show what you actually did. Start each point with the task or responsibility, then add a little context. If you handled reports, mention the report type. If you worked with customers, mention calls, follow-ups, records, or feedback. If you worked in a team, explain your part clearly. Simple, real details make the resume stronger.`,
    },
    {
      heading: "How to write education and certificates",
      body: `Education should be easy to scan. Add degree, institute, year, and location where needed. Certificates should be included only when they support the role. If a certificate is important for the job, add the issuing organization and a short line about what it covered.`,
    },
    {
      heading: "Common mistakes to avoid",
      body: `Avoid copied summaries, very long paragraphs, and skills that do not match the role. Do not write every small task from every job. Pick the details that help the reader understand your current level. Also avoid mixing too many fonts, colors, and section styles. This template already gives the resume a clean structure, so the writing should stay clean too.`,
    },
    {
      heading: "Final writing tip",
      body: `Before sending the resume, read it like a recruiter would. Check whether the job title, skills, recent work, and contact details are visible quickly. Remove any line that sounds impressive but does not say anything clear. A good resume is not about sounding big. It is about making the right information easy to trust.`,
    },
  ];
}

function ResumeTemplateContentInner() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingTemplateId, setLoadingTemplateId] = useState("");

  return (
    <>
      <NavBar />
      <section className="container-fluid custom-container small-hero-area template-hero-area">
        <div className="left-part">
          <div>
            <label className="template-content-eyebrow">Resume Templates</label>
            <h1 className="fs-mob-22">Choose a resume style</h1>
          </div>
          <p className="fs-mob-16">
            Read a sample page first, or start creating with the template you
            like. The selected design will open on the personal information
            step.
          </p>
        </div>
        <div className="right-part d-none d-md-block">
          <img
            src="/front-assets/images/resume-hero.webp"
            className="img-fluid"
            width={500}
            height={360}
            alt="Resume templates"
          />
        </div>
      </section>

      <section className="template-content-page py-custom pb-120">
        <div className="container-fluid custom-container">
          <div className="template-content-grid">
            {TEMPLATE_CONTENT.map((template) => (
              <article className="template-content-card" key={template.id}>
                <div className="template-card-top">
                  <span>{template.role}</span>
                  <span>{template.layout === "two-column" ? "Two Column" : "Single Column"}</span>
                </div>
                <h2>{template.title}</h2>
                <p>{template.note}</p>
                <ul>
                  {template.content.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="template-card-actions">
                  <button
                    type="button"
                    className="template-card-start"
                    onClick={() => createResumeFromTemplate(template, dispatch, router, setLoading, setLoadingTemplateId)}
                    disabled={loading}
                  >
                    {loading && loadingTemplateId === template.id ? "Opening..." : "Create Resume"}
                  </button>
                  <Link
                    className="template-card-read"
                    href={`/templates/${template.slug}/`}
                  >
                    Read Template
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <FooterNav />
    </>
  );
}

export default function ResumeTemplateContentClient() {
  return (
    <ReduxProvider>
      <ResumeTemplateContentInner />
    </ReduxProvider>
  );
}
