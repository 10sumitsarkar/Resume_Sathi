import { Suspense } from 'react';
import SelectThemeClient from "./SelectThemeClient";


export const metadata = {
  title: 'Choose Your Resume Theme',
  description: 'Pick from professional templates to create your resume.',
};

export default function SelectThemePage() {
    return (
         <Suspense fallback={<div>Loading...</div>}>
          <SelectThemeClient />;
         </Suspense>
       );
}
