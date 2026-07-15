import { Suspense } from 'react';
import SocialMediaClient from "./SocialMediaClient";

export const metadata = {
  title: 'Social Media | ResumeSathi',
  description: 'Create a professional resume in minutes with Logichook resume builder.',
};

export default function ResumeTypeClientWrapper() {
    return (
         <Suspense fallback={<div>Loading...</div>}>
         <SocialMediaClient />;
         </Suspense>
       );
}
