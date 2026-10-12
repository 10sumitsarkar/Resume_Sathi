import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Banner300x250 } from '../../components/ads';

const sidebarIconStyle = { width: 18, height: 18, flexShrink: 0 };

const SidebarIcon = ({ name }) => {
  const icons = {
    resume: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <path d="M7 3.5h7l5 5V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2z" />
        <path d="M14 3.5V9h5" />
        <path d="M8.5 13h7" />
        <path d="M8.5 16.5h7" />
      </svg>
    ),
    pdf: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <path d="M7 3.5h7l5 5V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2z" />
        <path d="M14 3.5V9h5" />
        <path d="M8.5 13h6.5a2.5 2.5 0 1 1 0 5H8.5v-5z" />
      </svg>
    ),
    utility: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M4.93 4.93l2.83 2.83" />
        <path d="M16.24 16.24l2.83 2.83" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="M4.93 19.07l2.83-2.83" />
        <path d="M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    ),
    ats: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <path d="M9 11.5l2 2 4-4" />
        <rect x="3.5" y="4" width="17" height="16" rx="3" />
        <path d="M8 3.5V7" />
        <path d="M16 3.5V7" />
      </svg>
    ),
    merge: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <path d="M7 4.5h7l5 5V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2z" />
        <path d="M14 4.5V9h5" />
        <path d="M8 13h8" />
        <path d="M8 16h8" />
      </svg>
    ),
    split: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <path d="M7 3.5h7l5 5V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2z" />
        <path d="M14 3.5V9h5" />
        <path d="M8 12.5h8" />
        <path d="M8 16h8" />
        <path d="M11 7.5h2" />
      </svg>
    ),
    remove: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <path d="M7 3.5h7l5 5V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2z" />
        <path d="M14 3.5V9h5" />
        <path d="M8.5 13.5h7" />
        <path d="M9.5 16.5h5" />
        <path d="M10 9.5h4" />
      </svg>
    ),
    compress: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <path d="M7 3.5h7l5 5V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2z" />
        <path d="M14 3.5V9h5" />
        <path d="M8.5 13.5h7" />
        <path d="M8.5 16.5h7" />
        <path d="M8 9.5h2" />
      </svg>
    ),
    docx: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <path d="M7 3.5h7l5 5V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2z" />
        <path d="M14 3.5V9h5" />
        <path d="M8.5 13.5l2 5 2-5 2 5" />
      </svg>
    ),
    image: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <rect x="3.5" y="5" width="17" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.8" />
        <path d="M7.5 16l3.5-3.5 2.5 2.5 3.5-4 3.5 5H7.5z" />
      </svg>
    ),
    age: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <rect x="3.5" y="4.5" width="17" height="16" rx="3" />
        <path d="M8 2.8v3.5" />
        <path d="M16 2.8v3.5" />
        <path d="M8 11.5h8" />
        <path d="M12 11.5v5" />
      </svg>
    ),
    remover: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <path d="M7 7h10v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7z" />
        <path d="M4 7h16" />
        <path d="M10 7V4.5h4V7" />
        <path d="M9.5 11.5l5 5" />
        <path d="M14.5 11.5l-5 5" />
      </svg>
    ),
    signature: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <path d="M3 17c1.8-2.3 3.7-3.5 5.7-3.5 1.8 0 3 1 4.3 3.2 1.1 1.8 2.4 3.3 6 3.3" />
        <path d="M8 7.5c0-2.1 1.3-3.5 3.2-3.5 2 0 3.3 1.5 3.3 3.8 0 2.3-1.2 3.8-3.3 3.8S8 10 8 7.5z" />
        <path d="M6 18h12" />
      </svg>
    ),
    typing: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
        <path d="M7 10h10" />
        <path d="M7 14h6" />
        <path d="M7 8.5h2" />
      </svg>
    ),
    card: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={sidebarIconStyle}>
        <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
        <path d="M8 9.5h8" />
        <path d="M8 13h5" />
        <circle cx="16.5" cy="13" r="1.7" />
      </svg>
    ),
  };

  return icons[name] || icons.resume;
};

export default function ToolsSidebar({ showDesktopSidebar = true }) {

  const pathname = usePathname();
  const isActive = (href) => pathname === href || pathname === `${href}/`;


  const [sideBtn, setSideBtn] = useState()

  // Sidebar collapse start
  const collapsedSidebar = () => {
    const sidebarArea = document.querySelector('.tools-sidebar');
    if (sidebarArea.classList.contains('collapsed')) {
      sidebarArea.classList.remove('collapsed');
    } else {
      sidebarArea.classList.add('collapsed');
    }
  }
  // Sidebar collapse end

  // Show hide sidebar items start
  const showHideItems = (btn) => {
    const sidebarArea = document.querySelector('.tools-sidebar');
    if (sidebarArea) {
      if (window.innerWidth < 991) {
        if (!sidebarArea.classList.contains('collapsed')) {
          sidebarArea.classList.add('collapsed');
        }
      }
      else {
        sidebarArea.classList.remove('collapsed');
      }
    }
    setSideBtn(btn);
  }
  // Show hide sidebar items end

  // Close offcanvas on link click (navigation still happens via Link)
  const closeOffcanvas = () => {
    if (typeof window !== "undefined" && window.bootstrap) {
      const offcanvasEl = document.getElementById('commonOffcanvas');
      if (offcanvasEl) {
        const instance = window.bootstrap.Offcanvas.getInstance(offcanvasEl)
          || new window.bootstrap.Offcanvas(offcanvasEl);
        instance.hide();
      }
    }
  }
  // Close offcanvas end

  // Tooltip start
useEffect(() => {
  if (typeof window !== "undefined" && window.bootstrap) {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );

    tooltipTriggerList.forEach((el) => {
      new window.bootstrap.Tooltip(el);
    });
  }
}, []);
  // Tooltip end

  return (
    <>
      {showDesktopSidebar && <div className='tools-sidebar '>
        <div className="header">
          <div className='left-side'>
            <p>Tools</p>

          </div>

          <button className='right-side-btn' onClick={collapsedSidebar}>
            <img src="/front-assets/images/icons/collapse-btn.svg" alt="Collapse" />
          </button>
        </div>

        <div className="scroll-div">
          <div className='main-item-div'>
            <button className={`each-sidebar-item ${sideBtn === 'btn1' ? 'active' : ''}`} onClick={() => showHideItems('btn1')} data-bs-toggle="tooltip" data-bs-placement="right" title="CSS Tools">
              <SidebarIcon name="resume" />
              <span>Resume</span>
            </button>

            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/ats-checker/" className={`each-sub-item ${isActive('/tools/ats-checker') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="ATS Checker">
                <SidebarIcon name="ats" />
                <span>ATS Checker</span>
              </Link>
            </div>

          </div>

          <div className='main-item-div'>
            <button className={`each-sidebar-item ${sideBtn === 'btn2' ? 'active' : ''}`} onClick={() => showHideItems('btn2')} data-bs-toggle="tooltip" data-bs-placement="right" title="CSS Tools">
              <SidebarIcon name="pdf" />
              <span>PDF</span>
            </button>

            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/merge-pdf/" className={`each-sub-item ${isActive('/tools/merge-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Merge PDF">
                <SidebarIcon name="merge" />
                <span>Merge PDF</span>
              </Link>
            </div>

            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/split-pdf/" className={`each-sub-item ${isActive('/tools/split-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Split PDF">
                <SidebarIcon name="split" />
                <span>Split PDF</span>
              </Link>
            </div>

            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/pdf-remove/" className={`each-sub-item ${isActive('/tools/pdf-remove') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Remove PDF Pages">
                <SidebarIcon name="remove" />
                <span>Remove PDF Pages</span>
              </Link>
            </div>

            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/pdf-compressor/" className={`each-sub-item ${isActive('/tools/pdf-compressor') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Compress PDF">
                <SidebarIcon name="compress" />
                <span>Compress PDF</span>
              </Link>
            </div>
            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/docx-to-pdf/" className={`each-sub-item ${isActive('/tools/docx-to-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="DOCX to PDF">
                <SidebarIcon name="docx" />
                <span>DOCX to PDF</span>
              </Link>
            </div>
            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/image-to-pdf/" className={`each-sub-item ${isActive('/tools/image-to-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Image to PDF">
                <SidebarIcon name="image" />
                <span>Image to PDF</span>
              </Link>
            </div>

          </div>

          <div className='main-item-div'>
            <button className={`each-sidebar-item ${sideBtn === 'btn3' ? 'active' : ''}`} onClick={() => showHideItems('btn3')} data-bs-toggle="tooltip" data-bs-placement="right" title="Utility Tools">
              <SidebarIcon name="utility" />
              <span>Utility</span>
            </button>
            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/typing/" className={`each-sub-item ${isActive('/tools/typing') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Typing Practice">
                <SidebarIcon name="typing" />
                <span>Typing Practice</span>
              </Link>
            </div>
            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/id-card-maker/" className={`each-sub-item ${isActive('/tools/id-card-maker') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="ID Card Maker">
                <SidebarIcon name="card" />
                <span>ID Card Maker</span>
              </Link>
            </div>
            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/age-calculator/" className={`each-sub-item ${isActive('/tools/age-calculator') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Age Calculator">
                <SidebarIcon name="age" />
                <span>Age Calculator</span>
              </Link>
            </div>
            <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/background-remover/" className={`each-sub-item ${isActive('/tools/background-remover') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Background Remover">
                  <SidebarIcon name="remover" />
                  <span>Background Remover</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/signature-cropper/" className={`each-sub-item ${isActive('/tools/signature-cropper') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Signature Cropper">
                <SidebarIcon name="signature" />
                <span>Signature Cropper</span>
              </Link>
            </div>
          </div>
          <div className="tools-sidebar-ad">
            <Banner300x250 />
          </div>

        </div>
      </div>}


      <div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="commonOffcanvas" aria-labelledby="commonOffcanvasLabel">
        <div className='offcanvas-tools-sidebar'>
          <div className="header">
            <div className='left-side'>
              <p>Tools</p>

            </div>

            <button className='right-side-btn' data-bs-dismiss="offcanvas" aria-label="Close">
              <img src="/front-assets/images/icons/close-cross.svg" alt="Close" />
            </button>
          </div>

          <div className="scroll-div pb-mob-100">
            <div className='main-item-div'>
              <button className={`each-sidebar-item ${sideBtn === 'btn1' ? 'active' : ''}`} onClick={() => showHideItems('btn1')} data-bs-toggle="tooltip" data-bs-placement="right" title="Resume Tools">
                <SidebarIcon name="resume" />
                <span>Resume</span>
              </button>

              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/ats-checker/" className={`each-sub-item ${isActive('/tools/ats-checker') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="ATS Checker" onClick={closeOffcanvas}>
                  <SidebarIcon name="ats" />
                  <span>ATS Checker</span>
                </Link>
              </div>
            </div>
              <div className='main-item-div'>
              <button className={`each-sidebar-item ${sideBtn === 'btn2' ? 'active' : ''}`} onClick={() => showHideItems('btn2')} data-bs-toggle="tooltip" data-bs-placement="right" title="PDF Tools">
                <SidebarIcon name="pdf" />
                <span>PDF</span>
              </button>

              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/merge-pdf/" className={`each-sub-item ${isActive('/tools/merge-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Merge PDF" onClick={closeOffcanvas}>
                  <SidebarIcon name="merge" />
                  <span>Merge PDF</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/split-pdf/" className={`each-sub-item ${isActive('/tools/split-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Split PDF" onClick={closeOffcanvas}>
                  <SidebarIcon name="split" />
                  <span>Split PDF</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/pdf-remove/" className={`each-sub-item ${isActive('/tools/pdf-remove') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Remove PDF Pages" onClick={closeOffcanvas}>
                  <SidebarIcon name="remove" />
                  <span>Remove PDF Pages</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/pdf-compressor/" className={`each-sub-item ${isActive('/tools/pdf-compressor') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Compress PDF" onClick={closeOffcanvas}>
                  <SidebarIcon name="compress" />
                  <span>Compress PDF</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/docx-to-pdf/" className={`each-sub-item ${isActive('/tools/docx-to-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="DOCX to PDF" onClick={closeOffcanvas}>
                  <SidebarIcon name="docx" />
                  <span>DOCX to PDF</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/image-to-pdf/" className={`each-sub-item ${isActive('/tools/image-to-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Image to PDF" onClick={closeOffcanvas}>
                  <SidebarIcon name="image" />
                  <span>Image to PDF</span>
                </Link>
              </div>
            </div>
            <div className='main-item-div'>
              <button className={`each-sidebar-item ${sideBtn === 'btn3' ? 'active' : ''}`} onClick={() => showHideItems('btn3')} data-bs-toggle="tooltip" data-bs-placement="right" title="Utility Tools">
                <SidebarIcon name="utility" />
                <span>Utility</span>
              </button>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/typing/" className={`each-sub-item ${isActive('/tools/typing') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Typing Practice" onClick={closeOffcanvas}>
                  <SidebarIcon name="typing" />
                  <span>Typing Practice</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/id-card-maker/" className={`each-sub-item ${isActive('/tools/id-card-maker') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="ID Card Maker" onClick={closeOffcanvas}>
                  <SidebarIcon name="card" />
                  <span>ID Card Maker</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/age-calculator/" className={`each-sub-item ${isActive('/tools/age-calculator') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Age Calculator" onClick={closeOffcanvas}>
                  <SidebarIcon name="age" />
                  <span>Age Calculator</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/background-remover/" className={`each-sub-item ${isActive('/tools/background-remover') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Background Remover" onClick={closeOffcanvas}>
                  <SidebarIcon name="remover" />
                  <span>Background Remover</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/signature-cropper/" className={`each-sub-item ${isActive('/tools/signature-cropper') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Signature Cropper" onClick={closeOffcanvas}>
                  <SidebarIcon name="signature" />
                  <span>Signature Cropper</span>
                </Link>
              </div>
            </div>
            <div className="tools-sidebar-ad">
              <Banner300x250 />
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
