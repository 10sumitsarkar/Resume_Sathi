import { Suspense } from 'react';
import WorkExperienceClient from "./WorkExperienceClient";

export const metadata = {
  title: 'Work Experience | ResumeSathi',
  description: 'Create a professional resume in minutes with ResumeSathi resume builder.',
};

export default function ResumeTypeClientWrapper() {
   return (
       <Suspense fallback={<div>Loading...</div>}>
       <WorkExperienceClient />
       </Suspense>
     );
}
