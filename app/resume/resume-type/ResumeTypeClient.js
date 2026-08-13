'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setId } from '../reducer/resume-reducer';
import { useRouter } from 'next/navigation';

export default function ResumeTypeClient() {
    const dispatch = useDispatch();
    const router = useRouter();
    const pendingResume = useSelector((state) =>
        state.resume.resumes.find((resume) => resume.is_submitted === false)
    );

    const handleGetStarted = () => {
        if (pendingResume) {
            router.push(`/resume/personal-info/?id=${pendingResume.id}`);
            return;
        }

        const id = `${Date.now()}`;
        dispatch(setId(id));
        router.push(`/resume/select-theme/?id=${id}`);
    };

    return (
        <>
            <div className="container custom-container">
                <div className="resume-selector">
                    <img src="/front-assets/images/icons/resume.webp" alt="Resume" />
                    <h1 className="heading fs-mob-24">Build Your Professional Resume in Minutes!</h1>
                    <p className="sub-heading fs-mob-18">
                        Create a stunning, job-winning resume in just a few simple steps. No design skills required
                    </p>

                    <div className="buttons-div d-none d-md-flex">
                        <button className="started-button" onClick={handleGetStarted}>
                            Get Started
                        </button>
                        <a href="/resume/upload-resume" className="import-button">
                            <span className="bg"><span>Import your Resume</span></span>
                        </a>
                    </div>

                    <div className="mob-footer d-md-none">
                        <div className="mob-buttons-div">
                            <button className="started-button" onClick={handleGetStarted}>
                                Get Started
                            </button>
                            <a href="/resume/upload-resume" className="import-button">
                                <span className="bg"><span>Import Resume</span></span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
