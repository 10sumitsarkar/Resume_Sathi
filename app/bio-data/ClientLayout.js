"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import ReduxProvider from "./store/reduxProvider";
import NavBar from "../components/NavBar";
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

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const normalizedPath = pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;
    const shouldHideContent = !["/bio-data", "/bio-data/resume-type", "/bio-data/upload-resume"].includes(normalizedPath);

    document.body.classList.toggle("bio-data-flow-content-hidden", shouldHideContent);
    return () => document.body.classList.remove("bio-data-flow-content-hidden");
  }, [pathname]);

  return (
    <ReduxProvider>
      {pathname !== "/bio-data" && <NavBar />}
      <StepAccessGuard>{children}</StepAccessGuard>
    </ReduxProvider>
  );
}
