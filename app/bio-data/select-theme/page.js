import { Suspense } from 'react';
import SelectThemeClient from "./SelectThemeClient";


export const metadata = {
  title: 'Choose Your Bio-Data Theme',
  description: 'Pick from professional templates to create your resume.',
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function SelectThemePage() {
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
          <SelectThemeClient />;
         </Suspense>
       );
}
