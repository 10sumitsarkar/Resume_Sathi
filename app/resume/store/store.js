import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from '../reducer/resume-reducer';

import {
  persistStore,
  persistReducer,
  createTransform,
} from 'redux-persist';

import createIndexedDBStorage from 'redux-persist-indexeddb-storage';

const storage = createIndexedDBStorage('ResumeBuilderDB');

const normalizeResumes = (resumes) => {
  if (Array.isArray(resumes)) {
    return resumes;
  }

  if (resumes && typeof resumes === 'object') {
    const objectValueResumes = Object.values(resumes).filter((resume) => resume?.id);
    if (objectValueResumes.length > 0) {
      return objectValueResumes;
    }

    if (Array.isArray(resumes.resumes)) {
      return resumes.resumes;
    }
  }

  return [];
};

const sanitizeResumeForStorage = (resume) => {
  return resume;
};

const sanitizeResumesForStorage = (resumes) =>
  normalizeResumes(resumes).map(sanitizeResumeForStorage);

const sanitizePersistedState = (state) => ({
  ...state,
  progress_percent: 0,
  preview_resume_size: 0,
  resumes: sanitizeResumesForStorage(state?.resumes),
});

const resumeStorageTransform = createTransform(
  (inboundState, key) => {
    if (key === 'resumes') {
      return sanitizeResumesForStorage(inboundState);
    }
    if (key === 'progress_percent' || key === 'preview_resume_size') {
      return 0;
    }
    return inboundState;
  },
  (outboundState, key) => {
    if (key === 'resumes') {
      return sanitizeResumesForStorage(outboundState);
    }
    return outboundState;
  },
);

const persistConfig = {
  key: 'resume',
  version: 3,
  storage,
  transforms: [resumeStorageTransform],
  migrate: (state) => Promise.resolve(sanitizePersistedState(state || {})),
};

const persistedReducer = persistReducer(
  persistConfig,
  resumeReducer
);

export const store = configureStore({
  reducer: {
    resume: persistedReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
