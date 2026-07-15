import React from 'react';
import Link from 'next/link';
import NavBar from './components/NavBar';

export const metadata = {
  title: 'Page Not Found | ResumeSathi',
  description: 'The page you are looking for could not be found on ResumeSathi.',
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
                  <Link prefetch={false} href="/" className="link-404">Go to Home</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
