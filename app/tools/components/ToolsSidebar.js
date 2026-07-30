import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ToolsSidebar() {

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
    if (window.innerWidth < 991) {
      if (!sidebarArea.classList.contains('collapsed')) {
        sidebarArea.classList.add('collapsed');
      }
    }
    else {
      sidebarArea.classList.remove('collapsed');
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
      <div className='tools-sidebar '>
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
              <img src="/front-assets/images/icons/personal-info.svg" alt="Personal Info" />
              <span>Resume</span>
            </button>

            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/ats-checker/" className={`each-sub-item ${isActive('/tools/ats-checker') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="ATS Checker">
                <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="ATS Checker" />
                <span>ATS Checker</span>
              </Link>
            </div>

          </div>

          <div className='main-item-div'>
            <button className={`each-sidebar-item ${sideBtn === 'btn2' ? 'active' : ''}`} onClick={() => showHideItems('btn2')} data-bs-toggle="tooltip" data-bs-placement="right" title="CSS Tools">
              <img src="/front-assets/images/icons/personal-info.svg" alt="Personal Info" />
              <span>PDF</span>
            </button>

            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/merge-pdf/" className={`each-sub-item ${isActive('/tools/merge-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Merge PDF">
                <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Merge PDF" />
                <span>Merge PDF</span>
              </Link>
            </div>

            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/split-pdf/" className={`each-sub-item ${isActive('/tools/split-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Split PDF">
                <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Split PDF" />
                <span>Split PDF</span>
              </Link>
            </div>

            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/pdf-remove/" className={`each-sub-item ${isActive('/tools/pdf-remove') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Remove PDF Pages">
                <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Remove PDF Pages" />
                <span>Remove PDF Pages</span>
              </Link>
            </div>

            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/pdf-compressor/" className={`each-sub-item ${isActive('/tools/pdf-compressor') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Compress PDF">
                <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Compress PDF" />
                <span>Compress PDF</span>
              </Link>
            </div>
            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/docx-to-pdf/" className={`each-sub-item ${isActive('/tools/docx-to-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="DOCX to PDF">
                <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="DOCX to PDF" />
                <span>DOCX to PDF</span>
              </Link>
            </div>
            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/image-to-pdf/" className={`each-sub-item ${isActive('/tools/image-to-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Image to PDF">
                <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Image to PDF" />
                <span>Image to PDF</span>
              </Link>
            </div>

          </div>

          <div className='main-item-div'>
            <button className={`each-sidebar-item ${sideBtn === 'btn3' ? 'active' : ''}`} onClick={() => showHideItems('btn3')} data-bs-toggle="tooltip" data-bs-placement="right" title="Utility Tools">
              <img src="/front-assets/images/icons/personal-info.svg" alt="Utility" />
              <span>Utility</span>
            </button>
            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/age-calculator/" className={`each-sub-item ${isActive('/tools/age-calculator') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Age Calculator">
                <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Age Calculator" />
                <span>Age Calculator</span>
              </Link>
            </div>
            <div className='all-sub-items-div'>
              <Link prefetch={false} href="/tools/signature-cropper/" className={`each-sub-item ${isActive('/tools/signature-cropper') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Signature Cropper">
                <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Signature Cropper" />
                <span>Signature Cropper</span>
              </Link>
            </div>
          </div>

        </div>
      </div>


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
                <img src="/front-assets/images/icons/personal-info.svg" alt="Personal Info" />
                <span>Resume</span>
              </button>

              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/ats-checker/" className={`each-sub-item ${isActive('/tools/ats-checker') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="ATS Checker" onClick={closeOffcanvas}>
                  <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Gradient Generator" />
                  <span>ATS Checker</span>
                </Link>
              </div>
            </div>
              <div className='main-item-div'>
              <button className={`each-sidebar-item ${sideBtn === 'btn2' ? 'active' : ''}`} onClick={() => showHideItems('btn2')} data-bs-toggle="tooltip" data-bs-placement="right" title="PDF Tools">
                <img src="/front-assets/images/icons/personal-info.svg" alt="Personal Info" />
                <span>PDF</span>
              </button>

              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/merge-pdf/" className={`each-sub-item ${isActive('/tools/merge-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Merge PDF" onClick={closeOffcanvas}>
                  <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Merge PDF" />
                  <span>Merge PDF</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/split-pdf/" className={`each-sub-item ${isActive('/tools/split-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Split PDF" onClick={closeOffcanvas}>
                  <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Split PDF" />
                  <span>Split PDF</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/pdf-remove/" className={`each-sub-item ${isActive('/tools/pdf-remove') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Remove PDF Pages" onClick={closeOffcanvas}>
                  <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Remove PDF Pages" />
                  <span>Remove PDF Pages</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/pdf-compressor/" className={`each-sub-item ${isActive('/tools/pdf-compressor') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Compress PDF" onClick={closeOffcanvas}>
                  <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Compress PDF" />
                  <span>Compress PDF</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/docx-to-pdf/" className={`each-sub-item ${isActive('/tools/docx-to-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="DOCX to PDF" onClick={closeOffcanvas}>
                  <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="DOCX to PDF" />
                  <span>DOCX to PDF</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/image-to-pdf/" className={`each-sub-item ${isActive('/tools/image-to-pdf') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Image to PDF" onClick={closeOffcanvas}>
                  <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Image to PDF" />
                  <span>Image to PDF</span>
                </Link>
              </div>
            </div>
            <div className='main-item-div'>
              <button className={`each-sidebar-item ${sideBtn === 'btn3' ? 'active' : ''}`} onClick={() => showHideItems('btn3')} data-bs-toggle="tooltip" data-bs-placement="right" title="Utility Tools">
                <img src="/front-assets/images/icons/personal-info.svg" alt="Utility" />
                <span>Utility</span>
              </button>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/age-calculator/" className={`each-sub-item ${isActive('/tools/age-calculator') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Age Calculator" onClick={closeOffcanvas}>
                  <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Age Calculator" />
                  <span>Age Calculator</span>
                </Link>
              </div>
              <div className='all-sub-items-div'>
                <Link prefetch={false} href="/tools/signature-cropper/" className={`each-sub-item ${isActive('/tools/signature-cropper') ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Signature Cropper" onClick={closeOffcanvas}>
                  <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Signature Cropper" />
                  <span>Signature Cropper</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
