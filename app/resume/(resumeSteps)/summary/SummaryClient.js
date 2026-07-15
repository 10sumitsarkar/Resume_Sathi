'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeSummary } from '../../reducer/resume-reducer';
import MobProgressArea from '../../components/MobProgressArea';

export default function Summary() {
  const router = useRouter();
  const searchParams = useSearchParams();
const id = searchParams.get('id');
  const [loading, setLoading] = useState(false);

  const summary = useSelector(state =>
    state.resume.resumes.find(resume => resume.id === id)?.summary
  );

  const [summaryFormData, setSummaryFormData] = useState(summary || {});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: summary || {},
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setSummaryFormData(prev => ({
        ...value,
      }));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (summaryFormData) {
      dispatch(setResumeSummary({ id: id, data: summaryFormData }));
    }
  }, [summaryFormData, dispatch, id]);

  const onSubmit = (data) => {
    const completedSummary = { ...summaryFormData, step_done: true };
    setLoading(true);
    setValue("step_done", true);
    dispatch(setResumeSummary({ id: id, data: completedSummary }));
    setTimeout(() => {
      setLoading(false);
      router.push(`/resume/education?id=${id}`);
    }, 2500);
  };

  return (
    <>
      <div className='resume-form-div py-custom'>
        <div className='form-heading'>
          <h1>Summary / Objective</h1>
          <p>Let's define your career goals to highlight your aspirations.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="container-fluid px-0 py-custom pb-5 pb-md-0 mb-5 mb-md-0">
            <div className="row">
              <div className="col-12 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="summary">Brief Introduction<span className='text-danger'>*</span></label>
                  <textarea
                    rows={8}
                    {...register("summary", { required: "Summary is required" })}
                    className={` ${errors.summary ? 'is-invalid' : ''}`}
                    id="summary"
                    placeholder="Write a short professional summary..."
                    value={summaryFormData.summary || ''}
                    onChange={(e) =>
                      setSummaryFormData(prev => ({ ...prev, summary: e.target.value }))
                    }
                  />
                  <button type='button' className='refine-al-btn' disabled title="Coming Soon">
                    <img src="/front-assets/images/icons/refine-ai.svg" alt="Refine AI" /> Refine with AI
                  </button>
                </div>
                {errors.summary && <p className="input-error">{errors.summary.message}</p>}
              </div>
            </div>
          </div>

          {/* Desktop Buttons */}
          <div className='next-prev-btn-div d-none d-lg-flex'>
            <button type='button' className='prev-btn' onClick={() => router.back()}>Prev</button>
            <button type='submit' className='next-btn'>Next</button>
          </div>

          {/* Mobile Buttons */}
          <div className="mob-form-bottom-nav custom-container d-lg-none">
            <MobProgressArea />
            <div className='form-button-div'>
              <button type='button' className='prev-btn' onClick={() => router.back()}>Prev</button>
              <button type='submit' className='next-btn'>Next</button>
            </div>
          </div>
        </form>
      </div>

      {loading && (
        <div className='loader-div'>
          <div className='loader-inner-div'>
            <div className="box" id="loader1"></div>
            <div className="box" id="loader2"></div>
            <div className="box" id="loader3"></div>
            <div className="box" id="loader4"></div>
            <div className="box" id="loader5"></div>
          </div>
        </div>
      )}
    </>
  );
}
