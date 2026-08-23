import { notFound } from "next/navigation";
import LessonRunner from "../../../_components/LessonRunner";
import { LESSONS, getLesson } from "../../../_lib/lessons";
import { DEFAULT_SITE_BASE, withTrailingSlash } from "../../../../lib/apiConfig";

const SITE_URL = DEFAULT_SITE_BASE.replace(/\/+$/, "");

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ id: lesson.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) {
    return {
      title: "Typing Lesson Not Found | ResumeSathi",
      robots: { index: false, follow: true },
    };
  }

  const path = withTrailingSlash(`/typing/learn/lesson/${lesson.id}`);
  const title = `${lesson.title} Typing Lesson | ResumeSathi`;
  const description = `${lesson.goal} Practice this free touch typing lesson on ResumeSathi.`;

  return {
    title,
    description,
    keywords: [
      "typing lesson",
      "touch typing practice",
      "free typing tutor",
      lesson.title,
      ...lesson.newKeys,
    ],
    alternates: {
      canonical: `${SITE_URL}${path}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      type: "website",
      siteName: "ResumeSathi",
      images: [
        {
          url: `${SITE_URL}/front-assets/images/og/home-og.png`,
          width: 1200,
          height: 630,
          alt: "ResumeSathi typing lesson practice",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/front-assets/images/og/home-og.png`],
    },
  };
}

export default async function LessonDetailPage({ params }) {
  const { id } = await params;
  const lesson = getLesson(id);

  if (!lesson) {
    notFound();
  }

  const idx = LESSONS.findIndex((item) => item.id === lesson.id);
  const next = LESSONS[idx + 1] ?? null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LearningResource",
            name: `${lesson.title} Typing Lesson`,
            description: lesson.goal,
            url: `${SITE_URL}${withTrailingSlash(`/typing/learn/lesson/${lesson.id}`)}`,
            learningResourceType: "Practice",
            educationalUse: "Typing practice",
            provider: {
              "@type": "Organization",
              name: "ResumeSathi",
              url: SITE_URL,
            },
          }),
        }}
      />
      <LessonRunner lesson={lesson} nextLesson={next} />
    </>
  );
}
