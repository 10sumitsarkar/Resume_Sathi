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
  const pages = {
    "/resume": {
      title: "Free Resume Builder",
      paragraphs: [
        "Create a resume with guided sections for your profile, education, work experience, skills, and projects. Choose a layout, review the preview, and export a copy when it is ready.",
        "Your resume details are saved in this browser so you can continue editing on the same device. Keep your own backup if you clear browser data or move to another device.",
      ],
      href: "/templates/",
      linkText: "Browse resume templates",
    },
    "/resume/resume-type": {
      title: "Build a Resume Step by Step",
      paragraphs: [
        "Start with a blank resume or import an existing file, then review each section before choosing a template. The builder supports personal details, a profile summary, education, experience, internships, skills, languages, certificates, and social links.",
        "Use specific, accurate examples that match the role you are applying for. Review the finished document carefully before sending it to an employer.",
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
      <Link href={page.href}>{page.linkText}</Link>
    </main>
  );
}

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  return (
    <ReduxProvider loading={getPersistenceFallback(pathname)}>
      {pathname !== "/resume" && <NavBar />}
      <StepAccessGuard>{children}</StepAccessGuard>
    </ReduxProvider>
  );
}
