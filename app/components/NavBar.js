'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
    const [ddOpen, setDdOpen] = useState(false);
    const [offcanvasOpen, setOffcanvasOpen] = useState(false);
    const [offcanvasDdOpen, setOffcanvasDdOpen] = useState(false);
    const pathname = usePathname();
    const isResumePage = pathname?.startsWith('/resume/');
    const isResumeActive = pathname.startsWith('/resume');
    const isToolsActive = pathname.startsWith('/tools');
    const isBlogActive = pathname.startsWith('/blog');

    const closeAll = () => {
        setDdOpen(false);
        setOffcanvasOpen(false);
        setOffcanvasDdOpen(false);
    };

    return (
        <>
            <nav className='navbar'>
                <div className="container-fluid custom-container d-flex align-items-center justify-content-between">

                    <Link href="/" onClick={closeAll}>
                        <img src="/front-assets/images/logo/logo.svg" className='img-fluid nav-logo' width={250} height={52} alt="Logichook" />
                    </Link>

                    <div className="d-flex align-items-center gap-2">

                        {/* Desktop Links */}
                        <div className="d-none d-lg-flex align-items-center gap-1">

                            <Link href="/resume" className={`nav-link ${isResumeActive ? 'active' : ''}`}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                                Resume / CVs
                            </Link>
                            <Link href="/tools" className={`nav-link ${isToolsActive ? 'active' : ''}`}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                </svg>
                                Tools
                            </Link>
                            <Link href="/government-jobs" className='nav-link'>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" />
                                    <line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" />
                                    <polygon points="12 2 20 7 4 7" />
                                </svg>
                                Gov. Jobs
                            </Link>
                            <Link href="/blog" className={`nav-link ${isBlogActive ? 'active' : ''}`}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16v16H4z" /><line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
                                </svg>
                                Blog
                            </Link>
                        </div>

                        {/* Create Resume — desktop, non-resume pages only */}
                        {!isResumePage && (
                            <Link href="/resume/resume-type" className='btn-create d-none d-lg-inline-flex'>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Create Resume
                            </Link>
                        )}

                        {/* Hamburger — mobile only */}
                        <button className="hamburger d-lg-none" onClick={() => setOffcanvasOpen(true)} aria-label="Open menu">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Offcanvas Overlay */}
            <div className={`offcanvas-overlay ${offcanvasOpen ? 'open' : ''}`} onClick={closeAll} />

            {/* Offcanvas Panel */}
            <div className={`offcanvas-panel ${offcanvasOpen ? 'open' : ''}`}>
                <div className="offcanvas-header">
                    <Link href="/" onClick={closeAll}>
                        <img src="/front-assets/images/logo/logo.svg" className='img-fluid' width={160} height={35} alt="Logichook" />
                    </Link>
                    <button className="offcanvas-close" onClick={closeAll} aria-label="Close menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="offcanvas-body">
                    {isResumePage && (
                        <>
                            <p className="offcanvas-section-label">Menu</p>

                            <Link href="/resume" className="offcanvas-link" onClick={closeAll}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                                Resume/CVs
                            </Link>
                            <Link href="/tools" className="offcanvas-link" onClick={closeAll}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                </svg>
                                Tools
                            </Link>
                            <Link href="/government-jobs" className="offcanvas-link" onClick={closeAll}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" />
                                    <line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" />
                                    <polygon points="12 2 20 7 4 7" />
                                </svg>
                                Gov. Jobs
                            </Link>
                            <Link href="/blog" className="offcanvas-link" onClick={closeAll}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16v16H4z" /><line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
                                </svg>
                                Blog
                            </Link>
                        </>
                    )}

                    {!isResumePage && (
                        <Link href="/resume/resume-type" className="btn-create offcanvas-btn-create" onClick={closeAll}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Create Resume
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}