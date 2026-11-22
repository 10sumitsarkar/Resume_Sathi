import BlogPageClient from './BlogPageClient';
import { getBlogArticles, getBlogCategories } from './blogData';
import { BLOG_PAGE_SIZE } from './blogRoutes';
import { DEFAULT_SITE_BASE } from '../lib/apiConfig';

const SITE_URL = DEFAULT_SITE_BASE.replace(/\/+$/, '');

const articles = getBlogArticles();
const categories = getBlogCategories();

export const metadata = {
  title: 'Career Blog with Resume and Interview Tips',
  description: 'Explore expert blog articles on resumes, interviews, career growth, and job search strategies.',
  alternates: { canonical: `${SITE_URL}/blog/` },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    title: 'Career Blog with Resume and Interview Tips - ResumeSathi',
    description: 'Explore expert blog articles on resumes, interviews, career growth, and job search strategies.',
    type: 'website',
    url: `${SITE_URL}/blog/`,
    siteName: 'ResumeSathi',
    images: [{ url: `${SITE_URL}/front-assets/images/og/blog-og.webp`, width: 1200, height: 630, alt: 'ResumeSathi Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Blog with Resume and Interview Tips - ResumeSathi',
    description: 'Explore expert blog articles on resumes, interviews, career growth, and job search strategies.',
    images: [`${SITE_URL}/front-assets/images/og/blog-og.webp`],
  },
};

export default function BlogPage() {
  return (
    <BlogPageClient
      initialArticles={articles}
      initialCategories={categories}
      initialPage={1}
      initialPageSize={BLOG_PAGE_SIZE}
      paginationBase="/blog/"
    />
  );
}
