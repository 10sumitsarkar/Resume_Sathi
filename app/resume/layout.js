// ❌ DO NOT use dynamic() or "use client" here
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'Your App',
  description: 'Your app description',
};

export default function RootLayout({ children }) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}

