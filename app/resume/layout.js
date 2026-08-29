// ❌ DO NOT use dynamic() or "use client" here
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'Resume Builder',
  description: 'Create a professional resume with ResumeSathi using guided sections, ATS-friendly templates, and browser-based editing.',
};

export default function RootLayout({ children }) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}

