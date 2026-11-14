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
  if (route === "/bio-data") {
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

  const pages = {
    "/bio-data/resume-type": {
      title: "Build a Bio-Data Step by Step",
      text: "Start with a blank bio-data or upload an existing file, then add accurate details. Choose a clear layout and review everything before printing.",
    },
    "/bio-data/personal-info": {
      title: "Add Your Personal Information",
      text: "Enter your name and current contact details. Include only personal information relevant to the purpose of this bio-data.",
    },
    "/bio-data/summary": {
      title: "Write a Short Profile",
      text: "Introduce yourself in a few clear sentences. Focus on the background and details relevant to your application.",
    },
    "/bio-data/education": {
      title: "Add Your Education",
      text: "Add your latest degree first. College name, course, and year are enough to get started.",
    },
    "/bio-data/work-experience": {
      title: "Add Your Work Experience",
      text: "For each role, write what you did and what result came out of it. Add dates and employer details you can verify.",
    },
    "/bio-data/internship": {
      title: "Add Your Internships",
      text: "Include relevant internships with the organization, role, dates, and a few tasks or outcomes.",
    },
    "/bio-data/skill": {
      title: "List Your Skills",
      text: "List practical skills that are relevant to your application and that you can explain with examples.",
    },
    "/bio-data/language": {
      title: "Add Your Languages",
      text: "List languages you can use and choose an honest proficiency level for each one.",
    },
    "/bio-data/hobbie": {
      title: "Add Your Interests",
      text: "Include a few genuine interests that help describe you. Keep them brief and relevant to your application.",
    },
    "/bio-data/social-media": {
      title: "Add Professional Links",
      text: "Add portfolio or professional profile links that support your application. Check that each link opens correctly.",
    },
    "/bio-data/select-theme": {
      title: "Choose a Bio-Data Layout",
      text: "Choose a clear, readable layout that suits your purpose. Review your information before exporting or printing.",
    },
    "/bio-data/upload-resume": {
      title: "Upload an Existing Bio-Data",
      text: "Upload a PDF or Word file, then check and update the extracted details before using them.",
    },
    "/bio-data/preview": {
      title: "Review Your Bio-Data",
      text: "Check names, dates, contact details, spelling, and layout before downloading or printing your bio-data.",
    },
  };
  const page = pages[route];
  if (!page) return null;

  return (
    <main className="container-fluid custom-container py-5">
      <h1>{page.title}</h1>
      <p>{page.text}</p>
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