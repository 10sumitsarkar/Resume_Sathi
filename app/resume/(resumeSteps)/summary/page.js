import { Suspense } from 'react';
import SummaryClient from "./SummaryClient";

export const metadata = {
  title: 'Professional Summary | ResumeSathi',
  description: 'Create a professional resume in minutes with ResumeSathi resume builder.',
};

export default function ResumeTypeClientWrapper() {
 return (
     <Suspense fallback={<div>Loading...</div>}>
      <SummaryClient />;
     </Suspense>
   );
}
