import { Suspense } from 'react';
import HobbieClient from "./HobbieClient";

export const metadata = {
  title: 'Hobbies | ResumeSathi',
  description: 'Create a professional resume in minutes with Logichook resume builder.',
};

export default function ResumeTypeClientWrapper() {
    return (
               <Suspense fallback={<div>Loading...</div>}>
               <HobbieClient />;
               </Suspense>
             );
}
