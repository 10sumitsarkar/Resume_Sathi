// ❌ DO NOT use dynamic() or "use client" here
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'Bio-Data Maker',
  description: 'Create a printable bio-data with ResumeSathi using guided sections, photo-ready templates, and browser-based editing.',
};

export default function RootLayout({ children }) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}

