import React from 'react';
import NavBar from './NavBar'
import ResumeSidebar from './ResumeSidebar'
import ReviewResume from './ReviewResume'

export default function ResumeLayout({ children }) {
  return (
    <>
      <NavBar />
      <ResumeSidebar />
      {children}
      <ReviewResume />
    </>
  );
}
