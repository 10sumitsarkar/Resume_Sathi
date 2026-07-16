import { Suspense } from 'react';
import WorkExperienceClient from "./WorkExperienceClient";

export const metadata = {
  title: 'Work Experience | ResumeSathi',
  description: 'Create a professional resume in minutes with ResumeSathi resume builder.',
};

export default function ResumeTypeClientWrapper() {
   return (
       <Suspense fallback={
         <div className='loader-div'>
          <div className='loader-inner-div'>
            <div className="box" id="loader1"></div>
            <div className="box" id="loader2"></div>
            <div className="box" id="loader3"></div>
            <div className="box" id="loader4"></div>
            <div className="box" id="loader5"></div>
          </div>
         </div>
        }>
       <WorkExperienceClient />
       </Suspense>
     );
}
