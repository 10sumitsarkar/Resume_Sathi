import React, { useEffect, useRef, useState } from "react";
import "../resume-css/resumeTemplate4.css";
import { useSelector } from "react-redux";
import { usePathname, useSearchParams } from "next/navigation";

export default function ResumeTemplate4({ additionalClass, isStatic = false, resumeId, isForDownload = false }) {
  const searchParams = useSearchParams();
const id = searchParams.get('id');
  const activeResumeId = resumeId || id;
  const containerRef = useRef();
  const resumeRef = useRef();
  const activeResume = useSelector((state) => {
    const resumes = Array.isArray(state.resume.resumes) ? state.resume.resumes : [];
    return resumes.find((resume) => resume.id === activeResumeId) || {};
  });
  const personalInfomation = activeResume.personal_infomation || {};
  const summary = activeResume.summary || {};
  const educations = activeResume.educations || [];
  const certificates = activeResume.certificates || [];
  const work_experiences = activeResume.work_experiences || [];
  const any_internships = activeResume.any_internships || [];
  const social_medias = activeResume.social_medias || [];
  const languages = activeResume.languages || [];
  const skills = activeResume.skills || [];
  const hobbies = activeResume.hobbies || [];

  const previewResumeSize = useSelector(
    (state) => state.resume.preview_resume_size,
  );
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(0);

  // Checking the actual page using path start
  const [currentLoc, setCurrentLoc] = useState("preview");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      const pathPart = pathname.split("/")[2];
      setCurrentLoc(pathPart);
    }
  }, [pathname]);

  // Checking the actual page using path end

  const showStaticData = isStatic || currentLoc === "select-theme";

  // Build the address / contact line from available fields
  const addressParts = [
    personalInfomation.address,
    personalInfomation.city,
    personalInfomation.state,
    personalInfomation.zipCode,
    personalInfomation.country,
  ].filter(Boolean);

  const contactItems = [];
  if (addressParts.length > 0) contactItems.push(addressParts.join(", "));
  if (personalInfomation.phone) contactItems.push(personalInfomation.phone);
  if (personalInfomation.email) contactItems.push(personalInfomation.email);
  if (personalInfomation.website) contactItems.push(personalInfomation.website);

  useEffect(() => {
    const container = containerRef.current;
    const resume = resumeRef.current;
    const resumeWidth = 800;

    if (!container || !resume) return;

    const updateScaleAndHeight = () => {
      const containerWidth = container.offsetWidth;
      const newScale = containerWidth / resumeWidth;
      setScale(newScale);

      const newHeight = resume.offsetHeight * newScale;
      setScaledHeight(newHeight);
    };

    updateScaleAndHeight();

    const observer = new ResizeObserver(() => {
      updateScaleAndHeight();
    });

    observer.observe(resume);
    window.addEventListener("resize", updateScaleAndHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScaleAndHeight);
    };
  }, [String(additionalClass), Number(previewResumeSize)]); // <— re-run when formData changes

  return (
    <div
      ref={containerRef}
      className="resume-preview-div"
      data-selected-resume="ResumeTemplate4"
      style={{ height: `${scaledHeight}px` }}
    >
      <div
        ref={resumeRef}
        id={isForDownload ? 'resume-download-area' : undefined}
        className="position-absolute top-0 start-0"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "800px",
        }}
      >
        {showStaticData ? (
          <div className={`resume ResumeTemplate4 ${additionalClass}`}>
            {/* HEADER */}
            <div className="resume4_header">
              <div className="resume4_header_left">
                <p className="resume4_name resume-name">Herman Walton</p>
                <p className="resume4_job resume-job-title">
                  Financial Analyst
                </p>
                <p className="resume4_contact">
                  <span className="resume-address">
                    Market Street 12, New York, 1021, The USA
                  </span>
                  {" | "}
                  <span className="resume-phone">(412) 479-6342</span>
                  {" | "}
                  <span className="resume-email">example@gmail.com</span>
                </p>
              </div>
              <div className="resume4_header_right">
                <img
                  loading="lazy"
                  className="resume-photo"
                  src="/front-assets/images/icons/user-icon.svg"
                  alt="profile_pic"
                />
              </div>
            </div>
            <div className="resume4_top_divider"></div>

            {/* SUMMARY */}
            <div className="resume4_section">
              <h3 className="resume4_section_title">Summary</h3>
              <p className="resume-about-me">
                Experienced and driven Financial Analyst with an impressive
                background of managing multi-million dollar budgets.
              </p>
            </div>

            {/* PROFESSIONAL EXPERIENCE */}
            <div className="resume4_section">
              <h3 className="resume4_section_title">Professional Experience</h3>

              <div className="resume4_entry">
                <div className="resume4_entry_head">
                  <p className="resume4_entry_title">
                    Financial Analyst, GEO Corp.
                  </p>
                  <p className="resume4_entry_date">Jan 2012 — Present</p>
                </div>
                <ul className="resume4_bullets">
                  <li>
                    Created budgets and ensured that labor and material costs
                    were decreased by 15 percent.
                  </li>
                  <li>
                    Generated financial reports on completed projects,
                    indicating advantageous results.
                  </li>
                  <li>
                    Generated financial statements including cash flow charts
                    and balance sheets.
                  </li>
                  <li>
                    Created analysis and performance reports for management
                    teams to review.
                  </li>
                  <li>
                    Introduced and implemented a different type of software to
                    enhance communication of different organization.
                  </li>
                </ul>
              </div>

              <div className="resume4_entry">
                <div className="resume4_entry_head">
                  <p className="resume4_entry_title">
                    Financial Analyst, Sisco Enterprises
                  </p>
                  <p className="resume4_entry_date">Feb 2008 — Dec 2012</p>
                </div>
                <ul className="resume4_bullets">
                  <li>
                    Provide reports, ad-hoc analysis, annual operations plan
                    budgets, monthly cash forecasts, and revenue forecasts.
                  </li>
                  <li>
                    Analyzed supplier contracts and advised in negotiations
                    bringing budgets down by 6%.
                  </li>
                  <li>
                    Created weekly labor finance reports and presented the
                    results to management.
                  </li>
                </ul>
              </div>
            </div>

            {/* EDUCATION */}
            <div className="resume4_section">
              <h3 className="resume4_section_title">Education</h3>

              <div className="resume4_entry">
                <div className="resume4_entry_head">
                  <p className="resume4_entry_title">
                    Diploma in Computer Engineering
                  </p>
                  <p className="resume4_entry_date">Aug 2006 — Oct 2008</p>
                </div>
                <p className="resume4_entry_sub">University of Arizona</p>
                <ul className="resume4_bullets">
                  <li>Graduated with High Honors.</li>
                </ul>
              </div>

              <div className="resume4_entry">
                <div className="resume4_entry_head">
                  <p className="resume4_entry_title">
                    Bachelor in Computer Engineering
                  </p>
                  <p className="resume4_entry_date">Aug 2004 — Oct 2006</p>
                </div>
                <p className="resume4_entry_sub">University of Arizona</p>
                <ul className="resume4_bullets">
                  <li>Graduated with High Honors.</li>
                </ul>
              </div>
            </div>

            {/* CERTIFICATES */}
            <div className="resume4_section">
              <h3 className="resume4_section_title">Certificates</h3>

              <div className="resume4_entry">
                <div className="resume4_entry_head">
                  <p className="resume4_entry_title">
                    Financial Analyst License — National Finance Board
                  </p>
                  <p className="resume4_entry_date">2014</p>
                </div>
                <p className="resume4_entry_sub">
                  Certified in advanced financial analysis, budgeting and
                  forecasting practices.
                </p>
              </div>
            </div>

            {/* TECHNICAL SKILLS */}
            <div className="resume4_section">
              <h3 className="resume4_section_title">Technical Skills</h3>
              <div className="resume4_skills_grid">
                <p>Solution Strategies</p>
                <p>Market Assessment</p>
                <p>Innovation</p>
                <p>Agile Methodologies</p>
                <p>Effective Team leader</p>
                <p>Collaboration</p>
                <p>Creative Problem Solving</p>
                <p>Customer-centric Selling</p>
              </div>
            </div>

            {/* ADDITIONAL INFORMATION */}
            <div className="resume4_section">
              <h3 className="resume4_section_title">Additional Information</h3>
              <ul className="resume4_additional">
                <li>
                  <strong>Languages:</strong> English, French
                </li>
                <li>
                  <strong>Awards/Activities:</strong> Most Innovate Employer of
                  the Year (2011), Overall Best Employee Division Two (2009)
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className={`resume ResumeTemplate4 ${additionalClass}`}>
            {/* HEADER */}
            <div className="resume4_header">
              <div className="resume4_header_left">
                <p className="resume4_name resume-name">
                  {personalInfomation?.firstName} {personalInfomation?.lastName}
                </p>
                {personalInfomation?.experience && (
                  <p className="resume4_job resume-job-title">
                    {personalInfomation.experience}
                  </p>
                )}
                {contactItems.length > 0 && (
                  <p className="resume4_contact">
                    {contactItems.map((item, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && " | "}
                        <span>{item}</span>
                      </React.Fragment>
                    ))}
                  </p>
                )}
              </div>
              {personalInfomation.photo && (
                <div className="resume4_header_right">
                  <img
                    loading="lazy"
                    className="resume-photo"
                    src={personalInfomation.photo}
                    alt={`${personalInfomation.firstName || "User"}'s Profile`}
                  />
                </div>
              )}
            </div>
            <div className="resume4_top_divider"></div>

            {/* SUMMARY */}
            {summary?.summary && (
              <div className="resume4_section">
                <h3 className="resume4_section_title">Summary</h3>
                <p className="resume-about-me">{summary.summary}</p>
              </div>
            )}

            {/* PROFESSIONAL EXPERIENCE */}
            {work_experiences?.length > 0 && (
              <div className="resume4_section">
                <h3 className="resume4_section_title">
                  Professional Experience
                </h3>
                {work_experiences.map((work, index) => (
                  <div className="resume4_entry" key={index}>
                    <div className="resume4_entry_head">
                      <p className="resume4_entry_title">
                        {work.job_title}, {work.company_name}
                      </p>
                      <p className="resume4_entry_date">
                        {work.start_month} {work.start_year} —
                        {!work.end_month || !work.end_year
                          ? " Present"
                          : ` ${work.end_month} ${work.end_year}`}
                      </p>
                    </div>
                    {work.location && (
                      <p className="resume4_entry_sub">{work.location}</p>
                    )}
                    {work.description && (
                      <ul className="resume4_bullets">
                        {work.description
                          .split("\n")
                          .filter(Boolean)
                          .map((line, i) => (
                            <li key={i}>{line.replace(/^[-•\s]+/, "")}</li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* INTERNSHIPS */}
            {any_internships?.length > 0 && (
              <div className="resume4_section">
                <h3 className="resume4_section_title">Internships</h3>
                {any_internships.map((intern, index) => (
                  <div className="resume4_entry" key={index}>
                    <div className="resume4_entry_head">
                      <p className="resume4_entry_title">
                        {intern.job_title}, {intern.company_name}
                      </p>
                      <p className="resume4_entry_date">
                        {intern.start_month} {intern.start_year} —
                        {!intern.end_month || !intern.end_year
                          ? " Present"
                          : ` ${intern.end_month} ${intern.end_year}`}
                      </p>
                    </div>
                    {intern.location && (
                      <p className="resume4_entry_sub">{intern.location}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* EDUCATION */}
            {educations?.length > 0 && (
              <div className="resume4_section">
                <h3 className="resume4_section_title">Education</h3>
                {educations.map((edu, index) => (
                  <div className="resume4_entry" key={index}>
                    <div className="resume4_entry_head">
                      <p className="resume4_entry_title">
                        {edu.degree} in {edu.field_study}
                      </p>
                      <p className="resume4_entry_date">
                        {!edu.date || !edu.year
                          ? "Still Studying"
                          : `${edu.date} ${edu.year}`}
                      </p>
                    </div>
                    <p className="resume4_entry_sub">
                      {edu.institute_name}
                      {edu.location ? `, ${edu.location}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* CERTIFICATES */}
            {certificates?.length > 0 && (
              <div className="resume4_section">
                <h3 className="resume4_section_title">Certificates</h3>
                {certificates.map((cert, index) => (
                  <div className="resume4_entry" key={index}>
                    <div className="resume4_entry_head">
                      <p className="resume4_entry_title">
                        {cert.certificate_name}
                        {cert.issuing_organization &&
                          ` — ${cert.issuing_organization}`}
                      </p>
                      {cert.issue_date && (
                        <p className="resume4_entry_date">
                          {cert.issue_date}
                        </p>
                      )}
                    </div>
                    {cert.description && (
                      <p className="resume4_entry_sub">{cert.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TECHNICAL SKILLS */}
            {skills?.length > 0 && (
              <div className="resume4_section">
                <h3 className="resume4_section_title">Technical Skills</h3>
                <div className="resume4_skills_grid">
                  {skills.map((skill, index) => (
                    <p key={index}>{skill.skill_name}</p>
                  ))}
                </div>
              </div>
            )}

            {/* ADDITIONAL INFORMATION */}
            {(languages?.length > 0 ||
              hobbies?.length > 0 ||
              social_medias?.length > 0) && (
              <div className="resume4_section">
                <h3 className="resume4_section_title">
                  Additional Information
                </h3>
                <ul className="resume4_additional">
                  {languages?.length > 0 && (
                    <li>
                      <strong>Languages:</strong>{" "}
                      {languages
                        .map(
                          (lang) =>
                            `${lang.language}${lang.proficiency_level ? ` (${lang.proficiency_level})` : ""}`,
                        )
                        .join(", ")}
                    </li>
                  )}
                  {hobbies?.length > 0 && (
                    <li>
                      <strong>Activities:</strong>{" "}
                      {hobbies.map((hobby) => hobby.hobbies).join(", ")}
                    </li>
                  )}
                  {social_medias?.length > 0 && (
                    <li>
                      <strong>Social:</strong>{" "}
                      {social_medias
                        .map((social) => social.social_url)
                        .join(", ")}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Define layout style dynamically for this template
ResumeTemplate4.layoutStyle = "single-column";
