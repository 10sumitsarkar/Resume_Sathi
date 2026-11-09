import EditorialPolicyClient from './client';

export const metadata = {
  title: 'Editorial Policy',
  description:
    'How ResumeSathi prepares, updates, sources, and corrects career articles and exam guides.',
  alternates: {
    canonical: '/editorial-policy/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EditorialPolicyPage() {
  return <EditorialPolicyClient />;
}
