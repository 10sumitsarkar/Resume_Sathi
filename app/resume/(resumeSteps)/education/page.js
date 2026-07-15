import { Suspense } from 'react';
import EducationClient from "./EducationClient";

export const metadata = {
  title: 'Education | ResumeSathi',
  description: 'Create a professional resume in minutes with ResumeSathi resume builder.',
};

export default function ResumeTypeClientWrapper() {
   return (
       <Suspense fallback={<div>Loading...</div>}>
        <EducationClient />;
       </Suspense>
     );
}
