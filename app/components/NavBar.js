'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar({ className = "" }) {
    const [ddOpen, setDdOpen] = useState(false);
    const [offcanvasOpen, setOffcanvasOpen] = useState(false);
    const [offcanvasDdOpen, setOffcanvasDdOpen] = useState(false);
    const pathname = usePathname();
    const isResumePage = pathname?.startsWith('/resume/');
    const isResumeActive = pathname.startsWith('/resume');
    const isToolsActive = pathname.startsWith('/tools');
    const isBlogActive = pathname.startsWith('/blog');
    const isJobActive = pathname.startsWith('/jobs');

    const closeAll = () => {
        setDdOpen(false);
        setOffcanvasOpen(false);
        setOffcanvasDdOpen(false);
    };

    return (
        <>
            <nav className={`navbar ${className}`.trim()}>
                <div className="container-fluid custom-container d-flex align-items-center justify-content-between">

                    <Link prefetch={false} href="/" onClick={closeAll} style={{ display: 'inline-flex', alignItems: 'center', minWidth: 160, minHeight: 38 }}>
                        <img src="/front-assets/images/logo/logo.svg" className='img-fluid nav-logo' width={250} height={52} alt="ResumeSathi" style={{ display: 'block' }} />
                    </Link>

                    <div className="d-flex align-items-center gap-2">

                        {/* Desktop Links */}
                        <div className="d-none d-lg-flex align-items-center gap-1">

                            <Link prefetch={false} href="/resume/" className={`nav-link ${isResumeActive ? 'active' : ''}`}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                                Resume / CVs
                            </Link>
                            <Link prefetch={false} href="/tools/" className={`nav-link ${isToolsActive ? 'active' : ''}`}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                </svg>
                                Tools
                            </Link>
                            <Link prefetch={false} href="/jobs/" className={`nav-link ${isJobActive ? 'active' : ''}`}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" />
                                    <line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" />
                                    <polygon points="12 2 20 7 4 7" />
                                </svg>
                                Jobs
                            </Link>
                            <Link prefetch={false} href="/blog/" className={`nav-link ${isBlogActive ? 'active' : ''}`}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16v16H4z" /><line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
                                </svg>
                                Blog
                            </Link>
                        </div>

                        {/* Create Resume — desktop, non-resume pages only */}
                        {!isResumePage && (
                            <Link prefetch={false} href="/resume/resume-type/" className='btn-create d-none d-lg-inline-flex'>
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
                    <Link prefetch={false} href="/" onClick={closeAll} style={{ display: 'inline-flex', alignItems: 'center', minWidth: 120, minHeight: 30 }}>
                        <img src="/front-assets/images/logo/logo.svg" className='img-fluid' width={160} height={35} alt="ResumeSathi" style={{ display: 'block' }} />
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

                            <Link prefetch={false} href="/resume/" className="offcanvas-link" onClick={closeAll}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                                Resume/CVs
                            </Link>
                            <Link prefetch={false} href="/tools/" className="offcanvas-link" onClick={closeAll}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                </svg>
                                Tools
                            </Link>
                            <Link prefetch={false} href="/jobs/" className="offcanvas-link" onClick={closeAll}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" />
                                    <line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" />
                                    <polygon points="12 2 20 7 4 7" />
                                </svg>
                                Jobs
                            </Link>
                            <Link prefetch={false} href="/blog/" className="offcanvas-link" onClick={closeAll}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16v16H4z" /><line x1="8" y1="9" x2="16" y2="9" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
                                </svg>
                                Blog
                            </Link>
                        </>
                    )}

                                       <>
                                       <Link prefetch={false} href="/bio-data/" className="offcanvas-link" onClick={closeAll}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <path d="M14 2v6h6" />
                                    <path d="M8 13h8" />
                                    <path d="M8 17h5" />
                                    <path d="M8 9h2" />
                                </svg>
                                Bio Data
                            </Link>
                         <Link prefetch={false} href="/privacy-policy/" className="offcanvas-link" onClick={closeAll}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
    Privacy Policy
</Link>

<Link prefetch={false} href="/terms-and-conditions/" className="offcanvas-link" onClick={closeAll}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
    </svg>
    Terms & Conditions
</Link>

<Link prefetch={false} href="/about/" className="offcanvas-link" onClick={closeAll}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
    About Us
</Link>

<Link prefetch={false} href="/contact/" className="offcanvas-link" onClick={closeAll}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
    Contact
</Link>

<Link prefetch={false} href="/disclaimer/" className="offcanvas-link" onClick={closeAll}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    Disclaimer
</Link>
                        </>

                    {!isResumePage && (
                        <Link prefetch={false} href="/resume/resume-type/" className="btn-create offcanvas-btn-create" onClick={closeAll}>
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
