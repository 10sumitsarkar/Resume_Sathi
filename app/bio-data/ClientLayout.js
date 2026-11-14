"use client";

import { Suspense, useEffect } from "react";
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

// Renders nothing. It is a sibling of {children} (not a wrapper) so that
// useSearchParams() can sit in its own Suspense boundary without pulling the
// whole page out of the server-rendered HTML.
function StepAccessGuard() {
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

  return null;
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
  // /bio-data has server-rendered content that does not need persisted data,
  // so it must not wait for rehydration. Only the saved bio-data cards need it,
  // and ResumeLists shows its own placeholder until the data arrives.
  const isBioDataHome = (pathname || "").replace(/\/+$/, "") === "/bio-data";

  return (
    <ReduxProvider
      loading={getPersistenceFallback(pathname)}
      gate={!isBioDataHome}
    >
      {pathname !== "/bio-data" && <NavBar />}
      <Suspense fallback={null}>
        <StepAccessGuard />
      </Suspense>
      {children}
    </ReduxProvider>
  );
}