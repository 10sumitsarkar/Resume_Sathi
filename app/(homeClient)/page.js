"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import NavBar from '../components/NavBar';
import "../../public/front-assets/css/home.css"; // compiled from home.scss

// ── SVG Icon Library ──────────────────────────────────────────────────────
const Icon = {
  Shield: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Zap: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Download: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  FileText: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Type: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  ),
  Gradient: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="2.5" />
      <circle cx="19" cy="17" r="2" />
      <circle cx="6" cy="17" r="3" />
      <path d="M6 17 Q13 6 19 17" />
    </svg>
  ),
  Code: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Mail: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  MapPin: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Calendar: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Users: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Lock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Sparkle: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.6H22l-6.4 4.6 2.4 7.6L12 17.2 6 21.8l2.4-7.6L2 9.6h7.6z" />
    </svg>
  ),
  ChevRight: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  ChevDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  ChevLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevRightNav: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  QuoteIcon: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" opacity="0.12">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  CheckCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Rocket: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
};

// ── Live Counter ──────────────────────────────────────────────────────────
function LiveCounter() {
  const [count, setCount] = useState(4312);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const schedule = () => {
      const delay = 18000 + Math.random() * 22000;
      return setTimeout(() => {
        const add = Math.floor(Math.random() * 5) + 1;
        setCount(c => c + add);
        setFlash(true);
        setTimeout(() => setFlash(false), 600);
        schedule();
      }, delay);
    };
    const t = schedule();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rk-live-bar">
      <span className="rk-live-dot" />
      <span className={`rk-live-num${flash ? " rk-live-flash" : ""}`}>
        {count.toLocaleString("en-IN")}
      </span>
      <span className="rk-live-text">resumes created today — join them</span>
    </div>
  );
}

// ── Hero Slideshow ────────────────────────────────────────────────────────
const heroSlides = [
  { src: "/front-assets/images/resume-img/template1-preview.jpg", label: "Classic — Template 1" },
  { src: "/front-assets/images/resume-img/template2-preview.jpg", label: "Modern Sidebar — Template 2" },
  { src: "/front-assets/images/resume-img/template3-preview.jpg", label: "Bold Accent — Template 3" },
  { src: "/front-assets/images/resume-img/template4-preview.jpg", label: "Executive — Template 4" },
  { src: "/front-assets/images/resume-img/template5-preview.jpg", label: "Minimal — Template 5" },
];

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState("next");
  const timerRef = useRef(null);

  const go = (idx, direction = "next") => {
    setDir(direction);
    setCurrent(idx);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      go((current + 1) % heroSlides.length, "next");
    }, 3200);
    return () => clearInterval(timerRef.current);
  }, [current]);

  return (
    <div className="rk-hero-slideshow">
      <div className="rk-slide-blob rk-slide-blob--1" />
      <div className="rk-slide-blob rk-slide-blob--2" />

      <div className="rk-slide-frame">
        <div className="rk-slide-topbar">
          <span className="rk-slide-dot" style={{ background: "#FF5F57" }} />
          <span className="rk-slide-dot" style={{ background: "#FEBC2E" }} />
          <span className="rk-slide-dot" style={{ background: "#28C840" }} />
          <span className="rk-slide-label">{heroSlides[current].label}</span>
        </div>

        <div className="rk-slide-img-wrap">
          {heroSlides.map((s, i) => (
            <div
              key={i}
              className={`rk-slide-item${i === current ? " rk-slide-item--active" : ""} rk-slide-item--${dir}`}
            >
              <img
                src={s.src}
                alt={s.label}
                className="rk-slide-img"
                onError={e => {
                  e.target.style.display = "none";
                  if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                }}
              />
              {/* Fallback placeholder */}
              <div className="rk-slide-fallback" style={{ display: "none" }}>
                <div className="rk-ph-card">
                  <div className="rk-ph-header">
                    <div className="rk-ph-avatar" />
                    <div>
                      <div className="rk-ph-line w55" />
                      <div className="rk-ph-line w35" />
                    </div>
                  </div>
                  <div className="rk-ph-divider" />
                  <div className="rk-ph-section-label" />
                  <div className="rk-ph-line w90" />
                  <div className="rk-ph-line w80" />
                  <div className="rk-ph-line w85" />
                  <div className="rk-ph-section-label" style={{ marginTop: 10 }} />
                  <div className="rk-ph-line w70" />
                  <div className="rk-ph-line w60" />
                  <div className="rk-ph-section-label" style={{ marginTop: 10 }} />
                  <div className="rk-ph-skills"><span /><span /><span /></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rk-slide-dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`rk-dot${i === current ? " rk-dot--active" : ""}`}
              onClick={() => go(i, i > current ? "next" : "prev")}
            />
          ))}
        </div>
      </div>

      {/* Floating badges */}
      <div className="rk-float-badge rk-float-badge--tl">
        <div className="rk-fb-icon"><Icon.Lock /></div>
        <div>
          <div className="rk-fb-title">Data stays local</div>
          <div className="rk-fb-sub">No server. Ever.</div>
        </div>
      </div>
      <div className="rk-float-badge rk-float-badge--br">
        <Icon.Sparkle />
        <span>Free forever</span>
      </div>
    </div>
  );
}

// ── Template Mini Preview ─────────────────────────────────────────────────
function TemplateMini({ accent, bg }) {
  return (
    <div className="rk-tmini" style={{ "--ta": accent, "--tb": bg }}>
      <div className="rk-tmini-head">
        <div className="rk-tmini-av" />
        <div style={{ flex: 1 }}>
          <div className="rk-tmini-bar rk-tmini-bar--nm" />
          <div className="rk-tmini-bar" style={{ width: "42%" }} />
        </div>
      </div>
      <div className="rk-tmini-rule" />
      <div className="rk-tmini-body">
        <div className="rk-tmini-bar rk-tmini-bar--sec" />
        <div className="rk-tmini-bar" style={{ width: "92%" }} />
        <div className="rk-tmini-bar" style={{ width: "78%" }} />
        <div className="rk-tmini-bar" style={{ width: "86%" }} />
        <div className="rk-tmini-bar rk-tmini-bar--sec" style={{ marginTop: 8 }} />
        <div className="rk-tmini-bar" style={{ width: "68%" }} />
        <div className="rk-tmini-bar" style={{ width: "58%" }} />
      </div>
    </div>
  );
}

// ── Template Card ─────────────────────────────────────────────────────────
const templates = [
  { id: 1, name: "Classic", desc: "Single-column, ATS-safe. Best for corporate & govt roles.", accent: "#cc0000", bg: "#fff5f5", path: "/resume/templates/ResumeTemplate1" },
  { id: 2, name: "Modern Sidebar", desc: "Two-column with sidebar. Great for tech and design pros.", accent: "#1a56db", bg: "#eff6ff", path: "/resume/templates/ResumeTemplate2" },
  { id: 3, name: "Bold Accent", desc: "Color header, strong hierarchy. Perfect for creative roles.", accent: "#059669", bg: "#f0fdf4", path: "/resume/templates/ResumeTemplate3" },
  { id: 4, name: "Executive", desc: "Dark header, premium feel. Ideal for senior professionals.", accent: "#7c3aed", bg: "#f5f3ff", path: "/resume/templates/ResumeTemplate4" },
  { id: 5, name: "Minimal", desc: "Typography-first, ultra-clean. Speaks through whitespace.", accent: "#0f172a", bg: "#f8fafc", path: "/resume/templates/ResumeTemplate5" },
];

function TemplateCard({ tpl }) {
  return (
    <div className="rk-tc">
      <div className="rk-tc-preview" style={{ background: tpl.bg }}>
        <TemplateMini accent={tpl.accent} bg={tpl.bg} />
        <div className="rk-tc-overlay">
          <div>
            <Link href={`${tpl.path}?create=true`} className="rk-ov-btn rk-ov-btn--red">
              <Icon.FileText /> Create Resume
            </Link>
            <button className="rk-ov-btn rk-ov-btn--ghost">
              <Icon.Eye /> View Saved
            </button>
          </div>
        </div>
      </div>
      <div className="rk-tc-info">
        <div className="rk-tc-name-row">
          <span className="rk-tc-name">{tpl.name}</span>
          <span className="rk-free-pill">Free</span>
        </div>
        <p className="rk-tc-desc">{tpl.desc}</p>
        <div className="rk-tc-btns">
          <Link href={`${tpl.path}?create=true`} className="rk-tpl-btn rk-tpl-btn--fill">
            <Icon.FileText /> Create
          </Link>
          <button className="rk-tpl-btn rk-tpl-btn--line">
            <Icon.Eye /> Saved
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tools ─────────────────────────────────────────────────────────────────
const tools = [
  { icon: <Icon.Type />, name: "Text Transformer", desc: "Convert text to UPPERCASE, lowercase, Title Case, camelCase, slug-format, and more instantly.", href: "/tools/text-transform" },
  { icon: <Icon.Gradient />, name: "Gradient Generator", desc: "Build beautiful CSS gradients with live preview and one-click copy for your projects.", href: "/tools/gradient-generator" },
  { icon: <Icon.Code />, name: "Code Editor", desc: "Lightweight in-browser editor with syntax highlighting. No install, no login required.", href: "/tools/code-editor" },
  { icon: <Icon.Mail />, name: "Cover Letter Builder", desc: "Build a professional cover letter with structured sections. Saved locally like your resume.", href: "/cover-letter" },
];

// ── Government Jobs ───────────────────────────────────────────────────────
const govtJobs = [
  { org: "UPSC", title: "Civil Services Examination 2025", location: "All India", deadline: "Aug 15, 2025", posts: "1,105 vacancies" },
  { org: "SSC", title: "Combined Graduate Level (CGL) 2025", location: "Pan India", deadline: "Sep 4, 2025", posts: "17,727 vacancies" },
  { org: "IBPS", title: "Probationary Officer (PO) 2025", location: "Pan India", deadline: "Jul 28, 2025", posts: "4,455 vacancies" },
  { org: "Railway RRB", title: "NTPC Graduate Level 2025", location: "Zone-wise", deadline: "Oct 12, 2025", posts: "11,558 vacancies" },
  { org: "NHM", title: "Staff Nurse & Medical Officer", location: "State-wise", deadline: "Jul 20, 2025", posts: "3,200 vacancies" },
  { org: "DSSSB", title: "Teaching & Non-Teaching Roles", location: "Delhi NCT", deadline: "Aug 30, 2025", posts: "6,000+ vacancies" },
];

function JobCard({ job }) {
  return (
    <div className="rk-jc">
      <div className="rk-jc-top">
        <span className="rk-jc-org">{job.org}</span>
        <span className="rk-jc-badge">Govt</span>
      </div>
      <div className="rk-jc-title">{job.title}</div>
      <div className="rk-jc-meta">
        <span><Icon.MapPin /> {job.location}</span>
        <span><Icon.Calendar /> {job.deadline}</span>
        <span><Icon.Users /> {job.posts}</span>
      </div>
      <button className="rk-jc-apply">View & Apply <Icon.ChevRight /></button>
    </div>
  );
}

// ── Blog ──────────────────────────────────────────────────────────────────
const blogs = [
  {
    img: "/front-assets/images/blog/resume-tips.jpg",
    cat: "Resume Writing",
    title: "10 must-have resume sections for freshers that hiring managers look for",
    desc: "No experience? No problem. These sections make your resume professional even without a job history.",
    date: "June 12, 2025",
  },
  {
    img: "/front-assets/images/blog/govt-jobs.jpg",
    cat: "Government Jobs",
    title: "How to write a government job resume in 2025 — format and practical tips",
    desc: "Govt jobs require a different format. Know what to include and what to avoid for sarkari naukri applications.",
    date: "June 5, 2025",
  },
  {
    img: "/front-assets/images/blog/cover-letter.jpg",
    cat: "Cover Letter",
    title: "The right way to write a cover letter — step-by-step guide with template",
    desc: "A strong cover letter sets you apart from other candidates. Learn how to write one in just 5 minutes.",
    date: "May 28, 2025",
  },
];

// ── Testimonials — 2 per screen ───────────────────────────────────────────
const testimonials = [
  { name: "Priya Sharma", role: "Software Engineer, Infosys", avatar: "PS", text: "ResumeKit completely transformed my resume. I used Template 2 and got an interview call within three days. Knowing my data stays local made me feel completely safe.", rating: 5 },
  { name: "Rahul Verma", role: "SSC CGL Qualifier, Delhi", avatar: "RV", text: "I used the Classic template for SSC CGL. It was incredibly clean and professional. The examiner even complimented my resume. Highly recommend!", rating: 5 },
  { name: "Ananya Singh", role: "UX Designer, Razorpay", avatar: "AS", text: "Bold Accent template was perfect for my field. No signup, no data upload — that's what I loved most. Free and premium quality at the same time.", rating: 5 },
  { name: "Karan Mehta", role: "Product Manager, Zomato", avatar: "KM", text: "I also used the Gradient Generator and Code Editor — both tools are very useful. The Cover Letter Builder completed my application package perfectly.", rating: 5 },
  { name: "Deepika Nair", role: "Bank PO, SBI", avatar: "DN", text: "Found this site while preparing for IBPS PO. Built my resume and checked government job vacancies all in one place — incredibly convenient.", rating: 5 },
  { name: "Arjun Patel", role: "Civil Engineer, L&T", avatar: "AP", text: "Created my resume with the Executive template. The output was so polished that the interviewer asked if I had it professionally made. Amazing quality for free!", rating: 5 },
];

function TestimonialCarousel() {
  const [idx, setIdx] = useState(0);
  // Show 2 cards per view
  const perView = 2;
  const total = testimonials.length;
  const maxIdx = total - perView;

  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(maxIdx, i + 1));

  // Auto-advance
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i >= maxIdx ? 0 : i + 1)), 5000);
    return () => clearInterval(t);
  }, [maxIdx]);

  // Offset: each card is 50% of track width + gap compensation
  // With gap: 20px and 2 cards, each card is calc(50% - 10px).
  // translateX step = 50% of the full container = (100/perView)%
  const translatePct = idx * (100 / perView);

  return (
    <div className="rk-tcarousel">
      <div className="rk-tcarousel-track-wrap">
        <div
          className="rk-tcarousel-track"
          style={{ transform: `translateX(-${translatePct}%)` }}
        >
          {testimonials.map((t, i) => (
            <div key={i} className="rk-tcard">
              <div className="rk-tcard-quote"><Icon.QuoteIcon /></div>
              <p className="rk-tcard-text">"{t.text}"</p>
              <div className="rk-tcard-stars">
                {Array(t.rating).fill(0).map((_, s) => <Icon.Star key={s} />)}
              </div>
              <div className="rk-tcard-author">
                <div className="rk-tcard-av">{t.avatar}</div>
                <div>
                  <div className="rk-tcard-name">{t.name}</div>
                  <div className="rk-tcard-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rk-tcarousel-controls">
        <button className="rk-tcar-btn" onClick={prev} disabled={idx === 0}>
          <Icon.ChevLeft />
        </button>
        <div className="rk-tcar-dots">
          {Array(maxIdx + 1).fill(0).map((_, i) => (
            <button
              key={i}
              className={`rk-tdot${i === idx ? " rk-tdot--active" : ""}`}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
        <button className="rk-tcar-btn" onClick={next} disabled={idx >= maxIdx}>
          <Icon.ChevRightNav />
        </button>
      </div>
    </div>
  );
}

// ── Companies ─────────────────────────────────────────────────────────────
const companies = ["Infosys", "TCS", "Wipro", "HDFC Bank", "Zomato", "L&T"];

// ── FAQ ───────────────────────────────────────────────────────────────────
const faqs = [
  { q: "Is ResumeKit completely free?", a: "Yes, ResumeKit is 100% free and always will be. No hidden charges, no premium plans. All 5 templates and all tools are completely free." },
  { q: "Where is my data saved?", a: "Your data is saved only in your browser's localStorage. No server, no database, no account required. Your data stays safe on your device until you choose to clear it." },
  { q: "Do I need to create an account to build a resume?", a: "Absolutely not. No signup, no login, no email verification. Simply choose a template, fill in your details, and download. That's it." },
  { q: "How do I download my resume as a PDF?", a: "Once you complete your resume, click the 'Download PDF' button. The browser print dialog will open — select 'Save as PDF' to save it to your device. No extra software needed." },
  { q: "Can I use more than one template at the same time?", a: "Yes. Each template works independently. You can create separate resumes in multiple templates and all data is stored under different localStorage keys." },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="rk-faq-list">
      {faqs.map((f, i) => (
        <div key={i} className={`rk-faq-item${open === i ? " rk-faq-item--open" : ""}`}>
          <button className="rk-faq-q" onClick={() => setOpen(open === i ? null : i)}>
            <span>{f.q}</span>
            <span className={`rk-faq-icon${open === i ? " rk-faq-icon--open" : ""}`}>
              <Icon.ChevDown />
            </span>
          </button>
          <div className="rk-faq-a-wrap">
            <p className="rk-faq-a">{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Root Component ────────────────────────────────────────────────────────
export default function ResumeList() {
  return (
    <div className="rk-root">

      {/* ── Navbar (unchanged component) ── */}
      <NavBar />

      {/* ── Live Counter Bar ── */}
      <LiveCounter />

      {/* ── HERO ── */}
      <section className="rk-hero">
        <div className="rk-container rk-hero-inner">
          <div className="rk-hero-left">
            <div className="rk-hero-badge">
              <span className="rk-hero-badge-dot" />
              No signup · Always free · 100% local
            </div>
            <h1 className="rk-hero-title">
              Create a resume that<br />
              <span className="rk-hero-hl">opens doors</span>
            </h1>
            <p className="rk-hero-sub">
              Professional templates, instant PDF, free career tools — all without an account.
              Your data never leaves your device.
            </p>

            <div className="rk-local-box">
              <div className="rk-local-box-icon"><Icon.Lock /></div>
              <div>
                <div className="rk-local-box-title">Your data stays on your device</div>
                <div className="rk-local-box-sub">
                  We use localStorage — no server, no account, no privacy concerns.
                  Your data stays with you, always.
                </div>
              </div>
            </div>

            <div className="rk-hero-actions">
              <a href="#templates" className="rk-btn rk-btn--primary rk-btn--lg">
                Choose a Template <Icon.ArrowRight />
              </a>
              <a href="#tools" className="rk-btn rk-btn--outline rk-btn--lg">
                Explore Tools
              </a>
            </div>

            <div className="rk-trust-row">
              {[
                { i: <Icon.Shield />, t: "100% Private" },
                { i: <Icon.Zap />, t: "Ready in 5 min" },
                { i: <Icon.Download />, t: "PDF Download" },
              ].map(({ i, t }) => (
                <div key={t} className="rk-trust-chip">{i}{t}</div>
              ))}
            </div>
          </div>

          <div className="rk-hero-right">
            <HeroSlideshow />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="rk-stats-bar">
        <div className="rk-container rk-stats-inner">
          {[
            { n: "50,000+", l: "Resumes Created" },
            { n: "5", l: "Free Templates" },
            { n: "₹0", l: "Forever Free" },
            { n: "100%", l: "Privacy Guaranteed" },
          ].map(({ n, l }) => (
            <div key={l} className="rk-stat">
              <div className="rk-stat-num">{n}</div>
              <div className="rk-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TEMPLATES ── */}
      <section className="rk-section rk-section--white" id="templates">
        <div className="rk-container">
          <div className="rk-sec-head">
            <div className="rk-eyebrow">Resume Templates</div>
            <h2 className="rk-sec-title">Pick your style, start building</h2>
            <p className="rk-sec-sub">
              Every template is free — always. ATS-friendly and optimized for Indian job markets.
              Your data stays local in localStorage.
            </p>
          </div>
          <div className="rk-tpl-grid">
            {templates.map(t => <TemplateCard key={t.id} tpl={t} />)}
          </div>
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section className="rk-section rk-section--gray" id="tools">
        <div className="rk-container">
          <div className="rk-sec-head">
            <div className="rk-eyebrow">Free Tools</div>
            <h2 className="rk-sec-title">Tools to help you get hired</h2>
            <p className="rk-sec-sub">
              Everything runs in your browser. Nothing uploaded to any server, ever.
            </p>
          </div>
          <div className="rk-tools-grid">
            {tools.map(tool => (
              <Link key={tool.name} href={tool.href} className="rk-tool-card">
                <div className="rk-tool-icon">{tool.icon}</div>
                <div className="rk-tool-name">{tool.name}</div>
                <div className="rk-tool-desc">{tool.desc}</div>
                <div className="rk-tool-link">Open tool <Icon.ArrowRight /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HIRED AT ── */}
      <section className="rk-hired-at">
        <div className="rk-container">
          <div className="rk-hired-label">Our candidates have been hired at</div>
          <div className="rk-hired-logos">
            {companies.map(c => (
              <div key={c} className="rk-hired-logo">{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOVERNMENT JOBS ── */}
      <section className="rk-section rk-section--white" id="jobs">
        <div className="rk-container">
          <div className="rk-sec-head-row">
            <div>
              <div className="rk-eyebrow">Government Jobs</div>
              <h2 className="rk-sec-title">Latest Sarkari Naukri — 2025</h2>
              <p className="rk-sec-sub">Hand-picked, updated regularly. Apply directly on official portals.</p>
            </div>
            <button className="rk-btn rk-btn--outline rk-btn--sm">
              All jobs <Icon.ArrowRight />
            </button>
          </div>
          <div className="rk-jobs-grid">
            {govtJobs.map(j => <JobCard key={j.title} job={j} />)}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS — 2 cards per screen ── */}
      <section className="rk-section rk-section--gray" id="testimonials">
        <div className="rk-container">
          <div className="rk-sec-head">
            <div className="rk-eyebrow">Testimonials</div>
            <h2 className="rk-sec-title">Trusted by thousands of job seekers</h2>
            <p className="rk-sec-sub">
              Real stories from people who built their resumes on ResumeKit and landed their dream jobs.
            </p>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* ── BLOG ── */}
      <section className="rk-section rk-section--white" id="blog">
        <div className="rk-container">
          <div className="rk-sec-head-row">
            <div>
              <div className="rk-eyebrow">Career Blog</div>
              <h2 className="rk-sec-title">Tips, guides &amp; career advice</h2>
            </div>
            <button className="rk-btn rk-btn--outline rk-btn--sm">
              All articles <Icon.ArrowRight />
            </button>
          </div>
          <div className="rk-blog-grid">
            {blogs.map(b => (
              <article key={b.title} className="rk-bc">
                <div className="rk-bc-thumb">
                  <img
                    src={b.img}
                    alt={b.title}
                    className="rk-bc-img"
                    onError={e => {
                      e.target.parentNode.style.background = "var(--rk-gray-100)";
                      e.target.style.display = "none";
                    }}
                  />
                  <span className="rk-bc-cat">{b.cat}</span>
                </div>
                <div className="rk-bc-body">
                  <h3 className="rk-bc-title">{b.title}</h3>
                  <p className="rk-bc-desc">{b.desc}</p>
                </div>
                <div className="rk-bc-foot">
                  <span className="rk-bc-date"><Icon.Calendar /> {b.date}</span>
                  <button className="rk-bc-read">Read more <Icon.ArrowRight /></button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="rk-section rk-section--gray" id="faq">
        <div className="rk-container rk-faq-wrap">
          <div className="rk-faq-left">
            <div className="rk-eyebrow">FAQ</div>
            <h2 className="rk-sec-title">Frequently asked<br />questions</h2>
            <p className="rk-sec-sub">
              Have more questions? Contact us — we are here to help.
            </p>
            <a href="#" className="rk-btn rk-btn--primary rk-btn--sm" style={{ marginTop: 24 }}>
              Contact us <Icon.ArrowRight />
            </a>
          </div>
          <div className="rk-faq-right">
            <FAQ />
          </div>
        </div>
      </section>

      {/* ── CTA — improved ── */}
      <section className="rk-cta" id="cta">
        {/* Decorative grid overlay */}
        <div className="rk-cta-grid-bg" aria-hidden="true" />
        <div className="rk-cta-bg-text" aria-hidden="true">FREE</div>

        <div className="rk-container rk-cta-inner">
          <div className="rk-cta-content">
            {/* Badge */}
            <div className="rk-cta-badge">
              <Icon.Sparkle /> No signup required · Always free
            </div>

            {/* Headline */}
            <h2 className="rk-cta-title">
              Build your resume today.<br />
              It's 100% free.
            </h2>

            {/* Sub-copy */}
            <p className="rk-cta-sub">
              Join 50,000+ job seekers who built professional resumes on ResumeKit.
              No account, no fee, no compromise on quality.
            </p>

            {/* Feature pills */}
            <div className="rk-cta-checks">
              {[
                { label: "Free forever", icon: <Icon.Check /> },
                { label: "Data stays local", icon: <Icon.Lock /> },
                { label: "5 premium templates", icon: <Icon.FileText /> },
                { label: "Instant PDF download", icon: <Icon.Download /> },
              ].map(c => (
                <span key={c.label} className="rk-cta-check-item">
                  {c.icon} {c.label}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="rk-cta-actions">
              <a href="#templates" className="rk-cta-btn-primary">
                Choose a Template <Icon.ArrowRight />
              </a>
              <a href="#tools" className="rk-cta-btn-ghost">
                <Icon.Rocket /> Explore Free Tools
              </a>
            </div>

            {/* Trust strip */}
            <div className="rk-cta-trust">
              {[
                { icon: <Icon.Shield />, label: "No data leaves your device" },
                { icon: <Icon.Lock />, label: "localStorage only" },
                { icon: <Icon.CheckCircle />, label: "ATS-optimized templates" },
              ].map(({ icon, label }) => (
                <span key={label} className="rk-cta-trust-item">
                  {icon} {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER (unchanged structure) ── */}
      <footer className="rk-footer">
        <div className="rk-container rk-footer-inner">
          <div className="rk-footer-brand">
            <div className="rk-logo">
              Resume<span>Kit</span><span className="rk-logo-dot" />
            </div>
            <p className="rk-footer-tag">Built for Indian job seekers. Your data, always yours.</p>
          </div>
          <div className="rk-footer-cols">
            {[
              { title: "Product", links: [["Templates", "#templates"], ["Tools", "#tools"], ["Cover Letter", "/cover-letter"]] },
              { title: "Jobs", links: [["Govt Jobs", "#jobs"], ["State PSC", "#jobs"], ["Defence", "#jobs"]] },
              { title: "Company", links: [["About", "#"], ["Privacy Policy", "#"], ["Contact", "#"]] },
            ].map(col => (
              <div key={col.title} className="rk-footer-col">
                <div className="rk-footer-col-title">{col.title}</div>
                {col.links.map(([label, href]) => (
                  <Link key={label} href={href}>{label}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="rk-footer-bottom">
          <div className="rk-container rk-footer-bottom-inner">
            <span>© 2025 ResumeKit · Your data never leaves your device</span>
            <span>Made with ♥ for India</span>
          </div>
        </div>
      </footer>

    </div>
  );
}