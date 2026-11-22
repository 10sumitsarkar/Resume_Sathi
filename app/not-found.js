import React from 'react';
import Link from 'next/link';
import NavBar from './components/NavBar';

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found on ResumeSathi.',
  robots: { index: false, follow: true },
};

export default function Error404() {
  return (
    <>
      <NavBar />
      <section className="page-404">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="col-sm-10 offset-sm-1 text-center">
                <div className="four-zero-four-bg">
                  <h1 className="text-center">404</h1>
                </div>

                <div className="contant-box-404">
                  <h3 className="h2">Looks like you are lost</h3>
                  <p>The page you are looking for is not available.</p>
                  <nav className="d-flex flex-wrap justify-content-center gap-3 mt-4" aria-label="Helpful links">
                    <Link prefetch={false} href="/" className="link-404">Home</Link>
                    <Link prefetch={false} href="/blog/" className="link-404">Blog</Link>
                    <Link prefetch={false} href="/tools/" className="link-404">Tools</Link>
                    <Link prefetch={false} href="/templates/" className="link-404">Templates</Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
