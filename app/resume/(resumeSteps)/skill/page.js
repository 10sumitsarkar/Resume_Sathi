import { Suspense } from 'react';
import SkillClient from "./SkillClient";

export const metadata = {
  title: 'Skills | ResumeSathi',
  description: 'Create a professional resume in minutes with Logichook resume builder.',
};

export default function ResumeTypeClientWrapper() {
 return (
     <Suspense fallback={<div>Loading...</div>}>
      <SkillClient />
     </Suspense>
   );
}
