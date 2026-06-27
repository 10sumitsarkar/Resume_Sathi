import React from 'react'
import { useSelector } from 'react-redux'

export default function MobProgressArea() {
    const progressbar = useSelector(state => state.resume.progress_percent);
    return (
        <div className="header-part">

            <button type='button' className="left-side-btn" data-bs-toggle="offcanvas" data-bs-target="#stepsOffcanvas" aria-controls="stepsOffcanvas">
                <img alt="Collapse" src="/front-assets/images/icons/collapse-btn.svg" />
            </button>
            <div className="right-side">
                <div className='progrees-area'>
                    <p>Progress</p>
                    <div className="progress-bar-div">
                        <div className="progress-bar">
                            <div style={{ width: progressbar + '%' }}></div>
                        </div>{progressbar} %
                    </div>
                </div>

                <div className='seperator'></div>

                <button type='button' className='preview-btn' data-bs-toggle="offcanvas" data-bs-target="#reviewOffcanvas" aria-controls="reviewOffcanvas"><img src="/front-assets/images/icons/preview-eye.svg" alt="Preview" />Preview</button>
            </div>
        </div>
    )
}
