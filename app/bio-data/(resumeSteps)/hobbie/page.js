import { Suspense } from 'react';
import HobbieClient from "./HobbieClient";

export const metadata = {
  title: 'Hobbies | ResumeSathi',
  description: 'Create a printable bio-data in minutes with Logichook bio-data maker.',
 robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
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
               <HobbieClient />;
               </Suspense>
             );
}
