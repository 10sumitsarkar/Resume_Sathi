import React, { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import "../resume-css/biodata.css";

const sampleResume = {
  personal_infomation: {
    firstName: "Basanti",
    lastName: "Manna",
    father_name: "Tapan Manna",
    mother_name: "Mother Name",
    date_of_birth: "15.04.1994",
    permanent_address: "Vill. - Mahammadpur, P.O. - Nandakumar\nP.S. - Nandakumar, Dist. - Purba Medinipur,\nPin - 721632, W.B. India",
    present_address: "Vill. - Mahammadpur, P.O. + P.S. - Nandakumar\nDist. - Purba Medinipur, Pin - 721632, W.B. India",
    caste: "General",
    marital_status: "Married",
    sex: "Female",
    nationality: "Indian",
    religion: "Hindu",
    languages: "Bengali, Hindi",
  },
  educations: [
    { degree: "Madhyamik", institute_name: "W.B.B.S.E.", year: "2009", marks: "60%" },
    { degree: "H.S. (Science)", institute_name: "W.B.C.H.S.E.", year: "2011", marks: "50%" },
    { degree: "B.Sc. (Biology)", institute_name: "Vidyasagar University", year: "2013", marks: "XXX" },
  ],
  work_experiences: [
    { job_title: "Health Worker", company_name: "W.B.S.C.", start_year: "2016", description: "Paramedical health worker experience." },
  ],
  hobbies: [
    { hobbies: "Painting" },
    { hobbies: "Tailoring" },
  ],
};

const formatName = (info) =>
  [info.firstName, info.lastName].filter(Boolean).join(" ").trim() || "Your Name";

const formatDate = (value) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}.${month}.${year}`;
  }
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
  }
  return value;
};

const getEducationExam = (edu) =>
  edu.exam_name || [edu.degree, edu.field_study && `(${edu.field_study})`].filter(Boolean).join(" ");

const getPassingYear = (edu) => edu.passing_year || edu.year || [edu.date, edu.year].filter(Boolean).join(" ");

function BiodataRows({ info }) {
  const rows = [
    ["NAME", formatName(info).toUpperCase()],
    ["FATHER'S NAME", info.father_name],
    ["MOTHER'S NAME", info.mother_name],
    ["DATE OF BIRTH", formatDate(info.date_of_birth)],
    ["PERMANENT ADDRESS", info.permanent_address || info.address],
    ["PRESENT ADDRESS", info.present_address],
    ["CASTE", info.caste],
    ["MARITAL STATUS", info.marital_status],
    ["SEX", info.sex],
    ["NATIONALITY", info.nationality],
    ["RELIGION", info.religion],
    ["LANGUAGES", info.languages],
  ].filter(([, value]) => value);

  return (
    <div className="bd_rows">
      {rows.map(([label, value]) => (
        <div className="bd_row" key={label}>
          <div className="bd_label">{label}</div>
          <div className="bd_colon">:</div>
          <div className="bd_value">{String(value).split("\n").map((line, index) => <React.Fragment key={index}>{line}{index < String(value).split("\n").length - 1 && <br />}</React.Fragment>)}</div>
        </div>
      ))}
    </div>
  );
}

export default function BiodataTemplate({ additionalClass = "", isStatic = false, resumeId, isForDownload = false, variant = 1 }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const activeResumeId = resumeId || id;
  const pathname = usePathname();
  const containerRef = useRef(null);
  const bioDataRef = useRef(null);
  const previewResumeSize = useSelector((state) => state.resume.preview_resume_size);
  const activeResume = useSelector((state) => {
    const resumes = Array.isArray(state.resume.resumes) ? state.resume.resumes : [];
    return resumes.find((resume) => resume.id === activeResumeId) || {};
  });

  const showStaticData = isStatic || pathname?.includes("select-theme");
  const resume = showStaticData ? sampleResume : activeResume;
  const info = resume.personal_infomation || {};
  const educations = resume.educations || [];
  const works = resume.work_experiences || [];
  const hobbies = resume.hobbies || [];
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const bioData = bioDataRef.current;
    if (!container || !bioData) return;
    const updateScaleAndHeight = () => {
      const availableWidth = container.clientWidth || container.offsetWidth;
      if (!availableWidth) return;
      const newScale = availableWidth / 800;
      setScale(newScale);
      setScaledHeight(bioData.offsetHeight * newScale);
    };

    const frameIds = [];
    const timeoutIds = [];
    const scheduleUpdate = () => {
      updateScaleAndHeight();
      frameIds.push(requestAnimationFrame(updateScaleAndHeight));
      frameIds.push(requestAnimationFrame(() => requestAnimationFrame(updateScaleAndHeight)));
      timeoutIds.push(window.setTimeout(updateScaleAndHeight, 80));
      timeoutIds.push(window.setTimeout(updateScaleAndHeight, 250));
    };

    scheduleUpdate();
    const observer = new ResizeObserver(updateScaleAndHeight);
    observer.observe(container);
    observer.observe(bioData);
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      observer.disconnect();
      frameIds.forEach((frameId) => cancelAnimationFrame(frameId));
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [additionalClass, previewResumeSize, showStaticData, variant, educations.length, works.length, hobbies.length]);

  return (
    <div ref={containerRef} className="resume-preview-div bd-preview-shell" data-selected-resume={`bioDataTemplate${variant}`} style={{ height: `${scaledHeight}px` }}>
      <div ref={bioDataRef} id={isForDownload ? "resume-download-area" : undefined} className="position-absolute top-0 start-0" style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: "800px" }}>
        <div className={`bd_sheet bd_variant_${variant} ${additionalClass}`}>
          <h1>BIO-DATA</h1>
          {info.photo && <img className="bd_photo" src={info.photo} alt={`${formatName(info)} photo`} />}
          <BiodataRows info={info} />

          {educations.length > 0 && (
            <section className="bd_section">
              <h2>EDUCATIONAL QUALIFICATION</h2>
              <table className="bd_table">
                <thead>
                  <tr>
                    <th>Name of Exam</th>
                    <th>Board / University</th>
                    <th>Year of Passing</th>
                    <th>% of Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {educations.map((edu, index) => (
                    <tr key={edu.edu_id || index}>
                      <td>{getEducationExam(edu)}</td>
                      <td>{edu.board_university || edu.institute_name}</td>
                      <td>{getPassingYear(edu)}</td>
                      <td>{edu.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {works.length > 0 && (
            <section className="bd_section">
              <h2>WORK DETAILS</h2>
              <ul className="bd_list">
                {works.map((work, index) => (
                  <li key={work.workEperience_id || index}>
                    {[work.job_title, work.company_name].filter(Boolean).join(" - ")}
                    {[work.start_month, work.start_year].filter(Boolean).length ? ` (${[work.start_month, work.start_year].filter(Boolean).join(" ")}${work.end_year ? ` to ${[work.end_month, work.end_year].filter(Boolean).join(" ")}` : " to Present"})` : ""}
                    {work.description ? ` - ${work.description}` : ""}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {hobbies.length > 0 && (
            <section className="bd_section">
              <h2>HOBBIES & INTERESTS</h2>
              <ul className="bd_list">
                {hobbies.map((hobby, index) => (
                  <li key={hobby.hobbie_id || index}>{hobby.hobbies || hobby}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="bd_declaration">
            <h2>DECLARATION</h2>
            <p>I hereby declare that, the above information is true and correct to best of my knowledge.</p>
            <p>If above any information is false and incorrect that I have liable.</p>
          </section>

          <div className="bd_sign_row">
            <span>Date :</span>
            <span>Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
}
