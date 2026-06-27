"use client";

import React, { useState, useEffect } from "react";
import ResumeTemplate1 from "../templates/ResumeTemplate1";
import ResumeTemplate2 from "../templates/ResumeTemplate2";
import ResumeTemplate3 from "../templates/ResumeTemplate3";
import ResumeTemplate4 from "../templates/ResumeTemplate4";
import "../resume-css/resumeTemp.css";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";

export default function ReviewResume({ isMainPreview = false }) {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const { id } = useParams();
  const templateMap = {
    ResumeTemplate1: ResumeTemplate1,
    ResumeTemplate2: ResumeTemplate2,
    ResumeTemplate3: ResumeTemplate3,
    ResumeTemplate4: ResumeTemplate4,
    // add more as needed
  };

  const configurationData = useSelector(
    (state) => {
      const resumes = Array.isArray(state.resume.resumes) ? state.resume.resumes : [];
      return resumes.find((resume) => resume.id === id)?.configuration || {};
    },
  );
  const SelectedTemplate =
    templateMap[configurationData.selected_theme] || ResumeTemplate1;

  if (!isHydrated) return null;

  return (
    <>
      <div className="review-resume-div custom-container">
        {SelectedTemplate ? (
          <SelectedTemplate
            isForDownload={isMainPreview}
            additionalClass={`${configurationData.color_palette} ${configurationData.font_style}`}
          />
        ) : (
          <></>
        )}
      </div>

      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        data-bs-backdrop="false"
        tabIndex="-1"
        id="reviewOffcanvas"
        aria-labelledby="reviewOffcanvasLabel"
      >
        <div className="offcanvas-resume-sidebar custom-container">
          <div className="review-offcanvas-header">
            <h5>Preview</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
            <div className="scroll-div">
            {SelectedTemplate ? (
                <SelectedTemplate
                  isForDownload={false}
                  additionalClass={`${configurationData.color_palette} ${configurationData.font_style}`}
                />
              ) : (
                <></>
              )}
            </div>
        </div>
      </div>
    </>
  );
}
