import { Suspense } from 'react';
import LanguageClient from "./LanguageClient";

export const metadata = {
  title: 'Languages | ResumeSathi',
  description: 'Create a professional resume in minutes with Logichook resume builder.',
};

export default function ResumeTypeClientWrapper() {
    return (
             <Suspense fallback={<div>Loading...</div>}>
             <LanguageClient />;
             </Suspense>
           );
}
