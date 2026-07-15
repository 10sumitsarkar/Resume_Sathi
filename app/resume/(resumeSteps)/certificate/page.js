import { Suspense } from 'react';
import CertificateClient from "./CertificateClient";

export const metadata = {
  title: 'Certificate | ResumeSathi',
  description: 'Create a professional resume in minutes with ResumeSathi resume builder.',
};

export default function ResumeTypeClientWrapper() {
   return (
       <Suspense fallback={<div>Loading...</div>}>
        <CertificateClient />;
       </Suspense>
     );
}
