"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const normalizedPath = pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;
    const shouldHideContent = !["/resume", "/resume/resume-type", "/resume/upload-resume"].includes(normalizedPath);

    document.body.classList.toggle("resume-flow-content-hidden", shouldHideContent);
    return () => document.body.classList.remove("resume-flow-content-hidden");
  }, [pathname]);

  return (
    <ReduxProvider>
      {pathname !== "/resume" && <NavBar />}
      <StepAccessGuard>{children}</StepAccessGuard>
    </ReduxProvider>
  );
}
