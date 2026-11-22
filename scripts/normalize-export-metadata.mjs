import fs from "node:fs";
import path from "node:path";

const outputDirectory = path.resolve(process.cwd(), "out");
const brandSuffix = " | ResumeSathi";

const titleOverrides = {
  "/authors/": "ResumeSathi Authors: Career & Exam Guides",
  "/authors/nitu-dey/": "Nitu Dey: Resume & Career Articles",
  "/authors/sumit-sarkar/": "Sumit Sarkar: Resume & Career Articles",
  "/bio-data/": "Free Bio-Data Maker: Printable Bio-Data",
  "/blog/ats-friendly-resume-indian-freshers/": "ATS-Friendly Resume for Indian Freshers",
  "/blog/best-resume-for-different-jobs/": "Best Resume Formats for Different Jobs",
  "/blog/career-advice-nobody-tells-you/": "Career Advice Nobody Tells You",
  "/blog/career-objective-for-resume-examples/": "Career Objective for Resume: 30 Examples",
  "/blog/category/resume-tips/": "Resume Tips & Templates for Job Seekers",
  "/blog/category/web-articles/": "Career Advice: Job Search & Workplace Tips",
  "/blog/page/2/": "Career Blog: Resume Tips & Advice, Page 2",
  "/blog/page/3/": "Career Blog: Resume Tips & Advice, Page 3",
  "/blog/how-to-handle-a-difficult-boss/": "How to Handle a Difficult Boss at Work",
  "/blog/how-to-answer-tell-me-about-yourself/": "How to Answer: Tell Me About Yourself",
  "/blog/how-to-create-a-resume-for-free/": "How to Create a Resume for Free Online",
  "/blog/how-to-explain-employment-gap-in-interview/": "Explain an Employment Gap in an Interview",
  "/blog/how-to-identify-fake-job-offers-and-recruitment-scams/": "Spot Fake Job Offers and Recruitment Scams",
  "/blog/how-to-negotiate-salary-job-offer/": "Salary Negotiation: How to Ask for More",
  "/blog/how-to-resign-from-a-job-properly/": "How to Resign From a Job: Steps and Letter",
  "/blog/how-to-start-wbpsc-preparation-from-zero/": "How to Start WBPSC Preparation from Zero",
  "/blog/indian-cv-to-us-resume/": "Indian CV to US Resume: What to Remove",
  "/blog/laid-off-bioware-game-studio-resume-portfolio-guide/": "BioWare Layoff: Resume & Portfolio Guide",
  "/blog/resume-rewrite-real-example-before-after/": "Resume Rewrite: Before and After Examples",
  "/blog/resume-vs-cv-vs-biodata/": "Resume vs CV vs Biodata: Key Differences",
  "/blog/resume-vs-linkedin-profile-recruiters-guide/": "Resume vs LinkedIn: What Recruiters See",
  "/blog/rrb-ntpc-undergraduate-vs-graduate/": "RRB NTPC Undergraduate vs Graduate",
  "/blog/simple-resume-layout-types-guide/": "Simple Resume Layout Types: Which One Fits",
  "/blog/skills-vs-degree-what-matters-more/": "Skills vs Degree: What Matters More",
  "/blog/timeline-resume-template-guide/": "Timeline Resume Template: Is It Right for You",
  "/blog/upsc-vs-ssc-vs-state-psc/": "UPSC vs SSC vs State PSC: Jobs and Salary",
  "/blog/web-development-career-tips-ai-era/": "Web Development Career Tips in the AI Era",
  "/blog/what-to-check-before-accepting-job-offer/": "What to Check Before Accepting a Job Offer",
  "/blog/why-not-put-photo-on-resume/": "Why You Should Never Put a Resume Photo",
  "/contact/": "Contact ResumeSathi: Support & Feedback",
  "/disclaimer/": "ResumeSathi Disclaimer: Tools and Site Use",
  "/editorial-policy/": "Editorial Policy: Sources & Corrections",
  "/exam-guides/": "Exam Guides: Syllabus, Eligibility & Updates",
  "/exam-guides/rrb-ntpc-12th-level-exam-syllabus-pattern-eligibility-salary/": "RRB NTPC 12th Level: Syllabus & Eligibility",
  "/exam-guides/upsssc-combined-lower-subordinate-services-102-level-eligibility-exam-pattern-syllabus-salary-and-free-pdf/": "UPSSSC 10+2 Guide: Eligibility & Syllabus",
  "/exam-guides/wbpsc-clerkship-syllabus-exam-pattern-eligibility-salary/": "WBPSC Clerkship Guide: Syllabus & Eligibility",
  "/resume/": "Free Resume Builder: Create an ATS-Ready CV",
  "/templates/": "Free Resume Templates by Career Role",
  "/templates/accounting-resume-template/": "Accounting Resume Template & Skills",
  "/templates/fresh-graduate-resume-template/": "Fresh Graduate Resume Template: First Job",
  "/templates/hr-coordinator-resume-template/": "HR Coordinator Resume Template: Hiring Skills",
  "/templates/operations-executive-resume-template/": "Operations Executive Resume Template Guide",
  "/templates/project-coordinator-resume-template/": "Project Coordinator Resume Template Guide",
  "/templates/sales-resume-template/": "Sales Resume Template: Roles & Skills",
  "/templates/software-developer-resume-template/": "Software Developer Resume Template Guide",
  "/templates/teacher-resume-template/": "Teacher Resume Template: Skills & Experience",
  "/templates/ui-designer-resume-template/": "UI Designer Resume Template & Portfolio",
  "/terms-and-conditions/": "Terms & Conditions for ResumeSathi Users",
  "/tools/age-calculator/": "Online Age Calculator: Calculate Your Age",
  "/tools/ats-checker/": "ATS Resume Checker: Analyze Keywords & Format",
  "/tools/background-remover/": "Background Remover: Make PNG Transparent",
  "/tools/css-animations/": "CSS Animation Generator: Build Web Effects",
  "/tools/docx-to-pdf/": "DOCX to PDF Converter: Convert Word Files",
  "/tools/gradient-generator/": "CSS Gradient Generator: Create Backgrounds",
  "/tools/id-card-maker/": "ID Card Maker: Create Editable Card Designs",
  "/tools/image-to-pdf/": "Image to PDF Converter: Convert JPG & PNG",
  "/tools/merge-pdf/": "Merge PDF Online Free: Combine PDF Files",
  "/tools/pdf-compressor/": "Compress PDF Online: Reduce File Size",
  "/tools/pdf-remove/": "Remove PDF Pages Online: Delete Pages",
  "/tools/signature-cropper/": "Signature Cropper: Resize and Fit Images",
  "/tools/split-pdf/": "Split PDF Online: Extract Selected Pages",
  "/tools/typing/": "Free Typing Practice: Speed & Accuracy",
  "/tools/typing/practice/": "Free Typing Test & Practice Modes",
};

const descriptionOverrides = {
  "/authors/":
    "Meet the people behind ResumeSathi career articles and exam guides. Explore each author's profile, topics, and published work to find practical guidance for your next step.",
  "/authors/nitu-dey/":
    "Read Nitu Dey's ResumeSathi articles on resumes, interview preparation, and career guidance. Explore her profile, topics, and published work for practical advice.",
  "/authors/sumit-sarkar/":
    "Read Sumit Sarkar's ResumeSathi articles and guides. Explore his profile, writing topics, and published work for practical career and exam preparation guidance.",
  "/bio-data/":
    "Create a printable bio-data profile with personal details, education, qualifications, and work history. Choose a format and prepare your document for sharing.",
  "/blog/category/web-articles/":
    "Browse career advice on job searches, workplace decisions, interview preparation, and professional growth. Choose an article to plan your next career step.",
  "/blog/":
    "Browse practical articles on resumes, interviews, career growth, and job searches. Use focused tips to prepare applications and make informed career decisions.",
  "/blog/page/2/":
    "Browse page 2 of ResumeSathi career articles for practical resume tips, job-search guidance, and interview advice. Choose a topic to plan your next step.",
  "/blog/page/3/":
    "Browse page 3 of ResumeSathi career articles for practical resume tips, job-search guidance, and interview advice. Choose a topic to plan your next step.",
  "/disclaimer/":
    "Review the ResumeSathi disclaimer for limits on our resume builder, ATS checker, career information, advertising, and third-party links before using our tools.",
  "/editorial-policy/":
    "Learn how ResumeSathi researches, reviews, updates, and corrects career articles and exam guides. See our sourcing standards and contact us with corrections.",
  "/exam-guides/":
    "Explore exam guides covering syllabus, eligibility, important dates, admit cards, answer keys, and results. Check official notifications before planning your preparation.",
  "/templates/":
    "Choose an ATS-friendly resume template for freshers, developers, teachers, sales, HR, and accounting roles. Preview each layout, then build your resume with ResumeSathi.",
  "/templates/accounting-resume-template/":
    "Review this accounting resume template for billing, ledger entries, reconciliation, Tally, Excel, and finance support. Explore the layout and start a role-focused resume.",
  "/templates/fresh-graduate-resume-template/":
    "Review this fresh graduate resume template for education, internships, college projects, and entry-level skills. Explore the layout and prepare a focused first-job resume.",
  "/templates/hr-coordinator-resume-template/":
    "Review this HR coordinator resume template for hiring support, onboarding, employee records, HRMS, and daily administration. Explore the layout and start your resume.",
  "/templates/operations-executive-resume-template/":
    "Review this operations executive resume template for daily work, reporting, vendor follow-ups, and team coordination. Explore the layout and prepare your resume.",
  "/templates/project-coordinator-resume-template/":
    "Review this project coordinator resume template for planning, status calls, reports, delivery tracking, and team updates. Explore the layout and build your resume.",
  "/templates/sales-resume-template/":
    "Review this sales resume template for business development, client calls, lead follow-up, CRM work, and target-based roles. Explore the layout and prepare your resume.",
  "/templates/teacher-resume-template/":
    "Review this teacher resume template for classroom experience, lesson planning, student support, education, and certificates. Explore the layout and prepare your resume.",
  "/templates/ui-designer-resume-template/":
    "Review this UI designer resume template for portfolio links, design tools, wireframes, user flows, and project work. Explore the layout and prepare your resume.",
  "/tools/age-calculator/":
    "Calculate your exact age in years, months, and days from your date of birth. Enter the dates in the online age calculator and check the result instantly.",
  "/tools/ats-checker/":
    "Check your resume's ATS readability, keyword match, and formatting. Upload a resume and review practical suggestions before tailoring it to a job.",
  "/tools/background-remover/":
    "Remove a plain image background in your browser and download a transparent PNG. Upload an image, review the cutout, and save it for your next design.",
  "/tools/docx-to-pdf/":
    "Convert a Word DOCX document to PDF in your browser. Select a file, process it online, and download a PDF that is ready to share or print.",
  "/tools/id-card-maker/":
    "Create school, employee, visitor, event, or volunteer ID cards with editable front and back templates. Customize designs in your browser and download print-ready images.",
  "/tools/image-to-pdf/":
    "Convert JPG and PNG images into a PDF in your browser. Add images, arrange their order, and download the finished document without uploading your files.",
  "/tools/merge-pdf/":
    "Combine multiple PDF files into one document online. Select and arrange your files, merge them in your browser, then download the combined PDF.",
  "/tools/pdf-compressor/":
    "Reduce PDF file size online while adjusting compression options. Choose a file, review available settings, and download the compressed document.",
  "/tools/pdf-remove/":
    "Delete selected pages from a PDF in your browser. Choose the pages to remove, save the updated document, and download the resulting file.",
  "/tools/signature-cropper/":
    "Crop a signature image to a custom width and height in your browser. Upload the image, adjust the crop, and download the result for forms and documents.",
  "/tools/split-pdf/":
    "Split a PDF online by selecting the pages you need. Extract chosen pages into separate files, then download the results from your browser.",
};

function listHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(entryPath);
    return entry.isFile() && entry.name === "index.html" ? [entryPath] : [];
  });
}

function getRoute(filePath) {
  const relativePath = path.relative(outputDirectory, filePath).split(path.sep).join("/");
  return `/${relativePath.replace(/index\.html$/, "")}`;
}

function decodeHtml(value = "") {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;|&#x27;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function encodeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function trimAtWordBoundary(value, maxLength) {
  const text = value.trim().replace(/\s+/g, " ");
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength + 1);
  const boundary = truncated.lastIndexOf(" ");
  return (boundary >= Math.floor(maxLength * 0.65) ? truncated.slice(0, boundary) : truncated.slice(0, maxLength)).trim();
}

function normalizeTitle(rawTitle, route) {
  const baseTitle =
    titleOverrides[route] ||
    rawTitle.replace(/(?:\s*\|\s*ResumeSathi)+\s*$/i, "").trim();
  let title = trimAtWordBoundary(baseTitle, 45);

  if (title.length < 31) {
    let suffix = ": ResumeSathi Guide";
    if (route.startsWith("/tools/typing/learn/lesson/")) suffix = ": Typing Practice";
    else if (route.startsWith("/resume/")) suffix = ": Resume Builder";
    else if (route.startsWith("/bio-data/")) suffix = ": Bio-Data Maker";
    else if (route.startsWith("/tools/")) suffix = ": Online Tool";
    else if (route.startsWith("/blog/")) suffix = ": Career Guide";
    title = trimAtWordBoundary(`${title}${suffix}`, 45);
  }
  while (title.length < 31) {
    title = `${title} Guide`;
  }

  const completeTitle = `${title}${brandSuffix}`;
  if (completeTitle.length < 45 || completeTitle.length > 60) {
    throw new Error(`${route}: normalized title is ${completeTitle.length} characters: ${completeTitle}`);
  }
  return completeTitle;
}

function normalizeDescription(rawDescription, route) {
  let description = descriptionOverrides[route] || rawDescription.trim().replace(/\s+/g, " ");
  if (description.length > 158) description = trimAtWordBoundary(description, 158);
  if (description.length < 120) {
    description = trimAtWordBoundary(
      `${description} Use ResumeSathi to review the details and take the next step.`,
      158,
    );
  }
  if (description.length < 120) {
    description = trimAtWordBoundary(
      `${description} Compare related options and choose a format that suits your needs.`,
      158,
    );
  }
  if (description.length < 120 || description.length > 158) {
    throw new Error(`${route}: normalized description is ${description.length} characters.`);
  }
  return description;
}

function setAttribute(tag, attribute, value) {
  const escapedValue = encodeHtml(value);
  const pattern = new RegExp(`(\\b${attribute}=["'])[^"']*(["'])`, "i");
  if (!pattern.test(tag)) return tag;
  return tag.replace(pattern, `$1${escapedValue}$2`);
}

if (!fs.existsSync(outputDirectory)) {
  throw new Error("The out/ directory does not exist. Run npm run build first.");
}

for (const filePath of listHtmlFiles(outputDirectory)) {
  let html = fs.readFileSync(filePath, "utf8");
  const route = getRoute(filePath);
  const currentTitle = decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const currentDescription =
    decodeHtml(
      (html.match(/<meta\b[^>]*\bname=["']description["'][^>]*>/i)?.[0] || "")
        .match(/\bcontent=["']([^"']*)["']/i)?.[1] || "",
    );
  const title = normalizeTitle(currentTitle, route);
  const description = normalizeDescription(currentDescription, route);

  html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${encodeHtml(title)}</title>`);
  html = html.replace(/<meta\b[^>]*>/gi, (tag) => {
    const name = tag.match(/\bname=["']([^"']+)["']/i)?.[1]?.toLowerCase();
    const property = tag.match(/\bproperty=["']([^"']+)["']/i)?.[1]?.toLowerCase();
    if (name === "keywords") return "";
    if (name === "description" || name === "twitter:description") {
      return setAttribute(tag, "content", description);
    }
    if (name === "twitter:title" || property === "og:title") {
      return setAttribute(tag, "content", title);
    }
    if (property === "og:description") {
      return setAttribute(tag, "content", description);
    }
    return tag;
  });
  fs.writeFileSync(filePath, html);
}

console.log(`Normalized title/description metadata and removed keywords meta tags from ${listHtmlFiles(outputDirectory).length} exported pages.`);
