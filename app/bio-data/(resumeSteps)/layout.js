import React from 'react';
import ResumeSidebar from '../components/ResumeSidebar'
import ReviewResume from '../components/ReviewResume';

export default function RootLayout({ children }) {
    return (
        <>
            <ResumeSidebar />
            {children}
            <div className='form-review-resume-div'><ReviewResume /></div>
        </>
    );
}