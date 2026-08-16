import React, { useEffect, useRef, useState } from "react";
import "../resume-css/resumeTemplate9.css";
import { useSelector } from "react-redux";
import { usePathname, useSearchParams } from "next/navigation";

/* ─── Contact icons ─────────────────────────────────────────────────────── */
const IconEmail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
    <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);
const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
  </svg>
);
const IconLocation = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const IconGlobe = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14A7.82 7.82 0 014 12c0-.68.09-1.35.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.008 8.008 0 015.07 16zm2.95-8H5.07a8.008 8.008 0 014.33-3.56A15.65 15.65 0 008.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.008 8.008 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.17.65.26 1.32.26 2s-.09 1.35-.26 2h-3.38z" />
  </svg>
);

/* ─── Section badge icons ───────────────────────────────────────────────── */
const IconPerson = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8v1H4v-1z" />
  </svg>
);
const IconBriefcase = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <path d="M9 4a2 2 0 00-2 2v1H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3V6a2 2 0 00-2-2H9zm0 3V6h6v1H9zM4 9h16v9H4V9z" />
  </svg>
);
const IconCap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 12.18v3.6L12 19l7-3.22v-3.6l-7 3.82-7-3.82z" />
  </svg>
);
const IconAward = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <circle cx="12" cy="9" r="6" /><path d="M9 14.5L7 21l5-2.5L17 21l-2-6.5" />
  </svg>
);
const IconLanguage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <path d="M4 5h9M8 3v2M11 5c-1 3-3 6-6 8M6 9c1.5 1.6 3.4 2.7 5 3" />
    <path d="M14 21l4-9 4 9M15.5 18h5" />
  </svg>
);
const IconLink = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <path d="M9 15l6-6M8 12l-2 2a3 3 0 004 4l2-2M16 12l2-2a3 3 0 00-4-4l-2 2" />
  </svg>
);
const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
    <path d="M4 12l6 6L20 6" />
  </svg>
);
const IconQuote = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24" fill="currentColor" width="16" height="14">
    <path d="M0 24V14.564Q0 9.03 2.58 5.272 5.161 1.514 10.256 0l1.694 3.15q-3.15 1.29-4.6 3.15-1.452 1.86-1.612 4.6h5.402V24H0zm16.94 0V14.564q0-5.535 2.58-9.292Q22.1 1.514 27.196 0l1.694 3.15q-3.15 1.29-4.6 3.15-1.452 1.86-1.612 4.6h5.402V24H16.94z" />
  </svg>
);

/* ─── Social icons ──────────────────────────────────────────────────────── */
const SocialIcons = {
  Facebook: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>),
  Twitter: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>),
  LinkedIn: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>),
  Instagram: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>),
  GitHub: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg>),
  Behance: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.2.561 1.884 1.477 2.26.584.23 1.354.26 1.968.07l.204-.07c.538-.196.849-.49 1.012-.939H23.726zM15.997 14h4.867c-.063-1.363-.583-2.19-2.22-2.19-1.52 0-2.395.822-2.647 2.19zM7.27 10.887c1.028 0 2.041-.318 2.041-1.487 0-1.168-.953-1.457-1.981-1.457H4v2.944h3.27zM4 13v3.395h3.48c1.196 0 2.18-.437 2.18-1.726 0-1.29-1.066-1.67-2.18-1.67H4zM0 5h8.51c2.02 0 4.514.898 4.514 3.683 0 1.562-.826 2.456-2.02 3.027C12.52 12.213 13.5 13.3 13.5 15.38 13.5 18.49 11.134 19 8.882 19H0V5z" /></svg>),
  YouTube: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg>),
  WhatsApp: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.135 1.535 5.874L.057 23.75a.75.75 0 00.917.918l5.97-1.487A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.666-.523-5.184-1.432l-.372-.22-3.84.957.975-3.763-.242-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>),
  Other: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14A7.82 7.82 0 014 12c0-.68.09-1.35.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.008 8.008 0 015.07 16zm2.95-8H5.07a8.008 8.008 0 014.33-3.56A15.65 15.65 0 008.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.008 8.008 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.17.65.26 1.32.26 2s-.09 1.35-.26 2h-3.38z" /></svg>),
};
const getSocialIcon = (name) => {
  const Icon = SocialIcons[name] || SocialIcons.Other;
  return <Icon />;
};

const proficiencyToDots = (level) => {
  const l = (level || "").toLowerCase();
  if (l.includes("native") || l.includes("master")) return 5;
  if (l.includes("fluent") || l.includes("expert") || l.includes("advanced")) return 4;
  if (l.includes("proficient") || l.includes("professional")) return 3;
  if (l.includes("intermediate") || l.includes("conversational")) return 2;
  if (l.includes("beginner") || l.includes("basic")) return 1;
  return 3;
};
const skillLevelToPercent = (level) => {
  const l = (level || "").toLowerCase();
  if (l.includes("master")) return 100;
  if (l.includes("expert")) return 92;
  if (l.includes("advanced")) return 82;
  if (l.includes("proficient")) return 70;
  if (l.includes("intermediate")) return 55;
  if (l.includes("beginner") || l.includes("basic")) return 32;
  return 65;
};

/* ─── Component ─────────────────────────────────────────────────────────── */
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

export default function ResumeTemplate9({ additionalClass, isStatic = false, resumeId, isForDownload = false }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const activeResumeId = resumeId || id;
  const containerRef = useRef();
  const resumeRef = useRef();

  const activeResume = useSelector((state) => {
    const resumes = Array.isArray(state.resume.resumes) ? state.resume.resumes : [];
    return resumes.find((r) => r.id === activeResumeId) || {};
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

  const previewResumeSize = useSelector((state) => state.resume.preview_resume_size);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(0);
  const [currentLoc, setCurrentLoc] = useState("preview");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) setCurrentLoc(pathname.split("/")[2]);
  }, [pathname]);

  const showStaticData = isStatic || currentLoc === "select-theme";

  useEffect(() => {
    const container = containerRef.current;
    const resume = resumeRef.current;
    if (!container || !resume) return;
    const update = () => {
      const newScale = container.offsetWidth / 800;
      setScale(newScale);
      setScaledHeight(resume.offsetHeight * newScale);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(resume);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [String(additionalClass), Number(previewResumeSize)]);

  const workDateLabel = (work) =>
    `${`${work.start_month || ""} ${work.start_year || ""}`.trim()} — ${
      !work.end_month || !work.end_year ? "Present" : `${work.end_month} ${work.end_year}`
    }`;
  const eduDateLabel = (edu) => (!edu.date || !edu.year ? "Ongoing" : `${edu.date} — ${edu.year}`);

  const SectionHead = ({ icon, children }) => (
    <div className="rt9_head_row">
      <span className="rt9_head_badge">{icon}</span>
      <span className="rt9_head_text">{children}</span>
      <span className="rt9_head_line" />
      <span className="rt9_head_dot" />
    </div>
  );

  const Entry = ({ title, subLine, dateLabel, description, bullets }) => (
    <div className="rt9_entry">
      <div className="rt9_entry_top">
        <p className="rt9_entry_title">{title}</p>
        {dateLabel && <span className="rt9_entry_date">{dateLabel}</span>}
      </div>
      {subLine && <p className="rt9_entry_sub">{subLine}</p>}
      {description && <p className="rt9_body_text">{description}</p>}
      {bullets && bullets.length > 0 && (
        <ul className="rt9_bullets">
          {bullets.map((line, i) => (
            <li key={i}>{line.replace(/^[-•\s]+/, "")}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="resume-preview-div"
      data-selected-resume="ResumeTemplate9"
      style={{ height: `${scaledHeight}px` }}
    >
      <div
        ref={resumeRef}
        id={isForDownload ? "resume-download-area" : undefined}
        className="position-absolute top-0 start-0"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: "800px" }}
      >
        {showStaticData ? (
          <div className={`resume ResumeTemplate9 ${additionalClass}`}>
            <div className="rt9_sidebar">
              <p className="rt9_name resume-name">Sumit Sarkar</p>
              <p className="rt9_role_tag resume-job-title">Fresher</p>
              <div className="rt9_name_underline" />

              <div className="rt9_sidebar_block">
                <div className="rt9_contact_row"><span className="rt9_contact_badge"><IconEmail /></span><span>hello@example.com</span></div>
                <div className="rt9_contact_row"><span className="rt9_contact_badge"><IconPhone /></span><span>9123456780</span></div>
                <div className="rt9_contact_row"><span className="rt9_contact_badge"><IconLocation /></span><span>Delhi, Delhi</span></div>
              </div>

              <div className="rt9_sidebar_block">
                <p className="rt9_sidebar_title">Skills</p>
                {[["HTML", 90], ["CSS", 85], ["JavaScript", 78]].map(([n, w]) => (
                  <div className="rt9_skill_block" key={n}>
                    <p className="rt9_skill_name">{n}</p>
                    <div className="rt9_skill_bar"><span style={{ width: `${w}%` }} /></div>
                  </div>
                ))}
              </div>

              <div className="rt9_sidebar_block">
                <p className="rt9_sidebar_title">Hobbies</p>
                {["Reading", "Coding", "Sketching"].map((h) => (
                  <div className="rt9_check_row" key={h}>
                    <span className="rt9_check_badge"><IconCheck /></span><span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="rt9_dot_grid">
                {Array.from({ length: 40 }).map((_, i) => <span key={i} />)}
              </div>
            </div>

            <div className="rt9_content">
              <div className="rt9_section">
                <SectionHead icon={<IconPerson />}>Summary</SectionHead>
                <p className="rt9_body_text resume-about-me">
                  Motivated fresher with a strong foundation in front-end development, eager to
                  contribute to real-world projects and grow as a software engineer.
                </p>
              </div>

              <div className="rt9_section">
                <SectionHead icon={<IconBriefcase />}>Work Experience</SectionHead>
                <Entry
                  title="Frontend Developer Intern"
                  subLine="Company Name — Location"
                  dateLabel="Feb 2026 — Present"
                  bullets={["Built responsive UI components using React.", "Collaborated with designers to implement pixel-perfect layouts."]}
                />
              </div>

              <div className="rt9_section">
                <SectionHead icon={<IconCap />}>Education</SectionHead>
                <Entry title="B.Tech in Computer Science" subLine="Sample University — Delhi" dateLabel="2022 — 2026" />
              </div>

              <div className="rt9_section">
                <SectionHead icon={<IconLanguage />}>Languages</SectionHead>
                {[["English", 5], ["Hindi", 5]].map(([lang, dots]) => (
                  <div className="rt9_lang_row" key={lang}>
                    <span className="rt9_lang_name">{lang}</span>
                    <span className="rt9_dots_row">
                      {[1, 2, 3, 4, 5].map((n) => <span key={n} className={`rt9_dot ${n <= dots ? "filled" : ""}`} />)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={`resume ResumeTemplate9 ${additionalClass}`}>
            {/* SIDEBAR */}
            <div className="rt9_sidebar">
              <p className="rt9_name resume-name">
                {personalInfomation?.firstName} {personalInfomation?.lastName}
              </p>
              {personalInfomation?.experience && (
                <p className="rt9_role_tag resume-job-title">{personalInfomation.experience}</p>
              )}
              <div className="rt9_name_underline" />

              {(personalInfomation?.email || personalInfomation?.phone || personalInfomation?.address || personalInfomation?.city || personalInfomation?.website) && (
                <div className="rt9_sidebar_block">
                  {personalInfomation?.email && (
                    <div className="rt9_contact_row resume-email"><span className="rt9_contact_badge"><IconEmail /></span><span>{personalInfomation.email}</span></div>
                  )}
                  {personalInfomation?.phone && (
                    <div className="rt9_contact_row resume-phone"><span className="rt9_contact_badge"><IconPhone /></span><span>{[personalInfomation.country_code, personalInfomation.phone].filter(Boolean).join(' ')}</span></div>
                  )}
                  {[personalInfomation?.address, personalInfomation?.city, personalInfomation?.state, personalInfomation?.country]
                    .filter(Boolean)
                    .join(", ") && (
                    <div className="rt9_contact_row resume-address"><span className="rt9_contact_badge"><IconLocation /></span><span>{[personalInfomation?.address, personalInfomation?.city, personalInfomation?.state, personalInfomation?.country].filter(Boolean).join(", ")}</span></div>
                  )}
                  {personalInfomation?.website && (
                    <div className="rt9_contact_row resume-website"><span className="rt9_contact_badge"><IconGlobe /></span><span>{personalInfomation.website}</span></div>
                  )}
                </div>
              )}

              {skills?.length > 0 && (
                <div className="rt9_sidebar_block">
                  <p className="rt9_sidebar_title">Skills</p>
                  {skills.map((skill, i) => (
                    <div className="rt9_skill_block" key={i}>
                      <p className="rt9_skill_name">{skill.skill_name}</p>
                      <div className="rt9_skill_bar"><span style={{ width: `${skillLevelToPercent(skill.proficiency_level)}%` }} /></div>
                    </div>
                  ))}
                </div>
              )}

              {hobbies?.length > 0 && (
                <div className="rt9_sidebar_block">
                  <p className="rt9_sidebar_title">Hobbies</p>
                  {hobbies.map((hobby, i) => (
                    <div className="rt9_check_row" key={i}>
                      <span className="rt9_check_badge"><IconCheck /></span><span>{hobby.hobbies || hobby}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="rt9_dot_grid">
                {Array.from({ length: 40 }).map((_, i) => <span key={i} />)}
              </div>
            </div>

            {/* CONTENT */}
            <div className="rt9_content">
              {summary?.summary && (
                <div className="rt9_section">
                  <SectionHead icon={<IconPerson />}>Summary</SectionHead>
                  <p className="rt9_body_text resume-about-me">{summary.summary}</p>
                </div>
              )}

              {work_experiences?.length > 0 && (
                <div className="rt9_section">
                  <SectionHead icon={<IconBriefcase />}>Work Experience</SectionHead>
                  {work_experiences.map((work, i) => (
                    <Entry
                      key={i}
                      title={work.job_title}
                      subLine={[work.company_name, work.location].filter(Boolean).join(" — ")}
                      dateLabel={workDateLabel(work)}
                      bullets={work.description ? work.description.split("\n").filter(Boolean) : null}
                    />
                  ))}
                </div>
              )}

              {educations?.length > 0 && (
                <div className="rt9_section">
                  <SectionHead icon={<IconCap />}>Education</SectionHead>
                  {educations.map((edu, i) => (
                    <Entry
                      key={i}
                      title={`${edu.degree}${edu.field_study ? ` in ${edu.field_study}` : ""}`}
                      subLine={[edu.institute_name, edu.location].filter(Boolean).join(" — ")}
                      dateLabel={eduDateLabel(edu)}
                    />
                  ))}
                </div>
              )}

              {certificates?.length > 0 && (
                <div className="rt9_section">
                  <SectionHead icon={<IconAward />}>Certifications</SectionHead>
                  {certificates.map((cert, i) => (
                    <div className="rt9_entry" key={i}>
                      <div className="rt9_entry_top">
                        <p className="rt9_entry_title">{cert.certificate_name}</p>
                        {cert.issue_date && <span className="rt9_entry_date">{formatDisplayDate(cert.issue_date)}</span>}
                      </div>
                      {cert.issuing_organization && <p className="rt9_entry_sub">{cert.issuing_organization}</p>}
                      {cert.description && (
                        <div className="rt9_quote_block">
                          <span className="rt9_quote_icon"><IconQuote /></span>
                          <p className="rt9_quote_text">{cert.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {any_internships?.length > 0 && (
                <div className="rt9_section">
                  <SectionHead icon={<IconBriefcase />}>Internships</SectionHead>
                  {any_internships.map((intern, i) => (
                    <Entry
                      key={i}
                      title={intern.job_title}
                      subLine={[intern.company_name, intern.location].filter(Boolean).join(" — ")}
                      dateLabel={workDateLabel(intern)}
                    />
                  ))}
                </div>
              )}

              {languages?.length > 0 && (
                <div className="rt9_section">
                  <SectionHead icon={<IconLanguage />}>Languages</SectionHead>
                  {languages.map((lang, i) => {
                    const dots = proficiencyToDots(lang.proficiency_level);
                    return (
                      <div className="rt9_lang_row" key={i}>
                        <span className="rt9_lang_name">{lang.language}</span>
                        <span className="rt9_dots_row">
                          {[1, 2, 3, 4, 5].map((n) => <span key={n} className={`rt9_dot ${n <= dots ? "filled" : ""}`} />)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {social_medias?.length > 0 && (
                <div className="rt9_section">
                  <SectionHead icon={<IconLink />}>Social Media</SectionHead>
                  <ul className="rt9_social_list">
                    {social_medias.map((social, i) => (
                      <li key={i}>
                        <span className="rt9_social_icon">{getSocialIcon(social.social_name)}</span>
                        <span>{social.social_name}: {social.social_url}</span>
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

ResumeTemplate9.layoutStyle = "two-column";
