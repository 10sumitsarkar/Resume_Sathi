import React, { useEffect, useRef, useState } from "react";
import "../resume-css/resumeTemp.css";
import { useSelector } from "react-redux";
import { usePathname, useSearchParams } from "next/navigation";

export default function ResumeTemplate1({ additionalClass, isStatic = false, resumeId, isForDownload = false }) {
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

  const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr; // agar already plain text hai to wahi return
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'long' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

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
      data-selected-resume="ResumeTemplate1"
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
          <div className={`resume ResumeTemplate1 ${additionalClass}`}>
            <div className="resume_left">
              <div className="resume_profile">
                <img
                  loading="lazy"
                  className="resume-photo"
                  src="/front-assets/images/icons/user-icon.svg"
                  alt="profile_pic"
                />
              </div>

              <div className="resume_content">
                <div className="resume_item resume_info">
                  <div className="title">
                    <p className="bold resume-name">Michael Anderson</p>
                    <p className="regular resume-job-title">
                      Senior Full Stack Developer
                    </p>
                  </div>

                  <ul>
                    <li>
                      <div className="icon">
                        <img
                          src={
                            "/front-assets/images/resume-img/temp-location.svg"
                          }
                          width={16}
                          height={16}
                        />
                      </div>
                      <div className="data resume-address">
                        245 Park Avenue, New York, NY
                      </div>
                    </li>

                    <li>
                      <div className="icon">
                        <img
                          src={"/front-assets/images/resume-img/temp-phone.svg"}
                          width={16}
                          height={16}
                        />
                      </div>
                      <div className="data resume-phone">+1 (555) 987-6543</div>
                    </li>

                    <li>
                      <div className="icon">
                        <img
                          src={"/front-assets/images/resume-img/temp-mail.svg"}
                          width={16}
                          height={16}
                        />
                      </div>
                      <div className="data resume-email">
                        michael.anderson@email.com
                      </div>
                    </li>

                    <li>
                      <div className="icon">
                        <img
                          src={
                            "/front-assets/images/resume-img/temp-web.svg"
                          }
                          width={16}
                          height={16}
                        />
                      </div>
                      <div className="data resume-website">
                        www.michaelanderson.dev
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="resume_item resume_skills">
                  <div className="title">
                    <p className="bold">Skills</p>
                  </div>

                  <ul>
                    <li>
                      <p>JavaScript (Expert)</p>
                    </li>
                    <li>
                      <p>React.js (Advanced)</p>
                    </li>
                    <li>
                      <p>Next.js (Advanced)</p>
                    </li>
                    <li>
                      <p>TypeScript (Intermediate)</p>
                    </li>
                    <li>
                      <p>Node.js (Advanced)</p>
                    </li>
                    <li>
                      <p>Figma (Intermediate)</p>
                    </li>
                    <li>
                      <p>AWS (Intermediate)</p>
                    </li>
                  </ul>
                </div>

                <div className="resume_item resume_social">
                  <div className="title">
                    <p className="bold">Social Links</p>
                  </div>

                  <ul>
                    <li>
                      <p>
                        <i className="fab fa-github"></i> github.com/michaeldev
                      </p>
                    </li>

                    <li>
                      <p>
                        <i className="fab fa-youtube"></i>{" "}
                        youtube.com/@michaeldev
                      </p>
                    </li>

                    <li>
                      <p>
                        <i className="fab fa-facebook"></i>{" "}
                        facebook.com/michaeldev
                      </p>
                    </li>

                    <li>
                      <p>
                        <i className="fab fa-behance"></i>{" "}
                        behance.net/michaeldev
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="resume_right">
              {/* ABOUT */}
              <div className="resume_item resume_about">
                <div className="title">
                  <p className="bold">About Me</p>
                </div>

                <p className="resume-about-me para-desc">
                  Experienced Full Stack Developer with expertise in modern web
                  technologies including React.js, Next.js, JavaScript, Node.js,
                  and cloud platforms. Passionate about building scalable
                  digital products, optimizing application performance, and
                  delivering exceptional user experiences through clean
                  architecture and innovative solutions.
                </p>
              </div>

              {/* EDUCATION */}
              <div className="resume_item resume_education">
                <div className="title">
                  <p className="bold">Education</p>
                </div>

                <ul>
                  <li>
                    <p className="semi-bold">
                      Master of Science in Software Engineering
                    </p>
                    <p>Stanford University, California — May 2022</p>
                  </li>

                  <li>
                    <p className="semi-bold">Bachelor of Computer Science</p>
                    <p>University of Washington, Seattle — August 2020</p>
                  </li>

                  <li>
                    <p className="semi-bold">
                      Diploma in Information Technology
                    </p>
                    <p>Seattle Technical Institute — June 2018</p>
                  </li>
                </ul>
              </div>

              {/* CERTIFICATION */}
              <div className="resume_item resume_certification">
                <div className="title">
                  <p className="bold">Certification</p>
                </div>

                <ul>
                  <li>
                    <p className="semi-bold">
                      AWS Certified Solutions Architect
                    </p>
                    <p>Issued: October 2023</p>
                    <p>
                      Comprehensive certification covering cloud architecture,
                      security, deployment strategies, scalability, and AWS best
                      practices.
                    </p>
                  </li>

                  <li>
                    <p className="semi-bold">
                      Professional React Developer Certification
                    </p>
                    <p>Issued: April 2022</p>
                    <p>
                      Advanced frontend development certification focused on
                      React.js, state management, performance optimization, and
                      testing methodologies.
                    </p>
                  </li>
                </ul>
              </div>

              {/* WORK EXPERIENCE */}
              <div className="resume_item resume_work">
                <div className="title">
                  <p className="bold">Work Experience</p>
                </div>

                <ul>
                  <li>
                    <p className="semi-bold">
                      Senior Full Stack Developer - InnovateX Technologies
                    </p>
                    <p>January 2023 - Present</p>
                    <p>
                      Leading development of enterprise applications using
                      React.js, Node.js, and AWS. Managing technical
                      architecture, mentoring developers.
                    </p>
                  </li>

                  <li>
                    <p className="semi-bold">
                      Frontend Developer - Digital Labs
                      
                    </p>
                  </li>
                </ul>
              </div>

              

              
            </div>
          </div>
        ) : (
          <div className={`resume ResumeTemplate1 ${additionalClass}`}>
            {/* LEFT SIDE */}
            <div className="resume_left">
              <div className="resume_profile">
                <img
                  loading="lazy"
                  className="resume-photo"
                  src={
                    personalInfomation.photo ||
                    "/front-assets/images/icons/user-icon.svg"
                  }
                  alt={`${personalInfomation.firstName || "User"}'s Profile`}
                />
              </div>

              <div className="resume_content">
                {/* Personal Info */}
                <div className="resume_item resume_info">
                  <div className="title">
                    <p className="bold resume-name">
                      {personalInfomation?.firstName}{" "}
                      {personalInfomation?.lastName}
                    </p>
                    <p className="regular resume-job-title">
                      {personalInfomation?.experience &&
                        `(${personalInfomation.experience})`}
                    </p>
                  </div>
                  <ul>
                    {[personalInfomation.address, personalInfomation.city, personalInfomation.state, personalInfomation.country]
                      .filter(Boolean).join(", ") && (
                      <li>
                        <div className="icon">
                          <img
                            src={
                              "/front-assets/images/resume-img/temp-location.svg"
                            }
                            width={16}
                            height={16}
                          />
                        </div>
                        <div className="data resume-address">
                          {[personalInfomation.address, personalInfomation.city, personalInfomation.state, personalInfomation.country]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      </li>
                    )}
                    {personalInfomation.phone && (
                      <li>
                        <div className="icon">
                          <img
                            src={
                              "/front-assets/images/resume-img/temp-phone.svg"
                            }
                            width={16}
                            height={16}
                          />
                        </div>
                        <div className="data resume-phone">
                          {personalInfomation.phone}
                        </div>
                      </li>
                    )}
                    {personalInfomation.email && (
                      <li>
                        <div className="icon">
                          <img
                            src={
                              "/front-assets/images/resume-img/temp-mail.svg"
                            }
                            width={16}
                            height={16}
                          />
                        </div>
                        <div className="data resume-email">
                          {personalInfomation.email}
                        </div>
                      </li>
                    )}
                    {personalInfomation.website && (
                      <li>
                        <div className="icon">
                          <img
                            src={"/front-assets/images/resume-img/temp-web.svg"}
                            width={16}
                            height={16}
                          />
                        </div>
                        <div className="data resume-website">
                          {personalInfomation.website}
                        </div>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Skills */}
                {skills?.length > 0 && (
                  <div className="resume_item resume_skills">
                    <div className="title">
                      <p className="bold">Skills</p>
                    </div>
                    <ul>
                      {skills.map((skill, index) => (
                        <li key={index}>
                          <p>
                            {skill.skill_name} ({skill.proficiency_level})
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Social Media */}
                {social_medias?.length > 0 && (
                  <div className="resume_item resume_social">
                    <div className="title">
                      <p className="bold">Social Links</p>
                    </div>
                    <ul>
                      {social_medias.map((social, index) => {
                        const iconMap = {
                          Facebook: "fab fa-facebook",
                          Twitter: "fab fa-twitter",
                          LinkedIn: "fab fa-linkedin",
                          Instagram: "fab fa-instagram",
                          GitHub: "fab fa-github",
                          Dribbble: "fab fa-dribbble",
                          Behance: "fab fa-behance",
                          YouTube: "fab fa-youtube",
                          WhatsApp: "fab fa-whatsapp",
                          Pinterest: "fab fa-pinterest",
                          Reddit: "fab fa-reddit",
                          Medium: "fab fa-medium",
                          Telegram: "fab fa-telegram",
                          StackOverflow: "fab fa-stack-overflow",
                          Other: "fas fa-globe",
                        };

                        const iconClass =
                          iconMap[social.social_name] || iconMap.Other;
                        const url = social.social_url?.startsWith("http")
                          ? social.social_url
                          : `https://${social.social_url}`;

                        return (
                          <li key={index}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className={iconClass}></i> {social.social_name}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="resume_right">
              {/* Summary */}
              {summary?.summary && (
                <div className="resume_item resume_about">
                  <div className="title">
                    <p className="bold">About Me</p>
                  </div>
                  <p className="resume-about-me para-desc">{summary.summary}</p>
                </div>
              )}

              {/* Education */}
              {educations?.length > 0 && (
                <div className="resume_item resume_education">
                  <div className="title">
                    <p className="bold">Education</p>
                  </div>
                  {educations.map((edu, index) => (
                    <ul key={index}>
                      <li>
                        <p className="semi-bold">
                          {edu.degree} in {edu.field_study} (
                          {edu.institute_name})
                        </p>
                        <p className="location">
                          {edu.location} —
                          {!edu.date || !edu.year
                            ? " Still Studying"
                            : ` ${edu.date} ${edu.year}`}
                        </p>
                      </li>
                    </ul>
                  ))}
                </div>
              )}

              {/* Certifications */}
              {certificates?.length > 0 && (
                <div className="resume_item resume_education">
                  <div className="title">
                    <p className="bold">Certification</p>
                  </div>
                  {certificates.map((cert, index) => (
                    <ul key={index}>
                      <li>
                        <p className="semi-bold">
                          {cert.certificate_name} from{" "}
                          {cert.issuing_organization}
                        </p>
                        {cert.issue_date && <p>{formatDisplayDate(cert.issue_date)}</p>}
                        {cert.description && (
                          <p className="para-desc">{cert.description}</p>
                        )}
                      </li>
                    </ul>
                  ))}
                </div>
              )}

              {/* Internships */}
              {any_internships?.length > 0 && (
                <div className="resume_item resume_work">
                  <div className="title">
                    <p className="bold">Internships</p>
                  </div>
                  {any_internships.map((intern, index) => (
                    <ul key={index}>
                      <li>
                        <p className="semi-bold">
                          {intern.job_title} in {intern.company_name} (
                          {intern.employee_type})
                        </p>
                        <p className="location">{intern.location}</p>
                        <p>
                          {intern.start_month} {intern.start_year} to
                          {!intern.end_month || !intern.end_year
                            ? " Present"
                            : ` ${intern.end_month} ${intern.end_year}`}
                        </p>
                      </li>
                    </ul>
                  ))}
                </div>
              )}

              {/* Work Experience */}
              {work_experiences?.length > 0 && (
                <div className="resume_item resume_work">
                  <div className="title">
                    <p className="bold">Work Experience</p>
                  </div>
                  {work_experiences.map((work, index) => (
                    <ul key={index}>
                      <li>
                        <p className="semi-bold">
                          {work.job_title} in {work.company_name} (
                          {work.employee_type})
                        </p>
                        <p className="location">{work.location}</p>
                        <p>
                          {work.start_month} {work.start_year} to
                          {!work.end_month || !work.end_year
                            ? " Present"
                            : ` ${work.end_month} ${work.end_year}`}
                        </p>
                        {work.description && (
                          <p className="para-desc">{work.description}</p>
                        )}
                      </li>
                    </ul>
                  ))}
                </div>
              )}

              {/* Languages */}
              {languages?.length > 0 && (
                <div className="resume_item resume_languages">
                  <div className="title">
                    <p className="bold">Languages</p>
                  </div>
                  <ul>
                    {languages.map((lang, index) => (
                      <li key={index}>
                        <p>
                          {lang.language} — {lang.proficiency_level}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hobbies */}
              {hobbies?.length > 0 && (
                <div className="resume_item resume_languages">
                  <div className="title">
                    <p className="bold">Hobbies</p>
                  </div>
                  <ul>
                    {hobbies.map((hobby, index) => (
                      <li key={index}>
                        <p>{hobby.hobbies}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Define layout style dynamically for this template
ResumeTemplate1.layoutStyle = "two-column";
