"use client";

import React, { useState, useEffect } from "react";
import ResumeTemplate1 from "../templates/ResumeTemplate1";
import ResumeTemplate2 from "../templates/ResumeTemplate2";
import ResumeTemplate3 from "../templates/ResumeTemplate3";
import ResumeTemplate4 from "../templates/ResumeTemplate4";
import ResumeTemplate5 from "../templates/ResumeTemplate5";
import ResumeTemplate6 from "../templates/ResumeTemplate6";
import ResumeTemplate7 from "../templates/ResumeTemplate7";
import ResumeTemplate8 from "../templates/ResumeTemplate8";
import ResumeTemplate9 from "../templates/ResumeTemplate9";



import "../resume-css/resumeTemp.css";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { getResumeCustomizationClasses } from "../utils/fontSize";
import { Banner320x50 } from "../../components/ads";
import ViewportAd from "../../components/ads/ViewportAd";

export default function ReviewResume({ isMainPreview = false }) {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const searchParams = useSearchParams();
const id = searchParams.get('id');
  const templateMap = {
    ResumeTemplate1: ResumeTemplate1,
    ResumeTemplate2: ResumeTemplate2,
    ResumeTemplate3: ResumeTemplate3,
    ResumeTemplate4: ResumeTemplate4,
    ResumeTemplate5: ResumeTemplate5,   
    ResumeTemplate6: ResumeTemplate6,  
    ResumeTemplate7: ResumeTemplate7, 
    ResumeTemplate8: ResumeTemplate8,
    ResumeTemplate9: ResumeTemplate9,
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
  const customizationClasses = getResumeCustomizationClasses(configurationData);

  if (!isHydrated) return null;

  return (
    <>
      <div className="review-resume-div custom-container">
        {SelectedTemplate ? (
          <SelectedTemplate
            isForDownload={isMainPreview}
            additionalClass={customizationClasses}
          />
        ) : (
          <></>
        )}
      </div>
      {!isMainPreview && (
        <ViewportAd media="(min-width: 992px)">
          <div
            style={{
              position: "fixed",
              right: 0,
              bottom: 0,
              zIndex: 5,
              width: "var(--review-resume-width)",
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
            }}
          >
            <Banner320x50 />
          </div>
        </ViewportAd>
      )}

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
            <div
              className="scroll-div"
              style={!isMainPreview ? { paddingBottom: 60 } : undefined}
            >
            {SelectedTemplate ? (
                <SelectedTemplate
                  isForDownload={false}
                  additionalClass={customizationClasses}
                />
              ) : (
                <></>
              )}
            </div>
          {!isMainPreview && (
            <ViewportAd media="(max-width: 991px)">
              <div
                style={{
                  position: "fixed",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1056,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff",
                }}
              >
                <Banner320x50 />
              </div>
            </ViewportAd>
          )}
        </div>
      </div>
    </>
  );
}
