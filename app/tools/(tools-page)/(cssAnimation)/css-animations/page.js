import CssAnimations from "./CssAnimations";

export const metadata = {
  title: 'CSS Animation Generator | ResumeSathi',
  description: 'Create beautiful CSS animations for your website, landing page, or resume project with ResumeSathi’s free animation tool.',
  keywords: ['CSS animation generator', 'animation css', 'web animation tool', 'CSS effects'],
  alternates: { canonical: '/tools/css-animations/' },
  openGraph: {
    title: 'CSS Animation Generator | ResumeSathi',
    description: 'Create beautiful CSS animations for your website, landing page, or resume project with ResumeSathi’s free animation tool.',
    url: '/tools/css-animations/',
    type: 'website',
    siteName: 'ResumeSathi',
    images: [{ url: '/front-assets/images/og/home-og.png', width: 1200, height: 630, alt: 'CSS animation generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CSS Animation Generator | ResumeSathi',
    description: 'Create beautiful CSS animations for your website, landing page, or resume project with ResumeSathi’s free animation tool.',
    images: ['/front-assets/images/og/home-og.png'],
  },
};

export default function ResumeTypeClientWrapper() {
  return <CssAnimations />;
}
