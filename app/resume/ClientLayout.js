"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import ReduxProvider from "./store/reduxProvider";
import NavBar from "../components/NavBar";
import Link from "next/link";
import {
  canOpenStep,
  getFirstIncompleteStepIndex,
  getStepPath,
  getStepIndexBySegment,
  resumeSteps,
} from "./utils/stepProgress";

function StepAccessGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const resumes = useSelector((state) => state.resume.resumes);

  useEffect(() => {
    const match = pathname.match(/^\/resume\/([^/]+)\/([^/]+)$/);
    if (!match) return;

    const [, segment, id] = match;
    const resume = Array.isArray(resumes)
      ? resumes.find((item) => item.id === id)
      : undefined;
    if (!resume) return;

    const stepIndex = getStepIndexBySegment(segment);
    const firstIncompleteIndex = getFirstIncompleteStepIndex(resume);

    if (stepIndex !== -1 && !canOpenStep(resume, segment)) {
      router.replace(getStepPath(resumeSteps[firstIncompleteIndex], id));
    }
  }, [pathname, resumes, router]);

  return children;
}

function getPersistenceFallback(pathname) {
  const route = pathname.replace(/\/+$/, "") || "/";
  if (route === "/resume") {
    return (
      <>
        <section className="container-fluid custom-container small-hero-area">
          <div className="left-part">
            <div>
              <label className="tl-eyebrow fs-mob-12">
                Currently free to use • ATS-friendly
              </label>
              <h1 className="fs-mob-22">Free Resume Builder</h1>
            </div>
            <p className="fs-mob-16">
              Create a free ATS-friendly resume online, manage your resumes, and
              export them in PDF, Word, or text format.
            </p>
            <Link
              prefetch={false}
              className="rl-create-btn"
              href="/resume/resume-type/"
            >
              Create New Resume
            </Link>
          </div>
          <div className="right-part d-none d-md-block">
            <img
              src="/front-assets/images/resume-hero.webp"
              className="img-fluid"
              width={500}
              height={360}
              alt=""
            />
          </div>
        </section>
        <section className="resumelist-section py-custom" aria-busy="true">
          <div className="container-fluid custom-container" role="status">
            Loading your saved resumes...
          </div>
        </section>
      </>
    );
  }

  const pages = {
    "/resume/personal-info": {
      title: "Add Your Personal Information",
      paragraphs: ["Enter your name and current contact details. Use an email address and phone number you check regularly."],
    },
    "/resume/summary": {
      title: "Write Your Professional Summary",
      paragraphs: ["Briefly describe your experience, strengths, and the kind of role you want. Keep it specific and easy to verify."],
    },
    "/resume/education": {
      title: "Add Your Education",
      paragraphs: ["Add your latest degree first. College name, course, and year are enough to get started."],
    },
    "/resume/work-experience": {
      title: "Add Your Work Experience",
      paragraphs: ["For each role, write what you did and what result came out of it. Add dates and employer details you can verify."],
    },
    "/resume/internship": {
      title: "Add Your Internships",
      paragraphs: ["Include relevant internships with the organization, role, dates, and a few tasks or outcomes."],
    },
    "/resume/skill": {
      title: "List Your Skills",
      paragraphs: ["List only skills you could discuss in an interview for two minutes. Prioritize those relevant to the job."],
    },
    "/resume/language": {
      title: "Add Your Languages",
      paragraphs: ["List languages you can use and choose an honest proficiency level for each one."],
    },
    "/resume/hobbie": {
      title: "Add Your Interests",
      paragraphs: ["Include a few genuine interests that help describe you. Keep them brief and relevant to your application."],
    },
    "/resume/social-media": {
      title: "Add Professional Links",
      paragraphs: ["Add portfolio or professional profile links that support your application. Check that each link opens correctly."],
    },
    "/resume/certificate": {
      title: "Add Your Certificates",
      paragraphs: ["Include relevant certificates with their names, issuing organizations, and completion dates."],
    },
    "/resume/select-theme": {
      title: "Choose a Resume Template",
      paragraphs: ["Choose a layout that is easy to read and suits your experience. You can review your details before exporting."],
    },
    "/resume/upload-resume": {
      title: "Upload an Existing Resume",
      paragraphs: ["Upload a PDF or Word file, then check and update the extracted details before using them."],
    },
    "/resume/preview": {
      title: "Review Your Resume",
      paragraphs: ["Check your details, spelling, and layout before downloading. Make sure the final resume is ready for the role."],
    },
    "/resume/resume-type": {
      title: "Build a Resume Step by Step",
      paragraphs: [
        "Start with a blank resume or upload an existing file, then add accurate details for each section. Choose a readable template and review your resume before sharing.",
      ],
      href: "/templates/",
      linkText: "Compare resume templates",
    },
  };
  const page = pages[route];
  if (!page) return null;

  return (
    <main className="container-fluid custom-container py-5">
      <h1>{page.title}</h1>
      {page.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {page.href && <Link href={page.href}>{page.linkText}</Link>}
    </main>
  );
}

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  // /resume has server-rendered content that does not need persisted data,
  // so it must not wait for rehydration. Only the saved-resume cards need it,
  // and ResumeLists shows its own placeholder until the data arrives.
  const isResumeHome = (pathname || "").replace(/\/+$/, "") === "/resume";

  return (
    <ReduxProvider
      loading={getPersistenceFallback(pathname)}
      gate={!isResumeHome}
    >
      {pathname !== "/resume" && <NavBar />}
      <StepAccessGuard>{children}</StepAccessGuard>
    </ReduxProvider>
  );
}