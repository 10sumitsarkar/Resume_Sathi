export const resumeSteps = [
  { key: 'personal_info', segment: 'personal-info', label: 'Personal Information' },
  { key: 'education', segment: 'education', label: 'Education' },
  { key: 'work_experience', segment: 'work-experience', label: 'Work Details', optional: true },
  { key: 'hobbie', segment: 'hobbie', label: 'Hobbies & Interests', optional: true },
];

export const getStepPath = (step, id) => `/bio-data/${step.segment}/?id=${id}`;

const hasItems = (items) => Array.isArray(items) && items.length > 0;
const wasSkipped = (resume, key) => resume?.skipped_steps?.[key] === true;

export const isStepComplete = (resume, key) => {
  if (!resume) return false;

  switch (key) {
    case 'personal_info':
      return resume.personal_infomation?.step_done === true;
    case 'education':
      return hasItems(resume.educations);
    case 'work_experience':
      return hasItems(resume.work_experiences) || wasSkipped(resume, key);
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
