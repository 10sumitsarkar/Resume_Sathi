'use client';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LESSONS, getLesson } from '../../_lib/lessons';
import LessonRunner from '../../_components/LessonRunner';

function LessonContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const lessonId = searchParams.get('id');
	const lesson = getLesson(lessonId);

	useEffect(() => {
		if (lesson) {
			router.replace(`/typing/learn/lesson/${lesson.id}/`);
		}
	}, [lesson, router]);

	if (!lesson) {
		return (
			<div className="tf-animate-rise">
				<div className="container-fluid custom-container">
					<div className="tf-card p-4 p-sm-5 text-center">
						<p className="tf-text-muted mb-4">
							This lesson couldn't be found. The link may be incorrect.
						</p>
						<Link href="/typing/learn" prefetch={false} className="tf-btn-brand tf-brand-glow btn fw-medium px-4 py-2">
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
		<Suspense fallback={<div>Loading lesson...</div>}>
			<LessonContent />
		</Suspense>
	);
}
