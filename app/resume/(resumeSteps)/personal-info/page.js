import { Suspense } from 'react';
import PersonalInfoClient from "./PersonalInfoClient";

export const metadata = {
  title: 'Personal Information | ResumeSathi',
  description: 'Create a professional resume in minutes with ResumeSathi resume builder.',
};

export default function ResumeTypeClientWrapper() {
return (
    <Suspense fallback={<div>Loading...</div>}>
      <PersonalInfoClient />
    </Suspense>
  );
}
