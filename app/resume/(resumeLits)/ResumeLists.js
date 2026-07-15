'use client';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setResumes } from '../reducer/resume-reducer';
import React, { useState } from 'react';
import Footer from '../../components/Footer';
import FooterNav from '../../components/FooterNav';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { createResumePdf } from '../resume-pdf/createResumePdf';
import ResumeTemplate1 from '../templates/ResumeTemplate1';
import ResumeTemplate2 from '../templates/ResumeTemplate2';
import ResumeTemplate3 from '../templates/ResumeTemplate3';
import ResumeTemplate4 from '../templates/ResumeTemplate4';
import "./resume-list.css";

const AVAILABLE_TEMPLATES = {
  ResumeTemplate1,
  ResumeTemplate2,
  ResumeTemplate3,
  ResumeTemplate4,
};

const buildResumeText = (resume) => {
  const personal = resume.personal_infomation || {};
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || resume.resume_name || 'Resume';
  const lines = [
    fullName,
    [personal.email, personal.phone, personal.city, personal.state].filter(Boolean).join(' | '),
    personal.website || '',
    '',
  ];

  if (resume.summary?.summary) lines.push('SUMMARY', resume.summary.summary, '');
  if (resume.educations?.length) {
    lines.push('EDUCATION');
    resume.educations.forEach((item) => lines.push(
      `${item.degree || ''}${item.field_study ? ` in ${item.field_study}` : ''}`,
      [item.institute_name, item.location, item.date, item.year].filter(Boolean).join(' | ')
    ));
    lines.push('');
  }
  if (resume.skills?.length) {
    lines.push('SKILLS', resume.skills.map((item) => [item.skill_name, item.proficiency_level].filter(Boolean).join(' - ')).join(', '), '');
  }
  if (resume.work_experiences?.length) {
    lines.push('WORK EXPERIENCE');
    resume.work_experiences.forEach((item) => lines.push(
      [item.job_title, item.company_name, item.employee_type].filter(Boolean).join(' | '),
      [item.location, item.start_month, item.start_year, item.end_month, item.end_year].filter(Boolean).join(' '),
      item.description || ''
    ));
    lines.push('');
  }
  if (resume.certificates?.length) {
    lines.push('CERTIFICATIONS');
    resume.certificates.forEach((item) => lines.push([item.certificate_name, item.issuing_organization, item.issue_date].filter(Boolean).join(' | ')));
    lines.push('');
  }
  if (resume.languages?.length) {
    lines.push('LANGUAGES', resume.languages.map((item) => [item.language, item.proficiency_level].filter(Boolean).join(' - ')).join(', '), '');
  }
  if (resume.hobbies?.length) {
    lines.push('HOBBIES', resume.hobbies.map((item) => item.hobbies).filter(Boolean).join(', '), '');
  }

  return lines.filter((line, index, arr) => line || arr[index - 1]).join('\n');
};

const safeFileName = (resume) => (resume.resume_name || `${resume.personal_infomation?.firstName || 'resume'}-${resume.id}`)
  .replace(/[^\w-]+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')
  .toLowerCase() || 'resume';

export default function ResumeLists() {
  const dispatch = useDispatch();
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [renderResumeId, setRenderResumeId] = useState(null);

  const resumeLists = useSelector(
    (state) => Array.isArray(state.resume.resumes) ? state.resume.resumes : []
  );
  const submittedResumeLists = resumeLists
    .filter((resume) => resume.is_submitted !== false)
    .sort((a, b) => (b.updated_at || Number(b.id) || 0) - (a.updated_at || Number(a.id) || 0));

  const formatResumeDate = (value) => {
    const dateValue = Number(value);
    if (!dateValue) return 'N/A';
    return new Date(dateValue).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).replace(',', '');
  };

  const openDeleteModal = (id) => {
    setSelectedResumeId(id);
    if (typeof window !== 'undefined' && window.bootstrap) {
      const modalEl = document.getElementById('completedModal');
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  };

  const handleConfirmDeleteResume = () => {
    const updatedResumes = resumeLists.filter(
      (resume) => resume.id !== selectedResumeId
    );
    dispatch(setResumes(updatedResumes));
    const modalEl = document.querySelector('.modal.show');
    if (modalEl && window.bootstrap) {
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    }
    toast.success('Deleted successfully.', {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: false,
      theme: "light",
    });
  };

  const downloadTXT = (resume) => {
    const blob = new Blob([buildResumeText(resume)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeFileName(resume)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const waitForThemeElement = async (resume) => {
    setRenderResumeId(resume.id);
    const startTime = Date.now();
    return new Promise((resolve) => {
      const check = () => {
        const element = document.querySelector(`#resume-list-render-${resume.id} #resume-download-area`);
        if (element) { resolve(element); return; }
        if (Date.now() - startTime > 1500) { resolve(null); return; }
        requestAnimationFrame(check);
      };
      check();
    });
  };

  const trimCanvasWhiteSpace = (canvas) => {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height).data;
    const isRowBlank = (row) => {
      const offset = row * width * 4;
      let nonBlank = 0;
      for (let x = 0; x < width; x += 1) {
        const alpha = imageData[offset + x * 4 + 3];
        const red = imageData[offset + x * 4];
        const green = imageData[offset + x * 4 + 1];
        const blue = imageData[offset + x * 4 + 2];
        if (alpha !== 0 && !(red >= 250 && green >= 250 && blue >= 250)) {
          nonBlank += 1;
          if (nonBlank > width * 0.02) return false;
        }
      }
      return true;
    };
    let top = 0;
    while (top < height && isRowBlank(top)) top += 1;
    let bottom = height - 1;
    while (bottom >= 0 && isRowBlank(bottom)) bottom -= 1;
    if (top === 0 && bottom === height - 1) return canvas;
    const newHeight = Math.max(0, bottom - top + 1);
    if (newHeight <= 0) return canvas;
    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = width;
    trimmedCanvas.height = newHeight;
    trimmedCanvas.getContext('2d').putImageData(ctx.getImageData(0, top, width, newHeight), 0, 0);
    return trimmedCanvas;
  };

  const findPageBreakRow = (canvas, startRow, maxSearchHeight) => {
    const ctx = canvas.getContext('2d');
    const { width } = canvas;
    const imageData = ctx.getImageData(0, 0, width, canvas.height).data;
    const isRowBlank = (row) => {
      const offset = row * width * 4;
      let nonBlank = 0;
      for (let x = 0; x < width; x += 1) {
        const alpha = imageData[offset + x * 4 + 3];
        const red = imageData[offset + x * 4];
        const green = imageData[offset + x * 4 + 1];
        const blue = imageData[offset + x * 4 + 2];
        if (alpha !== 0 && !(red >= 250 && green >= 250 && blue >= 250)) {
          nonBlank += 1;
          if (nonBlank > width * 0.02) return false;
        }
      }
      return true;
    };
    const endRow = Math.max(0, startRow - Math.min(maxSearchHeight, startRow));
    for (let row = startRow - 1; row > endRow; row -= 1) {
      if (isRowBlank(row)) return row;
    }
    return startRow;
  };

  const downloadPDF = async (resume) => {
    try {
      await createResumePdf({
        resume,
        fileName: resume.resume_name || 'resume',
          selectedTheme: resume.configuration?.selected_theme || 'ResumeTemplate1',
          palette: resume.configuration?.color_palette || 'color-1',
          selectedFont: resume.configuration?.font_style,
      });
    } catch (err) {
      console.error('PDF generation failed:', err);
      toast.error('PDF download failed. Please try again.', { position: 'top-right', autoClose: 3000, theme: 'light' });
    }
  };

  const downloadDOCX = (resume) => {
    const paragraphs = buildResumeText(resume).split('\n').map((line, index) => {
      const isHeading = index === 0 || (line && line === line.toUpperCase() && line.length < 30);
      return new Paragraph({ spacing: { after: isHeading ? 180 : 100 }, children: [new TextRun({ text: line, bold: isHeading, size: index === 0 ? 28 : 22 })] });
    });
    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    Packer.toBlob(doc).then((blob) => saveAs(blob, `${safeFileName(resume)}.docx`));
  };

  const printResume = async (resume) => {
    const element = await waitForThemeElement(resume);
    if (!element) {
      toast.error('Resume preview not ready. Please try again.', { position: 'top-right', autoClose: 3000, theme: 'light' });
      return;
    }
    const printContainer = document.createElement('div');
    printContainer.id = '__resume_list_print_root__';
    printContainer.style.cssText = 'display:none;position:fixed;inset:0;background:#fff;z-index:9999999;margin:0;padding:0;';
    const innerWrapper = document.createElement('div');
    innerWrapper.className = `print-wrapper ${resume.configuration?.color_palette || ''} ${resume.configuration?.font_style || ''}`;
    innerWrapper.style.cssText = 'width:100%;margin:0;padding:0;';
    const clone = element.cloneNode(true);
    clone.style.cssText = 'width:100% !important;max-width:100% !important;transform:none !important;position:static !important;box-shadow:none !important;overflow:visible !important;margin:0 !important;padding:0 !important;';
    innerWrapper.appendChild(clone);
    printContainer.appendChild(innerWrapper);
    document.body.appendChild(printContainer);
    const styleTag = document.createElement('style');
    styleTag.id = '__resume_list_print_style__';
    // try to inline available stylesheets (ignore cross-origin ones)
    let collectedCss = '';
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (let i = 0; i < rules.length; i += 1) collectedCss += rules[i].cssText;
      } catch (e) {
        // ignore stylesheets we can't access (cross-origin)
      }
    });
    collectedCss += `@media print{body>*:not(#__resume_list_print_root__){display:none !important;visibility:hidden !important;}html,body{margin:0 !important;padding:0 !important;height:auto !important;min-height:auto !important;overflow:visible !important;background:#fff !important;}#__resume_list_print_root__{display:block !important;position:relative !important;width:100% !important;max-width:100% !important;height:auto !important;overflow:visible !important;margin:0 !important;padding:0 !important;background:#fff !important;}#__resume_list_print_root__ *{visibility:visible !important;-webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;color-adjust:exact !important;}@page{size:A4 portrait;margin:10mm 0 10mm 0 !important;}@page :first{margin-top:0 !important;}}`;
    styleTag.innerHTML = collectedCss;
    document.head.appendChild(styleTag);
    const cleanup = () => {
      const root = document.getElementById('__resume_list_print_root__');
      const style = document.getElementById('__resume_list_print_style__');
      if (root) document.body.removeChild(root);
      if (style) document.head.removeChild(style);
      window.removeEventListener('afterprint', cleanup);
      setRenderResumeId(null);
    };
    window.addEventListener('afterprint', cleanup);
    setTimeout(() => { window.print(); setTimeout(cleanup, 5000); }, 150);
  };

  // ── ATS Score Calculator ──────────────────────────────────────────────
  const ATS_CRITERIA = [
    { key: 'email', label: 'Email Address', points: 15, check: (r) => !!r.personal_infomation?.email },
    { key: 'phone', label: 'Phone Number', points: 15, check: (r) => !!r.personal_infomation?.phone },
    {
      key: "linkedin",
      label: "LinkedIn Profile",
      points: 10,
      check: (r) => {
        const socials = r.social_medias || [];

        return socials.some((s) => {
          const name = (s.social_name || "").trim().toLowerCase();
          const url = (s.social_url || "").trim().toLowerCase();

          return (
            name === "linkedin" &&
            url &&
            url.includes("linkedin.com")
          );
        });
      },
    },
    { key: 'education', label: 'Education Section', points: 15, check: (r) => !!r.educations?.length },
    { key: 'experience', label: 'Work Experience', points: 25, check: (r) => !!r.work_experiences?.length },
    { key: 'skills', label: 'Skills Section', points: 10, check: (r) => !!r.skills?.length },
    { key: 'summary', label: 'Professional Summary', points: 10, check: (r) => !!r.summary?.summary },
  ];

  const calcAtsScore = (resume) =>
    ATS_CRITERIA.reduce((acc, c) => acc + (c.check(resume) ? c.points : 0), 0);

  const getAtsSuggestions = (resume) =>
    ATS_CRITERIA.filter((c) => !c.check(resume));

  const atsClass = (score) => {
    if (score >= 75) return 'ats-high';
    if (score >= 45) return 'ats-mid';
    return 'ats-low';
  };

  const renderResume = resumeLists.find((resume) => resume.id === renderResumeId);
  const RenderTemplate = renderResume
    ? AVAILABLE_TEMPLATES[renderResume.configuration?.selected_theme || 'ResumeTemplate1'] || ResumeTemplate1
    : null;

  return (
    <>
      {/* ── Hero ── */}
      <section className="container-fluid custom-container small-hero-area">
        <div className="left-part">
          <div>
            <label className="tl-eyebrow fs-mob-12">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
                <polyline points="15 2 15 8 21 8" />
                <path d="M9 18V12M9 12l-2 2M9 12l2 2" />
              </svg>
              100% Free • ATS Optimized
            </label>
            <h1 className="fs-mob-22">Manage Your Resumes</h1>
          </div>
          <p className="fs-mob-16">Keep all your resumes organized, update them anytime, and export them in PDF, Word, or text format with ease.</p>
          <Link className="rl-create-btn" href="/resume/resume-type">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create New Resume
          </Link>
        </div>
        <div className="right-part d-none d-md-block">
          <img src="/front-assets/images/resume-hero.webp" className="img-fluid" width={500} alt="Resume hero" />
        </div>
      </section>

      {/* ── Resume Cards ── */}
      <section className="resumelist-section py-custom pb-120">
        <div className="container-fluid custom-container">
          {submittedResumeLists.length > 0 ? (
            <div className="row g-4">
              {submittedResumeLists.map((resume) => {
                const initials = (resume.personal_infomation?.firstName?.[0] || resume.resume_name?.[0] || 'R').toUpperCase();
                const photo = resume.personal_infomation?.photo || resume.personal_infomation?.profile_image || resume.personal_infomation?.image || null;
                const atsScore = calcAtsScore(resume);
                const atsCls = atsClass(atsScore);
                return (
                  <div className="col-12 col-md-6 col-xl-4" key={resume.id}>
                    <div className="rl-card h-100">

                      {/* Hover accent bar */}
                      <div className="rl-card__accent" />

                      {/* ATS Badge — SVG arc progress + hover tooltip */}
                      {(() => {
                        const suggestions = getAtsSuggestions(resume);
                        const radius = 22;
                        const circ = 2 * Math.PI * radius;
                        const dash = (atsScore / 100) * circ;
                        const arcColor = atsCls === 'ats-high' ? '#16a34a' : atsCls === 'ats-mid' ? '#d97706' : '#cc0000';
                        return (
                          <div className="rl-card__ats-wrap">
                            <div className={`rl-card__ats-badge ${atsCls}`}>
                              <svg width="54" height="54" viewBox="0 0 54 54" className="rl-ats-svg">
                                <circle cx="27" cy="27" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="3.5" />
                                <circle
                                  cx="27" cy="27" r={radius}
                                  fill="none"
                                  stroke={arcColor}
                                  strokeWidth="3.5"
                                  strokeDasharray={`${dash} ${Math.max(0, circ - dash)}`}
                                  strokeDashoffset={circ * 0.25}
                                  strokeLinecap="round"
                                  className="rl-ats-arc"
                                />
                              </svg>
                              <div className="rl-card__ats-inner">
                                <span className="rl-card__ats-score">{atsScore}%</span>
                                <span className="rl-card__ats-label">ATS</span>
                              </div>
                            </div>
                            {suggestions.length > 0 && (
                              <div className="rl-card__ats-tooltip">
                                <p className="rl-ats-tt-title">Boost your ATS score</p>
                                <ul className="rl-ats-tt-list">
                                  {suggestions.map((s) => (
                                    <li key={s.key}>
                                      <span className="rl-ats-tt-dot" />
                                      <span>{s.label}</span>
                                      <span className="rl-ats-tt-pts">+{s.points}%</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Card header */}
                      <div className="rl-card__head">
                        <div className="rl-card__avatar">{photo ? (
                          <img src={photo} alt={`${resume.resume_name || initials} profile`} className="rl-card__avatar-img" />
                        ) : initials}</div>
                        <div className="rl-card__title-group">
                          <p className="rl-card__name">{resume?.resume_name || 'Untitled Resume'}</p>
                          <span className="rl-card__date">
                            Updated {formatResumeDate(resume.updated_at || resume.id)}
                          </span>
                        </div>
                      </div>

                      {/* Meta info */}
                      <div className="rl-card__meta">
                        <div className="rl-card__meta-row">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                          <span>{[resume.personal_infomation?.firstName, resume.personal_infomation?.lastName].filter(Boolean).join(' ') || 'N/A'}</span>
                        </div>
                        <div className="rl-card__meta-row">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                          <span>{resume.personal_infomation?.email || 'N/A'}</span>
                        </div>
                        <div className="rl-card__meta-row">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 9.81a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 7.91a16 16 0 0 0 5.45 5.45l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14.92z" /></svg>
                          <span>{resume.personal_infomation?.phone || 'N/A'}</span>
                        </div>
                        <div className="rl-card__meta-row">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.418-8 12-8 12S4 14.418 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
                          <span>{[resume.personal_infomation?.city, resume.personal_infomation?.state].filter(Boolean).join(', ') || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="rl-card__divider" />

                      {/* Action buttons */}
                      <div className="rl-card__actions">
                        <Link href={`/resume/preview?id=${resume.id}`} className="rl-card__action-btn rl-card__action-btn--view">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
                          Preview
                        </Link>
                        <Link href={`/resume/select-theme/?id=${resume.id}`} className="rl-card__action-btn rl-card__action-btn--edit">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                          Edit
                        </Link>
                        <button className="rl-card__action-btn rl-card__action-btn--delete" onClick={() => openDeleteModal(resume.id)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
                          Delete
                        </button>
                      </div>

                      {/* Export strip */}
                      <div className="rl-card__downloads mt-auto d-none">
                        <span className="rl-card__dl-label">Export as</span>
                        <div className="rl-card__dl-btns">
                          <button type="button" className="rl-card__dl-btn" onClick={() => downloadPDF(resume)} title="Export PDF">
                            {/* PDF icon */}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <path d="M9 15h1.5a1.5 1.5 0 0 0 0-3H9v6" />
                            </svg>
                            PDF
                          </button>
                          <button type="button" className="rl-card__dl-btn" onClick={() => downloadDOCX(resume)} title="Export Word">
                            {/* Doc/Word icon */}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                              <line x1="10" y1="9" x2="8" y2="9" />
                            </svg>
                            Word
                          </button>
                          <button type="button" className="rl-card__dl-btn" onClick={() => downloadTXT(resume)} title="Export Text">
                            {/* Text/TXT icon */}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <line x1="9" y1="13" x2="15" y2="13" />
                              <line x1="9" y1="17" x2="12" y2="17" />
                            </svg>
                            Text
                          </button>
                          <button type="button" className="rl-card__dl-btn" onClick={() => printResume(resume)} title="Print">
                            {/* Printer icon */}
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 6 2 18 2 18 9" />
                              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                              <rect x="6" y="14" width="12" height="8" />
                            </svg>
                            Print
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                <div className="rl-empty">
                  <div className="rl-empty__icon-wrap">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
                      <polyline points="15 2 15 8 21 8" />
                      <line x1="9" y1="13" x2="15" y2="13" />
                      <line x1="9" y1="17" x2="12" y2="17" />
                    </svg>
                  </div>
                  <h2 className="rl-empty__title">No Resumes Yet</h2>
                  <p className="rl-empty__sub">You haven't created any resumes. Start building your professional resume in minutes.</p>
                  <Link href="/resume/resume-type" className="rl-create-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Create Your First Resume
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
<Footer/>
      <FooterNav />

      {/* Offscreen render target */}
      {renderResume && RenderTemplate && (
        <div
          id={`resume-list-render-${renderResume.id}`}
          className={`print-wrapper review-resume-div ${renderResume.configuration?.color_palette || ''} ${renderResume.configuration?.font_style || ''}`}
          style={{ position: 'fixed', left: '-9999px', top: 0, width: '800px', background: '#fff', pointerEvents: 'none', zIndex: -1, margin: 0, padding: 0 }}
        >
          <RenderTemplate
            resumeId={renderResume.id}
            isForDownload={true}
            additionalClass={`${renderResume.configuration?.color_palette || ''} ${renderResume.configuration?.font_style || ''}`}
          />
        </div>
      )}

      {/* Delete Modal */}
      <div className="modal fade completedModal" id="completedModal" tabIndex="-1" aria-labelledby="completedModalLabel" data-bs-backdrop="static" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body py-4">
              <img src="/front-assets/images/icons/delete-resume.svg" width={175} height={175} className="img-fluid mx-auto d-block" alt="Completed" />
              <h5 className="heading">Delete This Resume?</h5>
              <p className="sub-heading">Are you sure you want to delete this resume? This action cannot be undone.</p>
              <div className="btn-div">
                <button className="cancel-btn" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                <button className="delete-btn" onClick={handleConfirmDeleteResume}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />

    </>
  );
}