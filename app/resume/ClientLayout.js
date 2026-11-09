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
