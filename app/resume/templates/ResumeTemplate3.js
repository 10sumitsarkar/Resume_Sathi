import React, { useEffect, useRef, useState } from 'react';
import '../resume-css/resumeTemplate3.css';
import { useSelector } from 'react-redux';
import { usePathname, useSearchParams } from 'next/navigation';

/* ─── Inline SVG Icons ─────────────────────────────────────────────────── */
const IconLocation = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
);
const IconPhone = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"/>
    </svg>
);
const IconEmail = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
        <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
);
const IconGlobe = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14A7.82 7.82 0 014 12c0-.68.09-1.35.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.008 8.008 0 015.07 16zm2.95-8H5.07a8.008 8.008 0 014.33-3.56A15.65 15.65 0 008.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.008 8.008 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.17.65.26 1.32.26 2s-.09 1.35-.26 2h-3.38z"/>
    </svg>
);

/* ─── Social SVG Icons ──────────────────────────────────────────────────── */
const SocialIcons = {
    Facebook: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
        </svg>
    ),
    Twitter: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
        </svg>
    ),
    LinkedIn: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
            <circle cx="4" cy="4" r="2"/>
        </svg>
    ),
    Instagram: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
        </svg>
    ),
    GitHub: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
        </svg>
    ),
    Dribbble: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
        </svg>
    ),
    Behance: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.2.561 1.884 1.477 2.26.584.23 1.354.26 1.968.07l.204-.07c.538-.196.849-.49 1.012-.939H23.726zM15.997 14h4.867c-.063-1.363-.583-2.19-2.22-2.19-1.52 0-2.395.822-2.647 2.19zM7.27 10.887c1.028 0 2.041-.318 2.041-1.487 0-1.168-.953-1.457-1.981-1.457H4v2.944h3.27zM4 13v3.395h3.48c1.196 0 2.18-.437 2.18-1.726 0-1.29-1.066-1.67-2.18-1.67H4zM0 5h8.51c2.02 0 4.514.898 4.514 3.683 0 1.562-.826 2.456-2.02 3.027C12.52 12.213 13.5 13.3 13.5 15.38 13.5 18.49 11.134 19 8.882 19H0V5z"/>
        </svg>
    ),
    YouTube: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
            <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
        </svg>
    ),
    WhatsApp: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.135 1.535 5.874L.057 23.75a.75.75 0 00.917.918l5.97-1.487A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.666-.523-5.184-1.432l-.372-.22-3.84.957.975-3.763-.242-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
    ),
    Other: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
            <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14A7.82 7.82 0 014 12c0-.68.09-1.35.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.008 8.008 0 015.07 16zm2.95-8H5.07a8.008 8.008 0 014.33-3.56A15.65 15.65 0 008.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.008 8.008 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.17.65.26 1.32.26 2s-.09 1.35-.26 2h-3.38z"/>
        </svg>
    ),
};

const getSocialIcon = (name) => {
    const Icon = SocialIcons[name] || SocialIcons.Other;
    return <Icon />;
};

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function ResumeTemplate3({ additionalClass, isStatic = false, resumeId, isForDownload = false }) {

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const activeResumeId = resumeId || id;
    const containerRef = useRef();
    const resumeRef    = useRef();

    const personalInfomation = useSelector(state => state.resume.resumes.find(r => r.id === activeResumeId)?.personal_infomation || {});
    const summary            = useSelector(state => state.resume.resumes.find(r => r.id === activeResumeId)?.summary || {});
    const educations         = useSelector(state => state.resume.resumes.find(r => r.id === activeResumeId)?.educations || []);
    const certificates       = useSelector(state => state.resume.resumes.find(r => r.id === activeResumeId)?.certificates || []);
    const work_experiences   = useSelector(state => state.resume.resumes.find(r => r.id === activeResumeId)?.work_experiences || []);
    const any_internships    = useSelector(state => state.resume.resumes.find(r => r.id === activeResumeId)?.any_internships || []);
    const social_medias      = useSelector(state => state.resume.resumes.find(r => r.id === activeResumeId)?.social_medias || []);
    const languages          = useSelector(state => state.resume.resumes.find(r => r.id === activeResumeId)?.languages || []);
    const skills             = useSelector(state => state.resume.resumes.find(r => r.id === activeResumeId)?.skills || []);
    const hobbies            = useSelector(state => state.resume.resumes.find(r => r.id === activeResumeId)?.hobbies || []);

    const previewResumeSize = useSelector(state => state.resume.preview_resume_size);
    const [scale, setScale]               = useState(1);
    const [scaledHeight, setScaledHeight] = useState(0);
    const [currentLoc, setCurrentLoc]     = useState('preview');
    const pathname = usePathname();

    useEffect(() => {
        if (pathname) setCurrentLoc(pathname.split('/')[2]);
    }, [pathname]);

    const showStaticData = isStatic || currentLoc === 'select-theme';

    const levelMap = { Beginner: 16, Intermediate: 33, Proficient: 50, Advanced: 66, Expert: 83, Master: 100 };

    useEffect(() => {
        const container = containerRef.current;
        const resume    = resumeRef.current;
        if (!container || !resume) return;

        const update = () => {
            const newScale = container.offsetWidth / 800;
            setScale(newScale);
            setScaledHeight(resume.offsetHeight * newScale);
        };

        update();
        const ro = new ResizeObserver(update);
        ro.observe(resume);
        window.addEventListener('resize', update);
        return () => { ro.disconnect(); window.removeEventListener('resize', update); };
    }, [String(additionalClass), Number(previewResumeSize)]);

    /* ─── Shared sub-components ─── */
    const Header = ({ name, jobTitle, address, city, state, phone, email, website, photo, isStatic: s }) => (
        <div className="rt3_header">
            {photo && (
                <div className="rt3_header_photo">
                    <img loading="lazy" className="resume-photo"
                         src={photo}
                         alt="profile" />
                </div>
            )}
            <div className="rt3_header_info">
                <p className="rt3_name resume-name">{name}</p>
                {jobTitle && <p className="rt3_jobtitle resume-job-title">{jobTitle}</p>}
                <ul className="rt3_contact_list">
                    {(address || city || state) && (
                        <li>
                            <span className="rt3_icon"><IconLocation /></span>
                            <span className="resume-address">{[address, city, state].filter(Boolean).join(', ')}</span>
                        </li>
                    )}
                    {phone && (
                        <li>
                            <span className="rt3_icon"><IconPhone /></span>
                            <span className="resume-phone">{[(phone?.startsWith('+') ? '' : (phone && countryCode ? countryCode : '')), phone].filter(Boolean).join(' ')}</span>
                        </li>
                    )}
                    {email && (
                        <li>
                            <span className="rt3_icon"><IconEmail /></span>
                            <span className="resume-email">{email}</span>
                        </li>
                    )}
                    {website && (
                        <li>
                            <span className="rt3_icon"><IconGlobe /></span>
                            <span className="resume-website">{website}</span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );

    /* ─── Entry: title wraps in its own min-width:0 column so long job
       titles / degree names / certificate names never collide with the
       date, which renders as a fixed, non-shrinking pill on the right.
       Company/institute/issuer live on their own italic sub-line
       instead of being appended to the title — that concatenation was
       what caused the overlap/merge in the previous version. ─── */
    const Entry = ({ title, dateLine, subLine, description, isLast }) => (
        <div className="rt3_entry">
            <div className="rt3_entry_rail">
                <span className="rt3_entry_dot" />
                {!isLast && <span className="rt3_entry_line" />}
            </div>
            <div className="rt3_entry_content">
                <div className="rt3_entry_head">
                    <div className="rt3_entry_title_col">
                        <p className="rt3_entry_title">{title}</p>
                    </div>
                    {dateLine && <span className="rt3_entry_date">{dateLine}</span>}
                </div>
                {subLine && <p className="rt3_entry_sub">{subLine}</p>}
                {description && <p className="rt3_entry_desc">{description}</p>}
            </div>
        </div>
    );

        return (
           <div ref={containerRef} className="resume-preview-div" data-selected-resume="ResumeTemplate3"
               style={{ height: `${scaledHeight}px` }}>
              <div ref={resumeRef} id={isForDownload ? 'resume-download-area' : undefined} className="position-absolute top-0 start-0"
                  style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: '800px' }}>

                {/* ═══════ STATIC ═══════ */}
                {showStaticData ? (
                    <div className={`resume ResumeTemplate3 ${additionalClass}`}>
                        <Header
                            name="Your Name" jobTitle="Job Title"
                            address="Address Line" city="City" state="State"
                            phone="+91-1234567890" email="resume@example.com"
                            website="www.example.com" isStatic
                        />

                        <div className="rt3_body">
                            <div className="rt3_sidebar">
                                <div className="rt3_block">
                                    <h3 className="rt3_block_title">Skills</h3>
                                    <ul className="rt3_skill_list">
                                        {[['Photoshop', 90], ['Figma', 75], ['React', 60]].map(([n, w]) => (
                                            <li key={n}>
                                                <p>{n}</p>
                                                <div className="rt3_bar"><span style={{ width: `${w}%` }} /></div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rt3_block">
                                    <h3 className="rt3_block_title">Languages</h3>
                                    <ul className="rt3_plain_list">
                                        <li>English — Native</li>
                                        <li>Spanish — Fluent</li>
                                    </ul>
                                </div>

                                <div className="rt3_block">
                                    <h3 className="rt3_block_title">Social</h3>
                                    <ul className="rt3_social_list">
                                        {[['Twitter','twitter.com'],['LinkedIn','linkedin.com'],['Instagram','instagram.com'],['Behance','behance.net']].map(([name, url]) => (
                                            <li key={name}>
                                                <span className="rt3_social_icon">{getSocialIcon(name)}</span>
                                                <span>{url}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rt3_block">
                                    <h3 className="rt3_block_title">Hobbies</h3>
                                    <ul className="rt3_plain_list">
                                        <li>Sketching</li>
                                        <li>Photography</li>
                                        <li>Travelling</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="rt3_main">
                                <div className="rt3_block">
                                    <h3 className="rt3_block_title">Profile</h3>
                                    <p className="rt3_body_text resume-about-me">
                                        Creative and detail-oriented UI/UX Designer with over 6 years of experience crafting
                                        user-friendly digital experiences. Passionate about solving design problems through empathy
                                        and innovative solutions.
                                    </p>
                                </div>

                                <div className="rt3_block">
                                    <h3 className="rt3_block_title">Work Experience</h3>
                                    <Entry
                                        title="Senior UI/UX Designer"
                                        subLine="Pixel Labs — Remote"
                                        dateLine="2019 – Present"
                                        description="Led a team of designers for a fintech product, improving user retention by 30%."
                                    />
                                    <Entry
                                        title="UX Designer"
                                        subLine="CreativeSoft — Austin, TX"
                                        dateLine="2016 – 2019"
                                        description="Designed mobile apps and web dashboards for health and e-commerce clients."
                                        isLast
                                    />
                                </div>

                                <div className="rt3_block">
                                    <h3 className="rt3_block_title">Education</h3>
                                    <Entry
                                        title="B.A. in Graphic Design"
                                        subLine="University of Texas, Austin"
                                        dateLine="2012 – 2016"
                                    />
                                    <Entry
                                        title="Certified UX Specialist"
                                        subLine="Nielsen Norman Group"
                                        dateLine="2018"
                                        isLast
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                ) : (
                /* ═══════ DYNAMIC ═══════ */
                    <div className={`resume ResumeTemplate3 ${additionalClass}`}>
                        <Header
                            name={`${personalInfomation?.firstName || ''} ${personalInfomation?.lastName || ''}`.trim()}
                            jobTitle={personalInfomation?.experience}
                            address={personalInfomation?.address}
                            city={personalInfomation?.city}
                            state={personalInfomation?.state}
                            phone={[(personalInfomation?.country_code || ''), personalInfomation?.phone].filter(Boolean).join(' ')}
                            email={personalInfomation?.email}
                            website={personalInfomation?.website}
                            photo={personalInfomation?.photo}
                        />

                        <div className="rt3_body">
                            {/* SIDEBAR */}
                            <div className="rt3_sidebar">
                                {skills?.length > 0 && (
                                    <div className="rt3_block">
                                        <h3 className="rt3_block_title">Skills</h3>
                                        <ul className="rt3_skill_list">
                                            {skills.map((skill, i) => (
                                                <li key={i}>
                                                    <p>{skill.skill_name} <span className='skill-proficiency'>{skill.proficiency_level}</span></p>
                                                    <div className="rt3_bar">
                                                        <span style={{ width: `${levelMap[skill.proficiency_level] || 70}%` }} />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {languages?.length > 0 && (
                                    <div className="rt3_block">
                                        <h3 className="rt3_block_title">Languages</h3>
                                        <ul className="rt3_plain_list">
                                            {languages.map((lang, i) => (
                                                <li key={i}>{lang.language} — {lang.proficiency_level}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {social_medias?.length > 0 && (
                                    <div className="rt3_block">
                                        <h3 className="rt3_block_title">Social</h3>
                                        <ul className="rt3_social_list">
                                            {social_medias.map((social, i) => {
                                                const url = social.social_url?.startsWith('http')
                                                    ? social.social_url
                                                    : `https://${social.social_url}`;
                                                return (
                                                    <li key={i}>
                                                        <span className="rt3_social_icon">{getSocialIcon(social.social_name)}</span>
                                                        <a href={url} target="_blank" rel="noopener noreferrer">{social.social_name}</a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}

                                {hobbies?.length > 0 && (
                                    <div className="rt3_block">
                                        <h3 className="rt3_block_title">Hobbies</h3>
                                        <ul className="rt3_plain_list">
                                            {hobbies.map((h, i) => <li key={i}>{h.hobbies}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* MAIN */}
                            <div className="rt3_main">
                                {summary?.summary && (
                                    <div className="rt3_block">
                                        <h3 className="rt3_block_title">Profile</h3>
                                        <p className="rt3_body_text resume-about-me">{summary.summary}</p>
                                    </div>
                                )}

                                {work_experiences?.length > 0 && (
                                    <div className="rt3_block">
                                        <h3 className="rt3_block_title">Work Experience</h3>
                                        {work_experiences.map((work, i) => (
                                            <Entry
                                                key={i}
                                                title={work.job_title}
                                                subLine={[work.company_name, work.location, work.employment_type].filter(Boolean).join(' — ')}
                                                dateLine={`${work.start_month || ''} ${work.start_year || ''} – ${
                                                    (!work.end_month || !work.end_year) ? 'Present' : `${work.end_month} ${work.end_year}`
                                                }`}
                                                description={work.description}
                                                isLast={i === work_experiences.length - 1}
                                            />
                                        ))}
                                    </div>
                                )}

                                {any_internships?.length > 0 && (
                                    <div className="rt3_block">
                                        <h3 className="rt3_block_title">Internships</h3>
                                        {any_internships.map((intern, i) => (
                                            <Entry
                                                key={i}
                                                title={intern.job_title}
                                                subLine={[intern.company_name, intern.location, intern.employment_type].filter(Boolean).join(' — ')}
                                                dateLine={`${intern.start_month || ''} ${intern.start_year || ''} – ${
                                                    (!intern.end_month || !intern.end_year) ? 'Present' : `${intern.end_month} ${intern.end_year}`
                                                }`}
                                                isLast={i === any_internships.length - 1}
                                            />
                                        ))}
                                    </div>
                                )}

                                {educations?.length > 0 && (
                                    <div className="rt3_block">
                                        <h3 className="rt3_block_title">Education</h3>
                                        {educations.map((edu, i) => (
                                            <Entry
                                                key={i}
                                                title={`${edu.degree} in ${edu.field_study}`}
                                                subLine={[edu.institute_name, edu.location].filter(Boolean).join(', ')}
                                                dateLine={(!edu.date || !edu.year) ? 'Still Studying' : `${edu.date} ${edu.year}`}
                                                isLast={i === educations.length - 1}
                                            />
                                        ))}
                                    </div>
                                )}

                                {certificates?.length > 0 && (
                                    <div className="rt3_block">
                                        <h3 className="rt3_block_title">Certifications</h3>
                                        {certificates.map((cert, i) => (
                                            <Entry
                                                key={i}
                                                title={cert.certificate_name}
                                                subLine={cert.issuing_organization}
                                                dateLine={cert.issue_date}
                                                description={cert.description}
                                                isLast={i === certificates.length - 1}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

ResumeTemplate3.layoutStyle = 'two-column';