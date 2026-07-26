"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LESSONS, getLesson } from "../../_lib/lessons";
import LessonRunner from "../../_components/LessonRunner";

// NOTE: this used to be a dynamic route (`learn/[lessonId]/page.js`).
// Dynamic route segments need server-side routing / rewrites that most
// shared hosting setups don't support, so this is now a single static
// path (`/typing/learn/lesson`) and the lesson is picked with a normal
// query string: `/typing/learn/lesson?id=home-row`.

function LessonContent() {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("id");
  const lesson = getLesson(lessonId);

  if (!lesson) {
    return (
      <div className="tf-animate-rise">
        <div className="container-fluid custom-container">
          <div className="tf-card p-4 p-sm-5 text-center">
            <p className="tf-text-muted mb-4">
              This lesson couldn't be found. The link may be incorrect.
            </p>
            <Link
              href="/typing/learn"
              prefetch={false}
              className="tf-btn-brand tf-brand-glow btn fw-medium px-4 py-2"
            >
              View all lessons
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const idx = LESSONS.findIndex((l) => l.id === lesson.id);
  const next = LESSONS[idx + 1] ?? null;

  return <LessonRunner lesson={lesson} nextLesson={next} />;
}

export default function LessonPage() {
  return (
    <Suspense fallback={null}>
      <LessonContent />
    </Suspense>
  );
}
