import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ToolsSidebar() {

  const pathname = usePathname();
  const isActive = pathname === '/gradient-generator'; // adjust if it's nested


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
              <span>Development</span>
            </button>

            <div className='all-sub-items-div'>
              <Link href="/tools/gradient-generator" className={`each-sub-item ${isActive ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Gradient Generator">
                <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Gradient Generator" />
                <span>Gradient Generator</span>
              </Link>
              <Link href="/tools/css-animations" className={`each-sub-item ${isActive ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Gradient Generator">
                <img src="/front-assets/images/icons/animate-css.svg" width={24} height={24} alt="CSS Animation" />
                <span>CSS Animation</span>
              </Link>
            </div>

          </div>

          <div className='main-item-div'>
            <button className={`each-sidebar-item ${sideBtn === 'btn2' ? 'active' : ''}`} onClick={() => showHideItems('btn2')} data-bs-toggle="tooltip" data-bs-placement="right" title="CSS Tools">
              <img src="/front-assets/images/icons/personal-info.svg" alt="Personal Info" />
              <span>Development</span>
            </button>

            <div className='all-sub-items-div'>
              <Link href="/tools/gradient-generator" className={`each-sub-item ${isActive ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Gradient Generator">
                <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Gradient Generator" />
                <span>Gradient Generator</span>
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
              <img src="/front-assets/images/icons/collapse-btn.svg" alt="Collapse" />
            </button>
          </div>

          <div className="scroll-div pb-mob-100">
            <div className='main-item-div'>
              <button className={`each-sidebar-item ${sideBtn === 'btn1' ? 'active' : ''}`} onClick={() => showHideItems('btn1')} data-bs-toggle="tooltip" data-bs-placement="right" title="CSS Tools">
                <img src="/front-assets/images/icons/personal-info.svg" alt="Personal Info" />
                <span>Development</span>
              </button>

              <div className='all-sub-items-div'>
                <Link href="/tools/gradient-generator" className={`each-sub-item ${isActive ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Gradient Generator">
                  <img src="/front-assets/images/icons/gradient-generator.svg" width={24} height={24} alt="Gradient Generator" />
                  <span>Gradient Generator</span>
                </Link>
                <Link href="/tools/css-animations" className={`each-sub-item ${isActive ? 'active' : ''}`} data-bs-toggle="tooltip" data-bs-placement="right" title="Gradient Generator">
                  <img src="/front-assets/images/icons/animate-css.svg" width={24} height={24} alt="CSS Animation" />
                  <span>CSS Animation</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  )
}
