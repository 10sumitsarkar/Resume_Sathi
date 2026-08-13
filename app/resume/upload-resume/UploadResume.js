'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth/mammoth.browser';
import { setResumes } from '../reducer/resume-reducer';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

const sectionHeadings = [
  'summary', 'professional summary', 'objective', 'career objective', 'profile',
  'education', 'experience', 'work experience', 'employment', 'skills',
  'technical skills', 'certifications', 'certificates', 'languages', 'projects',
  'internship', 'hobbies'
];

const splitLines = (text) => text
  .replace(/\r/g, '\n')
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

const cleanText = (text) => text.replace(/\s+/g, ' ').trim();

const normalizeHeading = (line) => line
  .toLowerCase()
  .replace(/[:\-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const headingMatch = (line, names = sectionHeadings) => {
  const normalized = normalizeHeading(line);
  return names.find((name) => normalized === name || normalized.startsWith(`${name} `));
};

const isSectionHeading = (line) => Boolean(headingMatch(line));

const getSection = (lines, names) => {
  const start = lines.findIndex((line) => headingMatch(line, names));
  if (start === -1) return '';
  const matchedHeading = headingMatch(lines[start], names);
  const sameLineContent = cleanText(lines[start].slice(matchedHeading.length).replace(/^[:\-\s]+/, ''));
  const end = lines.findIndex((line, index) =>
    index > start && isSectionHeading(line)
  );
  return [sameLineContent, ...lines.slice(start + 1, end === -1 ? lines.length : end)]
    .filter(Boolean)
    .join('\n');
};

const splitList = (value) => value
  .split(/\n|,|;|•|·|\|/g)
  .map((item) => cleanText(item.replace(/^[-*]+/, '')))
  .filter((item) => item.length > 1);

const extractMonthYear = (value) => {
  const month = value.match(/jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?/i)?.[0];
  const year = value.match(/\b(19|20)\d{2}\b/)?.[0];
  const monthMap = {
    jan: 'January', january: 'January', feb: 'February', february: 'February',
    mar: 'March', march: 'March', apr: 'April', april: 'April', may: 'May',
    jun: 'June', june: 'June', jul: 'July', july: 'July', aug: 'August',
    august: 'August', sep: 'September', september: 'September', oct: 'October',
    october: 'October', nov: 'November', november: 'November', dec: 'December',
    december: 'December',
  };
  return {
    month: month ? monthMap[month.toLowerCase()] : '',
    year: year || '',
  };
};

const safeSplitList = (value) => value
  .split(/\n|,|;|\u2022|\u00b7|\|/g)
  .map((item) => cleanText(item.replace(/^[-*]+/, '')))
  .filter((item) => item.length > 1);

const buildImportedResume = (id, text) => {
  const lines = splitLines(text);
  const firstEmail = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';
  const firstPhone = text.match(/(?:\+?\d[\s-]?){10,14}/)?.[0]?.replace(/[^\d+]/g, '') || '';
  const nameLine = lines.find((line) =>
    !line.includes('@') &&
    !/\d{5,}/.test(line) &&
    !isSectionHeading(line) &&
    !/address|location|city|phone|mobile|email/i.test(line) &&
    line.split(/\s+/).length <= 4
  ) || '';
  const [firstName = '', ...lastNameParts] = nameLine.split(/\s+/);
  const summaryText = getSection(lines, ['summary', 'professional summary', 'objective', 'career objective', 'profile']);
  const educationText = getSection(lines, ['education']);
  const skillsText = getSection(lines, ['skills', 'technical skills']);
  const experienceText = getSection(lines, ['experience', 'work experience', 'employment']);
  const certificateText = getSection(lines, ['certifications', 'certificates']);
  const languageText = getSection(lines, ['languages']);
  const firstSectionIndex = lines.findIndex((line) => isSectionHeading(line));
  const contactLines = lines.slice(0, firstSectionIndex === -1 ? 12 : firstSectionIndex);
  const locationLine = contactLines.find((line) =>
    line.length <= 90 &&
    !line.includes('@') &&
    !/https?:\/\/|www\./i.test(line) &&
    !/(?:\+?\d[\s-]?){10,14}/.test(line) &&
    (
      /address|location|city/i.test(line) ||
      /,\s*[A-Za-z ]{2,}(?:\s+\d{4,6})?$/.test(line) ||
      /\b\d{6}\b/.test(line)
    )
  ) || '';
  const cleanedLocation = locationLine
    .replace(/address|location|city/ig, '')
    .replace(/[:]/g, '')
    .trim();
  const [city = '', state = ''] = cleanedLocation
    .split(',')
    .map((item) => item.trim());

  const skills = safeSplitList(skillsText).slice(0, 12).map((skill, index) => ({
    skill_id: `skill_${id}_${index}`,
    skill_name: skill,
    proficiency_level: 'Intermediate',
  }));

  const languages = safeSplitList(languageText).slice(0, 6).map((language, index) => ({
    language_id: `language_${id}_${index}`,
    language,
    proficiency_level: 'Intermediate',
  }));

  const educationLines = splitLines(educationText);
  const educationDate = extractMonthYear(educationText);
  const educations = educationLines.length ? [{
    edu_id: `edu_${id}_0`,
    degree: educationLines.find((line) => /bachelor|master|diploma|degree|b\.|m\./i.test(line)) || educationLines[0] || '',
    field_study: educationLines.find((line) => /science|commerce|arts|engineering|computer|business/i.test(line)) || '',
    institute_name: educationLines.find((line) => /university|college|institute|school/i.test(line)) || educationLines[1] || '',
    location: educationLines.find((line) => /,/.test(line)) || '',
    date: educationDate.month,
    year: educationDate.year,
  }] : [];

  const experienceLines = splitLines(experienceText);
  const experienceDate = extractMonthYear(experienceText);
  const workExperiences = experienceLines.length ? [{
    workEperience_id: `workEperience_${id}_0`,
    job_title: experienceLines.find((line) => /engineer|developer|manager|designer|analyst|executive|intern/i.test(line)) || experienceLines[0] || '',
    company_name: experienceLines.find((line) => /pvt|ltd|inc|llc|company|technologies|solutions/i.test(line)) || experienceLines[1] || '',
    employee_type: 'Full-time',
    location: experienceLines.find((line) => /,/.test(line)) || '',
    start_month: experienceDate.month,
    start_year: experienceDate.year,
    end_month: '',
    end_year: '',
    description: experienceLines.slice(2, 6).join('\n'),
  }] : [];

  const certificates = safeSplitList(certificateText).slice(0, 5).map((certificate, index) => ({
    certificate_id: `certificate_${id}_${index}`,
    certificate_name: certificate,
    issuing_organization: '',
    issue_date: '',
    description: '',
  }));

  return {
    id,
    configuration: {
      font_style: 'poppins',
      layout_style: 'Two Column',
      color_palette: 'color-2',
      selected_theme: 'ResumeTemplate1',
    },
    personal_infomation: {
      firstName,
      lastName: lastNameParts.join(' '),
      email: firstEmail,
      phone: firstPhone.slice(-10),
      city,
      state,
      website: text.match(/https?:\/\/[^\s]+|www\.[^\s]+/i)?.[0] || '',
      experience: workExperiences.length ? 'Experienced' : 'Fresher',
    },
    summary: { summary: cleanText(summaryText).slice(0, 1000) },
    educations,
    certificates,
    skills,
    work_experiences: workExperiences,
    social_medias: [],
    any_internships: [],
    languages,
    hobbies: [],
    skipped_steps: {},
    resume_name: nameLine ? `${nameLine} Resume` : 'Imported Resume',
    is_submitted: false,
    updated_at: Number(id),
  };
};

const extractTextFromFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();

  if (file.type === 'application/pdf') {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) => {
      const page = await pdf.getPage(index + 1);
      const content = await page.getTextContent();
      return content.items.map((item) => item.str).join('\n');
    }));
    return pages.join('\n');
  }

  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  return await file.text();
};

export default function UploadResume() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const resumes = useSelector((state) => state.resume.resumes);
  const MAX_FILE_SIZE_MB = 5;

  const isValidFileType = (file) => [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ].includes(file.type);

  const isValidFileSize = (file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;

  const selectFile = (file) => {
    if (!file) return;
    if (!isValidFileType(file)) {
      alert('Invalid file type. Please upload a PDF, DOC, or DOCX file.');
      return;
    }
    if (!isValidFileSize(file)) {
      alert(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }
    setSelectedFile(file);
  };

  const handleFileChange = (e) => selectFile(e.target.files[0]);
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = () => setDragActive(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type !== '') selectFile(file);
    else alert('Folders are not allowed. Please upload a valid resume file (PDF, DOC, DOCX).');
  };

  const handleImportResume = async () => {
    if (!selectedFile) {
      alert('Please upload a resume first.');
      return;
    }

    try {
      setLoading(true);
      const text = await extractTextFromFile(selectedFile);
      if (!text.trim()) {
        alert('Could not read text from this file. Please try another resume.');
        return;
      }

      const id = `${Date.now()}`;
      const importedResume = buildImportedResume(id, text);
      dispatch(setResumes([...resumes, importedResume]));
      router.push(`/resume/personal-info/?id=${id}`);
    } catch (error) {
      alert('Could not extract this resume. Please try a DOCX or text-based PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className='upload-resume-section py-custom'>
        <div className="container-fluid custom-container">
          <div className="row">
            <div className="col-lg-6 mt-4 mt-md-5 mt-lg-0">
              <h1 className='heading fs-mob-24'>Upload Your Resume</h1>
              <p className='sub-heading fs-mob-18'>Quickly extract your details from your existing resume file</p>
              <ul className='features-list'>
                <li className='fs-mob-18'><span>Supported file formats:</span> PDF, DOC, DOCX</li>
                <li className='fs-mob-18'><span>Maximum file size:</span> 5 MB</li>
                <li className='sub-details fs-mob-18'><span>We'll automatically extract your:</span>
                  <p className='fs-mob-16'><img src="/front-assets/images/icons/list-user.svg" alt="User" />Personal Information <span>(Name, Email, Phone, Location)</span></p>
                  <p className='fs-mob-16'><img src="/front-assets/images/icons/list-experience.svg" alt="Experience" />Work Experience <span>(Job Title, Company, Dates)</span></p>
                  <p className='fs-mob-16'><img src="/front-assets/images/icons/list-education.svg" alt="Education" />Education Details <span>(Degree, College, Year)</span></p>
                  <p className='fs-mob-16'><img src="/front-assets/images/icons/list-skill.svg" alt="Skill" />Skills & Certifications</p>
                </li>
              </ul>
            </div>
            <div className="col-lg-6 order-first order-lg-last">
              <div
                className={`upload-resume-div ${dragActive ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <>
                    <img src="/front-assets/images/icons/file.svg" alt="File" />
                    <p className='file-selected'>
                      <img src="/front-assets/images/icons/checkmark.svg" alt="Checkmark" /> {selectedFile.name}
                    </p>
                  </>
                ) : (
                  <>
                    <img src="/front-assets/images/icons/upload.svg" alt="Upload" />
                    <p className='para1 fs-mob-20'>Drag and drop a file here</p>
                  </>
                )}
                <input
                  type="file"
                  id="uploadResume"
                  accept=".pdf, .doc, .docx"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                {selectedFile ? (
                  <label htmlFor="uploadResume" className='change-button fs-mob-16'>Change</label>
                ) : (
                  <>
                    <label htmlFor="uploadResume" className='fs-mob-16'>Upload Resume</label>
                    <p className='para2'>Files we can read: DOC, DOCX, PDF</p>
                  </>
                )}
              </div>
              <button type="button" className='next-button d-none d-md-flex' onClick={handleImportResume} disabled={loading}>
                {loading ? 'Extracting...' : 'Next'}
              </button>
            </div>
          </div>
          <div className='dont-have-resume'>
            <p>Don&apos;t have a resume?</p>
            <Link prefetch={false} href='/resume/resume-type/'> Create one from scratch
              <img src="/front-assets/images/icons/create-arrow.svg" width={16} height={18} alt="Arrow" />
            </Link>
          </div>
        </div>
        <div className='mob-footer d-md-none'>
          <button type="button" className='mob-next-button' onClick={handleImportResume} disabled={loading}>
            {loading ? 'Extracting...' : 'Next'}
          </button>
          <div className='mob-dont-have-resume'>
            <p>Don&apos;t have a resume?</p>
            <Link prefetch={false} href='/resume/resume-type/'> Create one from scratch
              <img src="/front-assets/images/icons/create-arrow.svg" width={12} height={14} alt="Arrow" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
