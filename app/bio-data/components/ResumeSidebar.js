'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setProgressPercent } from '../reducer/resume-reducer';
import {
  canOpenStep,
  getStepPath,
  isStepComplete,
  resumeSteps,
} from '../utils/stepProgress';

const stepIcons = {
  personal_info: 'personal-info.svg',
  summary: 'summary-and-objective.svg',
  education: 'education.svg',
  certificate: 'certification.svg',
  skill: 'skills.svg',
  work_experience: 'work-experience.svg',
  social_media: 'social-media.svg',
  internship: 'internship.svg',
  language: 'language.svg',
  hobbie: 'hobbies.svg',
};

export default function ResumeSidebar() {
  const [isHydrated, setIsHydrated] = useState(false);
  const searchParams = useSearchParams();
const id = searchParams.get('id');
  const pathname = usePathname();
  const dispatch = useDispatch();
  const resume = useSelector((state) =>
    Array.isArray(state.resume.resumes)
      ? state.resume.resumes.find((item) => item.id === id)
      : undefined
  );

  const completedSteps = resumeSteps.filter((step) => isStepComplete(resume, step.key)).length;
  const progress = Math.round((completedSteps / resumeSteps.length) * 100);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    dispatch(setProgressPercent(progress));
  }, [dispatch, progress]);


  useEffect(() => {
  if (typeof window !== "undefined" && window.bootstrap) {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );

    tooltipTriggerList.forEach((el) => {
      new window.bootstrap.Tooltip(el);
    });
  }
}, [isHydrated]);

  if (!isHydrated) return null;

  const collapsedSidebar = () => {
    const sidebarArea = document.querySelector('.resume-sidebar');
    if (!sidebarArea) return;
    sidebarArea.classList.toggle('collapsed');
  };

  const renderStepLink = (step, mobile = false) => {
    const href = getStepPath(step, id);
    const isActive = pathname === href;
    const isDone = isStepComplete(resume, step.key);
    const isLocked = !canOpenStep(resume, step.segment);

    return (
      <Link prefetch={false}
        key={`${mobile ? 'mobile' : 'desktop'}-${step.key}`}
        href={href}
        className={`each-sidebar-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title={step.label}
        aria-disabled={isLocked}
        onClick={(event) => {
  if (isLocked) {
    event.preventDefault();
    return;
  }

  // Close Bootstrap Offcanvas
  if (typeof window !== "undefined" && window.bootstrap) {
    const offcanvasEl = document.getElementById("stepsOffcanvas");

    if (offcanvasEl) {
      const instance =
        window.bootstrap.Offcanvas.getInstance(offcanvasEl) ||
        new window.bootstrap.Offcanvas(offcanvasEl);

      instance.hide();
    }
  }
}}
        style={isLocked ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
      >
        <img src="/front-assets/images/icons/step-done.svg" width={22} height={22} className={`${isDone ? 'step-done d-block' : 'd-none'}`} alt="Check" />
        <img src={`/front-assets/images/icons/${stepIcons[step.key]}`} alt={step.label} />
        <span>{step.label}</span>
      </Link>
    );
  };

  return (
    <>
      <div className='resume-sidebar '>
        <div className="header">
          <div className='left-side'>
            <p>Progress</p>
            <div className='progress-bar-div'>
              <div className='progress-bar'>
                <div style={{ width: progress + '%' }}></div>
              </div>
              {progress}%
            </div>
          </div>

          <button className='right-side-btn' onClick={collapsedSidebar}>
            <img src="/front-assets/images/icons/collapse-btn.svg" alt="Collapse" />
          </button>
        </div>

        <div className="scroll-div">
          {resumeSteps.map((step) => renderStepLink(step))}
        </div>
      </div>

      <div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="stepsOffcanvas" aria-labelledby="stepsOffcanvasLabel">
        <div className='offcanvas-resume-sidebar'>
          <div className="header">
            <div className='left-side'>
              <p>Progress</p>
              <div className='progress-bar-div'>
                <div className='progress-bar'>
                  <div style={{ width: progress + '%' }}></div>
                </div>
                {progress}%
              </div>
            </div>

            <button className='right-side-btn' data-bs-dismiss="offcanvas" aria-label="Close">
              <img src="/front-assets/images/icons/close-cross.svg" alt="close" />
            </button>
          </div>

          <div className="scroll-div">
            {resumeSteps.map((step) => renderStepLink(step, true))}
          </div>
        </div>
      </div>
    </>
  );
}
