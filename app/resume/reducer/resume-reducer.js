import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  resumes: [], // always empty at first; loader fills it on client
  progress_percent: 0,
  preview_resume_size: 0,
};

const touchResume = (resume) => {
  if (resume) {
    resume.updated_at = Date.now();
  }
};

const normalizeResumes = (resumes) => {
  if (Array.isArray(resumes)) return resumes;
  if (resumes && typeof resumes === 'object') {
    const objectValueResumes = Object.values(resumes).filter((resume) => resume?.id);
    if (objectValueResumes.length > 0) return objectValueResumes;
    if (Array.isArray(resumes.resumes)) return resumes.resumes;
  }
  return [];
};

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    // ✅ Generic state setters
    setProgressPercent: (state, action) => {
      state.progress_percent = action.payload;
    },
    setPreviewResumeSize: (state, action) => {
      state.preview_resume_size = action.payload;
    },

    // ✅ Load ALL resumes (used by LocalStorageLoader)
    setResumes: (state, action) => {
      state.resumes = normalizeResumes(action.payload);
    },

    // ✅ Create new resume with ID
    setId: (state, action) => {
      const id = action.payload;
      const newResume = {
        id,
        configuration: {
          font_style: 'poppins',
          layout_style: 'Two Column',
          color_palette: 'color-2',
          selected_theme: 'ResumeTemplate1',
        },
        personal_infomation: {},
        summary: {},
        educations: [],
        certificates: [],
        skills: [],
        work_experiences: [],
        social_medias: [],
        any_internships: [],
        languages: [],
        hobbies: [],
        skipped_steps: {},
        resume_name: '',
        is_submitted: false,
        updated_at: Number(id) || Date.now(),
      };
      state.resumes.push(newResume);
    },

    markResumeSubmitted: (state, action) => {
      const id = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        resume.is_submitted = true;
        touchResume(resume);
      }
    },

    markResumeStepSkipped: (state, action) => {
      const { id, step } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        resume.skipped_steps = {
          ...(resume.skipped_steps || {}),
          [step]: true,
        };
        touchResume(resume);
      }
    },

    // ✅ Update name
    setResumeName: (state, action) => {
      const { id, data } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        resume.resume_name = data;
        touchResume(resume);
      }
    },

    // ✅ Update configuration
    setResumeConfigration: (state, action) => {
      const { id, data } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        resume.configuration = { ...data };
        touchResume(resume);
      }
    },

    // ✅ Update personal info
    setResumePersonalInfomation: (state, action) => {
      const { id, data } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        resume.personal_infomation = { ...data };
        touchResume(resume);
      }
    },

    // ✅ Update summary
    setResumeSummary: (state, action) => {
      const { id, data } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        resume.summary = { ...data };
        touchResume(resume);
      }
    },

    // ✅ Add or update education
    setResumeEducations: (state, action) => {
      const { id, data } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const index = resume.educations.findIndex(item => item.edu_id === data.edu_id);
        if (index !== -1) {
          resume.educations[index] = { ...data };
        } else {
          resume.educations.push({ ...data });
        }
        touchResume(resume);
      }
    },
    deleteEducationFromResume: (state, action) => {
      const { id, eduId } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        resume.educations = resume.educations.filter(edu => edu.edu_id !== eduId);
        touchResume(resume);
      }
    },
    reorderEducations: (state, action) => {
      const { id, startIndex, endIndex } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const [removed] = resume.educations.splice(startIndex, 1);
        resume.educations.splice(endIndex, 0, removed);
        touchResume(resume);
      }
    },

    // ✅ Add or update certification
    setResumeCertifications: (state, action) => {
      const { id, data } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const index = resume.certificates.findIndex(item => item.certificate_id === data.certificate_id);
        if (index !== -1) {
          resume.certificates[index] = { ...data };
        } else {
          resume.certificates.push({ ...data });
        }
        resume.skipped_steps = { ...(resume.skipped_steps || {}), certificate: false };
        touchResume(resume);
      }
    },
    deleteCertificateFromResume: (state, action) => {
      const { id, certificateId } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        resume.certificates = resume.certificates.filter(cert => cert.certificate_id !== certificateId);
        touchResume(resume);
      }
    },
    reorderCertificates: (state, action) => {
      const { id, startIndex, endIndex } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const [removed] = resume.certificates.splice(startIndex, 1);
        resume.certificates.splice(endIndex, 0, removed);
        touchResume(resume);
      }
    },

    // ✅ Add or update skill
    setResumeSkills: (state, action) => {
      const { id, data } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const index = resume.skills.findIndex(item => item.skill_id === data.skill_id);
        if (index !== -1) {
          resume.skills[index] = { ...data };
        } else {
          resume.skills.push({ ...data });
        }
        resume.skipped_steps = { ...(resume.skipped_steps || {}), skill: false };
        touchResume(resume);
      }
    },
    deleteSkillFromResume: (state, action) => {
      const { id, skillId } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        resume.skills = resume.skills.filter(skill => skill.skill_id !== skillId);
        touchResume(resume);
      }
    },
    reorderSkills: (state, action) => {
      const { id, startIndex, endIndex } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const [removed] = resume.skills.splice(startIndex, 1);
        resume.skills.splice(endIndex, 0, removed);
        touchResume(resume);
      }
    },

    // ✅ Add or update work experience
    setResumeWorkExperiences: (state, action) => {
      const { id, data } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const index = resume.work_experiences.findIndex(item => item.workEperience_id === data.workEperience_id);
        if (index !== -1) {
          resume.work_experiences[index] = { ...data };
        } else {
          resume.work_experiences.push({ ...data });
        }
        resume.skipped_steps = { ...(resume.skipped_steps || {}), work_experience: false };
        touchResume(resume);
      }
    },
    deleteWorkExperienceFromResume: (state, action) => {
      const { id, workExperienceId } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        resume.work_experiences = resume.work_experiences.filter(exp => exp.workEperience_id !== workExperienceId);
        touchResume(resume);
      }
    },
    reorderWorkExperiences: (state, action) => {
      const { id, startIndex, endIndex } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const [removed] = resume.work_experiences.splice(startIndex, 1);
        resume.work_experiences.splice(endIndex, 0, removed);
        touchResume(resume);
      }
    },

    // ✅ Add or update social media
    setResumeSocialMedias: (state, action) => {
      const { id, data } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const index = resume.social_medias.findIndex(item => item.socialMedia_id === data.socialMedia_id);
        if (index !== -1) {
          resume.social_medias[index] = { ...data };
        } else {
          resume.social_medias.push({ ...data });
        }
        resume.skipped_steps = { ...(resume.skipped_steps || {}), social_media: false };
        touchResume(resume);
      }
    },
    deleteSocialMediaFromResume: (state, action) => {
      const { id, socialMediaId } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        resume.social_medias = resume.social_medias.filter(sm => sm.socialMedia_id !== socialMediaId);
        touchResume(resume);
      }
    },
    reorderSocialMedias: (state, action) => {
      const { id, startIndex, endIndex } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const [removed] = resume.social_medias.splice(startIndex, 1);
        resume.social_medias.splice(endIndex, 0, removed);
        touchResume(resume);
      }
    },

    // ✅ Add or update internship
    setResumeAnyInternships: (state, action) => {
      const { id, data } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const index = resume.any_internships.findIndex(item => item.anyInternship_id === data.anyInternship_id);
        if (index !== -1) {
          resume.any_internships[index] = { ...data };
        } else {
          resume.any_internships.push({ ...data });
        }
        resume.skipped_steps = { ...(resume.skipped_steps || {}), internship: false };
        touchResume(resume);
      }
    },
    deleteAnyInternshipFromResume: (state, action) => {
      const { id, anyIntershipId } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        resume.any_internships = resume.any_internships.filter(item => item.anyInternship_id !== anyIntershipId);
        touchResume(resume);
      }
    },
    reorderAnyInternships: (state, action) => {
      const { id, startIndex, endIndex } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const [removed] = resume.any_internships.splice(startIndex, 1);
        resume.any_internships.splice(endIndex, 0, removed);
        touchResume(resume);
      }
    },

    // ✅ Add or update language
    setResumeLanguages: (state, action) => {
      const { id, data } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const index = resume.languages.findIndex(item => item.language_id === data.language_id);
        if (index !== -1) {
          resume.languages[index] = { ...data };
        } else {
          resume.languages.push({ ...data });
        }
        touchResume(resume);
      }
    },
    deleteLanguagesFromResume: (state, action) => {
      const { id, languageId } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        resume.languages = resume.languages.filter(lang => lang.language_id !== languageId);
        touchResume(resume);
      }
    },
    reorderLanguages: (state, action) => {
      const { id, startIndex, endIndex } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const [removed] = resume.languages.splice(startIndex, 1);
        resume.languages.splice(endIndex, 0, removed);
        touchResume(resume);
      }
    },

    // ✅ Add or update hobby
    setResumeHobbies: (state, action) => {
      const { id, data } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const index = resume.hobbies.findIndex(item => item.hobbie_id === data.hobbie_id);
        if (index !== -1) {
          resume.hobbies[index] = { ...data };
        } else {
          resume.hobbies.push({ ...data });
        }
        resume.skipped_steps = { ...(resume.skipped_steps || {}), hobbie: false };
        touchResume(resume);
      }
    },
    deleteHobbieFromResume: (state, action) => {
      const { id, hobbieId } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        resume.hobbies = resume.hobbies.filter(hobby => hobby.hobbie_id !== hobbieId);
        touchResume(resume);
      }
    },
    reorderHobbies: (state, action) => {
      const { id, startIndex, endIndex } = action.payload;
      const resume = state.resumes.find(resume => resume.id === id);
      if (resume) {
        const [removed] = resume.hobbies.splice(startIndex, 1);
        resume.hobbies.splice(endIndex, 0, removed);
        touchResume(resume);
      }
    },

  },
});

// ✅ Export all actions
export const {
  setProgressPercent,
  setPreviewResumeSize,
  setResumes,
  setId,
  markResumeSubmitted,
  markResumeStepSkipped,
  setResumeName,
  setResumeConfigration,
  setResumePersonalInfomation,
  setResumeSummary,
  setResumeEducations,
  deleteEducationFromResume,
  reorderEducations,
  setResumeCertifications,
  deleteCertificateFromResume,
  reorderCertificates,
  setResumeSkills,
  deleteSkillFromResume,
  reorderSkills,
  setResumeWorkExperiences,
  deleteWorkExperienceFromResume,
  reorderWorkExperiences,
  setResumeSocialMedias,
  deleteSocialMediaFromResume,
  reorderSocialMedias,
  setResumeAnyInternships,
  deleteAnyInternshipFromResume,
  reorderAnyInternships,
  setResumeLanguages,
  deleteLanguagesFromResume,
  reorderLanguages,
  setResumeHobbies,
  deleteHobbieFromResume,
  reorderHobbies,
} = resumeSlice.actions;

export default resumeSlice.reducer;
