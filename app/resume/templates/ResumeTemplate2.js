import React, { useEffect, useRef, useState } from "react";
import "../resume-css/resumeTemplate2.css";
import { useSelector } from "react-redux";
import { usePathname, useSearchParams } from "next/navigation";

/* ─── Contact Icons ─────────────────────────────────────────────────────── */
const IconEmail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
    <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);
const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"/>
  </svg>
);
const IconLocation = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);
const IconGlobe = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14A7.82 7.82 0 014 12c0-.68.09-1.35.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.008 8.008 0 015.07 16zm2.95-8H5.07a8.008 8.008 0 014.33-3.56A15.65 15.65 0 008.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.008 8.008 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.17.65.26 1.32.26 2s-.09 1.35-.26 2h-3.38z"/>
  </svg>
);

/* ─── Social Icons ───────────────────────────────────────────────────────── */
const SocialIcons = {
  Facebook: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>),
  Twitter: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>),
  LinkedIn: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>),
  Instagram: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>),
  GitHub: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>),
  Behance: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.2.561 1.884 1.477 2.26.584.23 1.354.26 1.968.07l.204-.07c.538-.196.849-.49 1.012-.939H23.726zM15.997 14h4.867c-.063-1.363-.583-2.19-2.22-2.19-1.52 0-2.395.822-2.647 2.19zM7.27 10.887c1.028 0 2.041-.318 2.041-1.487 0-1.168-.953-1.457-1.981-1.457H4v2.944h3.27zM4 13v3.395h3.48c1.196 0 2.18-.437 2.18-1.726 0-1.29-1.066-1.67-2.18-1.67H4zM0 5h8.51c2.02 0 4.514.898 4.514 3.683 0 1.562-.826 2.456-2.02 3.027C12.52 12.213 13.5 13.3 13.5 15.38 13.5 18.49 11.134 19 8.882 19H0V5z"/></svg>),
  Dribbble: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>),
  YouTube: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>),
  WhatsApp: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.135 1.535 5.874L.057 23.75a.75.75 0 00.917.918l5.97-1.487A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.666-.523-5.184-1.432l-.372-.22-3.84.957.975-3.763-.242-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>),
  Telegram: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>),
  StackOverflow: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h15.012zM6.111 19.731H16.85v-2.137H6.111v2.137zm.259-4.852l10.48 2.189.451-2.07-10.478-2.187-.453 2.068zm1.359-5.056l9.705 4.53.903-1.95-9.706-4.53-.902 1.95zm2.715-4.785l8.217 6.855 1.359-1.62-8.216-6.853-1.36 1.618zM15.751 0l-1.746 1.294 6.405 8.604 1.746-1.294L15.751 0z"/></svg>),
  Medium: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>),
  Reddit: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>),
  Pinterest: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>),
  Other: () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14A7.82 7.82 0 014 12c0-.68.09-1.35.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.008 8.008 0 015.07 16zm2.95-8H5.07a8.008 8.008 0 014.33-3.56A15.65 15.65 0 008.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.008 8.008 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.17.65.26 1.32.26 2s-.09 1.35-.26 2h-3.38z"/></svg>),
};
const getSocialIcon = (name) => { const Icon = SocialIcons[name] || SocialIcons.Other; return <Icon />; };

export default function ResumeTemplate2({ additionalClass, isStatic = false, resumeId, isForDownload = false }) {
  const searchParams = useSearchParams();
const id = searchParams.get('id');
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

  const addressParts = [personalInfomation.city, personalInfomation.state, personalInfomation.country, personalInfomation.zipCode].filter(Boolean);

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
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, [String(additionalClass), Number(previewResumeSize)]);

  /* ─── Contact row helper ─── */
  const ContactRow = ({ email, phone, address, website }) => {
    const items = [];
    if (email) items.push({ icon: <IconEmail />, text: email, cls: "resume-email" });
    if (phone) items.push({ icon: <IconPhone />, text: phone, cls: "resume-phone" });
    if (address) items.push({ icon: <IconLocation />, text: address, cls: "resume-address" });
    if (website) items.push({ icon: <IconGlobe />, text: website, cls: "resume-website" });
    return (
      <div className="rt2_contact_row">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="rt2_contact_sep">|</span>}
            <span className="rt2_contact_item">
              <span className="rt2_icon">{item.icon}</span>
              <span className={item.cls}>{item.text}</span>
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  /* ─── Entry meta row helper ─── */
  const EntryMeta = ({ parts }) => (
    <p className="rt2_entry_meta">
      <span className="rt2_icon"><IconLocation /></span>
      {parts.filter(Boolean).join(", ")}
    </p>
  );

  return (
    <div ref={containerRef} className="resume-preview-div" data-selected-resume="ResumeTemplate2" style={{ height: `${scaledHeight}px` }}>
      <div ref={resumeRef} id={isForDownload ? 'resume-download-area' : undefined} className="position-absolute top-0 start-0" style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: "800px" }}>
        {showStaticData ? (
          <div className={`resume ResumeTemplate2 ${additionalClass}`}>

            {/* HEADER */}
            <div className="rt2_header">
              <h1 className="rt2_name resume-name">Diya Agarwal</h1>
              <ContactRow email="d.agarwal@sample.in" phone="+91 11 5555 3345" address="New Delhi, India 110034" />
            </div>

            {/* SUMMARY */}
            <div className="rt2_section">
              <h3 className="rt2_section_title">Summary</h3>
              <p className="rt2_text resume-about-me">
                Customer-focused Retail Sales professional with solid understanding of retail dynamics, marketing and customer service. Offering 5 years of experience providing quality product recommendations and solutions to meet customer needs and exceed expectations.
              </p>
            </div>

            {/* SKILLS */}
            <div className="rt2_section">
              <h3 className="rt2_section_title">Skills</h3>
              <div className="rt2_skills_grid">
                <ul>
                  {[["Cash register operation","Intermediate"],["POS system operation","Advanced"],["Sales expertise","Expert"],["Teamwork","Master"]].map(([n, l]) => (
                    <li key={n}><span className="rt2_skill_name">{n}</span><span className="rt2_skill_level">{l}</span></li>
                  ))}
                </ul>
                <ul>
                  {[["Inventory management","Proficient"],["Accurate money handling","Advanced"],["Documentation","Intermediate"],["Retail merchandising","Expert"]].map(([n, l]) => (
                    <li key={n}><span className="rt2_skill_name">{n}</span><span className="rt2_skill_level">{l}</span></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* EXPERIENCE */}
            <div className="rt2_section">
              <h3 className="rt2_section_title">Experience</h3>
              <div className="rt2_entry">
                <div className="rt2_entry_head"><p className="rt2_entry_title">Retail Sales Associate</p><p className="rt2_entry_date">Feb 2017 – Present</p></div>
                <EntryMeta parts={["ZARA", "New Delhi, India"]} />
                <ul className="rt2_bullets">
                  <li>Increased monthly sales 10% by effectively upselling and cross-selling products to maximize profitability.</li>
                  <li>Prevented store losses by leveraging awareness, attention to detail, and integrity to identify and investigate concerns.</li>
                  <li>Processed payments and maintained accurate drawers to meet financial targets.</li>
                </ul>
              </div>
              <div className="rt2_entry">
                <div className="rt2_entry_head"><p className="rt2_entry_title">Barista</p><p className="rt2_entry_date">Mar 2015 – Jan 2017</p></div>
                <EntryMeta parts={["Dunkin' Donuts", "New Delhi, India"]} />
                <ul className="rt2_bullets">
                  <li>Upsold seasonal drinks and pastries, boosting average store sales by ₹1500 weekly.</li>
                  <li>Managed morning rush of over 300 customers daily with efficient, levelheaded customer service.</li>
                </ul>
              </div>
            </div>

            {/* EDUCATION */}
            <div className="rt2_section">
              <h3 className="rt2_section_title">Education and Training</h3>
              <div className="rt2_entry">
                <div className="rt2_entry_head"><p className="rt2_entry_title">Diploma in Financial Accounting</p><p className="rt2_entry_date">2016</p></div>
                <EntryMeta parts={["Oxford Software Institute", "New Delhi, India"]} />
              </div>
            </div>

            {/* LANGUAGES */}
            <div className="rt2_section">
              <h3 className="rt2_section_title">Languages</h3>
              <ul className="rt2_plain_list rt2_lang_list">
                <li><strong>Hindi:</strong> Native speaker</li>
                <li><strong>English:</strong> Fluent</li>
              </ul>
            </div>

          </div>
        ) : (
          <div className={`resume ResumeTemplate2 ${additionalClass}`}>

            {/* HEADER */}
            <div className="rt2_header">
              <h1 className="rt2_name resume-name">{personalInfomation?.firstName} {personalInfomation?.lastName}</h1>
              <ContactRow
                email={personalInfomation?.email}
                phone={personalInfomation?.phone}
                address={addressParts.length > 0 ? addressParts.join(", ") : null}
                website={personalInfomation?.website}
              />
            </div>

            {/* SUMMARY */}
            {summary?.summary && (
              <div className="rt2_section">
                <h3 className="rt2_section_title">Summary</h3>
                <p className="rt2_text resume-about-me">{summary.summary}</p>
              </div>
            )}

            {/* SKILLS */}
            {skills?.length > 0 && (
              <div className="rt2_section">
                <h3 className="rt2_section_title">Skills</h3>
                <div className="rt2_skills_grid">
                  <ul>
                    {skills.slice(0, Math.ceil(skills.length / 2)).map((skill, i) => (
                      <li key={i}>
                        <span className="rt2_skill_name">{skill.skill_name}</span>
                        {skill.proficiency_level && <span className="rt2_skill_level">{skill.proficiency_level}</span>}
                      </li>
                    ))}
                  </ul>
                  <ul>
                    {skills.slice(Math.ceil(skills.length / 2)).map((skill, i) => (
                      <li key={i}>
                        <span className="rt2_skill_name">{skill.skill_name}</span>
                        {skill.proficiency_level && <span className="rt2_skill_level">{skill.proficiency_level}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* PROFESSIONAL EXPERIENCE */}
            {work_experiences?.length > 0 && (
              <div className="rt2_section">
                <h3 className="rt2_section_title">Experience</h3>
                {work_experiences.map((work, i) => (
                  <div className="rt2_entry" key={i}>
                    <div className="rt2_entry_head">
                      <p className="rt2_entry_title">{work.job_title}</p>
                      <p className="rt2_entry_date">
                        {`${work.start_month || ""} ${work.start_year || ""}`.trim()} –{" "}
                        {!work.end_month || !work.end_year ? "Present" : `${work.end_month} ${work.end_year}`}
                      </p>
                    </div>
                    <EntryMeta parts={[work.company_name, work.location, work.employee_type]} />
                    {work.description && (
                      <ul className="rt2_bullets">
                        {work.description.split("\n").filter(Boolean).map((line, j) => (
                          <li key={j}>{line.replace(/^[-•\s]+/, "")}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* INTERNSHIPS */}
            {any_internships?.length > 0 && (
              <div className="rt2_section">
                <h3 className="rt2_section_title">Internships</h3>
                {any_internships.map((intern, i) => (
                  <div className="rt2_entry" key={i}>
                    <div className="rt2_entry_head">
                      <p className="rt2_entry_title">{intern.job_title}</p>
                      <p className="rt2_entry_date">
                        {`${intern.start_month || ""} ${intern.start_year || ""}`.trim()} –{" "}
                        {!intern.end_month || !intern.end_year ? "Present" : `${intern.end_month} ${intern.end_year}`}
                      </p>
                    </div>
                    <EntryMeta parts={[intern.company_name, intern.location, intern.employee_type]} />
                  </div>
                ))}
              </div>
            )}

            {/* EDUCATION */}
            {educations?.length > 0 && (
              <div className="rt2_section">
                <h3 className="rt2_section_title">Education and Training</h3>
                {educations.map((edu, i) => (
                  <div className="rt2_entry" key={i}>
                    <div className="rt2_entry_head">
                      <p className="rt2_entry_title">{edu.degree} in {edu.field_study}</p>
                      <p className="rt2_entry_date">{!edu.date || !edu.year ? "Still Studying" : `${edu.date} ${edu.year}`}</p>
                    </div>
                    <EntryMeta parts={[edu.institute_name, edu.location]} />
                  </div>
                ))}
              </div>
            )}

            {/* CERTIFICATES */}
            {certificates?.length > 0 && (
              <div className="rt2_section">
                <h3 className="rt2_section_title">Certificates</h3>
                {certificates.map((cert, i) => (
                  <div className="rt2_entry" key={i}>
                    <div className="rt2_entry_head">
                      <p className="rt2_entry_title">{cert.certificate_name}</p>
                      {cert.issue_date && <p className="rt2_entry_date">{cert.issue_date}</p>}
                    </div>
                    {cert.issuing_organization && <EntryMeta parts={[cert.issuing_organization]} />}
                    {cert.description && <p className="rt2_text">{cert.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* LANGUAGES */}
            {languages?.length > 0 && (
              <div className="rt2_section">
                <h3 className="rt2_section_title">Languages</h3>
                <ul className="rt2_plain_list rt2_lang_list">
                  {languages.map((lang, i) => (
                    <li key={i}><strong>{lang.language}:</strong> {lang.proficiency_level}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* HOBBIES */}
            {hobbies?.length > 0 && (
              <div className="rt2_section">
                <h3 className="rt2_section_title">Activities & Interests</h3>
                <ul className="rt2_plain_list rt2_hobbies_list">
                  {hobbies.map((hobby, i) => <li key={i}>{hobby.hobbies}</li>)}
                </ul>
              </div>
            )}

            {/* SOCIAL MEDIA */}
            {social_medias?.length > 0 && (
              <div className="rt2_section">
                <h3 className="rt2_section_title">Social</h3>
                <ul className="rt2_plain_list rt2_social_list">
                  {social_medias.map((social, i) => {
                    const url = social.social_url?.startsWith("http") ? social.social_url : `https://${social.social_url}`;
                    return (
                      <li key={i}>
                        <span className="rt2_social_icon">{getSocialIcon(social.social_name)}</span>
                        <strong>{social.social_name}:</strong>{" "}
                        <a href={url} target="_blank" rel="noopener noreferrer">{social.social_url}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

ResumeTemplate2.layoutStyle = "single-column";
