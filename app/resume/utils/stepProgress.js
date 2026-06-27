export const resumeSteps = [
  { key: 'personal_info', segment: 'personal-info', label: 'Personal Information' },
  { key: 'summary', segment: 'summary', label: 'Summary / Objective' },
  { key: 'education', segment: 'education', label: 'Education' },
  { key: 'certificate', segment: 'certificate', label: 'Certifications', optional: true },
  { key: 'skill', segment: 'skill', label: 'Skills', optional: true },
  { key: 'work_experience', segment: 'work-experience', label: 'Work Experiences', optional: true },
  { key: 'social_media', segment: 'social-media', label: 'Social Media', optional: true },
  { key: 'internship', segment: 'internship', label: 'Any Internship', optional: true },
  { key: 'language', segment: 'language', label: 'Language' },
  { key: 'hobbie', segment: 'hobbie', label: 'Hobbies', optional: true },
];

export const getStepPath = (step, id) => `/resume/${step.segment}/${id}`;

const hasItems = (items) => Array.isArray(items) && items.length > 0;
const wasSkipped = (resume, key) => resume?.skipped_steps?.[key] === true;

export const isStepComplete = (resume, key) => {
  if (!resume) return false;

  switch (key) {
    case 'personal_info':
      return resume.personal_infomation?.step_done === true;
    case 'summary':
      return resume.summary?.step_done === true;
    case 'education':
      return hasItems(resume.educations);
    case 'certificate':
      return hasItems(resume.certificates) || wasSkipped(resume, key);
    case 'skill':
      if (resume.personal_infomation?.experience === 'Experienced') {
        return hasItems(resume.skills);
      }
      return hasItems(resume.skills) || wasSkipped(resume, key);
    case 'work_experience':
      if (resume.personal_infomation?.experience === 'Experienced') {
        return hasItems(resume.work_experiences);
      }
      return hasItems(resume.work_experiences) || wasSkipped(resume, key);
    case 'social_media':
      return hasItems(resume.social_medias) || wasSkipped(resume, key);
    case 'internship':
      return hasItems(resume.any_internships) || wasSkipped(resume, key);
    case 'language':
      return hasItems(resume.languages);
    case 'hobbie':
      return hasItems(resume.hobbies) || wasSkipped(resume, key);
    default:
      return false;
  }
};

export const getFirstIncompleteStepIndex = (resume) => {
  const index = resumeSteps.findIndex((step) => !isStepComplete(resume, step.key));
  return index === -1 ? resumeSteps.length : index;
};

export const getStepIndexBySegment = (segment) =>
  resumeSteps.findIndex((step) => step.segment === segment);

export const canOpenStep = (resume, segment) => {
  const targetIndex = getStepIndexBySegment(segment);
  if (targetIndex === -1) return true;
  return targetIndex <= getFirstIncompleteStepIndex(resume);
};
