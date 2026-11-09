"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const resumes = useSelector((state) => state.resume.resumes);

  useEffect(() => {
    const match = pathname.match(/^\/bio-data\/([^/]+)$/);
    if (!match) return;

    const [, segment] = match;
    const id = searchParams.get("id");
    if (!id) return;
    const resume = Array.isArray(resumes)
      ? resumes.find((item) => item.id === id)
      : undefined;
    if (!resume) return;

    const stepIndex = getStepIndexBySegment(segment);
    const firstIncompleteIndex = getFirstIncompleteStepIndex(resume);

    if (stepIndex !== -1 && !canOpenStep(resume, segment)) {
      router.replace(getStepPath(resumeSteps[firstIncompleteIndex], id));
    }
  }, [pathname, searchParams, resumes, router]);

  return children;
}

function getPersistenceFallback(pathname) {
  const route = pathname.replace(/\/+$/, "") || "/";
  if (route !== "/bio-data") return null;

  return (
    <main className="container-fluid custom-container py-5">
      <h1>Free Printable Bio-Data Maker</h1>
      <p>
        Create a clear, printable bio-data with sections for personal details,
        education, work, languages, and other information required for its
        purpose. Choose a layout, review every detail, and export or print the
        finished document.
      </p>
      <p>
        Include only information relevant to the application or recipient.
        Check names, dates, and contact details before sharing your bio-data.
        Your working document is saved in this browser.
      </p>
      <Link href="/bio-data/resume-type/">Start a bio-data</Link>
    </main>
  );
}

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  return (
    <ReduxProvider loading={getPersistenceFallback(pathname)}>
      {pathname !== "/bio-data" && <NavBar />}
      <StepAccessGuard>{children}</StepAccessGuard>
    </ReduxProvider>
  );
}
