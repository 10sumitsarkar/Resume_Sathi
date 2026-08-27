'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeEducations, deleteEducationFromResume, reorderEducations } from '../../reducer/resume-reducer';
import MobProgressArea from '../../components/MobProgressArea';
import CustomInput from '../../../components/CustomInput/CustomInput';

export default function Education() {
  const searchParams = useSearchParams();
const id = searchParams.get('id');
  const router = useRouter();
  const formRef = useRef(null);

  const [stillEnrolled, setStillEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formOpened, setFormOpened] = useState('');
  const [editStatus, setEditStatus] = useState(false);
  const [eduIindex, setEduIndex] = useState(1);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const educations = useSelector(
    (state) => state.resume.resumes.find((resume) => resume.id === id)?.educations || []
  );
  const [educationFormData, setEducationFormData] = useState(educations);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: educationFormData
  });

  useEffect(() => {
    if (educations.length < 1) {
      setFormOpened(true);
    } else {
      setFormOpened(false);
    }
  }, []);

  const handleStillEnrolledChange = (e) => {
    const checked = e.target.checked;
    setStillEnrolled(checked);
    if (checked) {
      setValue("date", "");
      setValue("year", "");
    }
  };

  const AddMoreEducation = () => {
    const newIndex = `${Date.now()}`;
    setEduIndex(newIndex);
    const newEduId = `edu_${newIndex}_${id}`;
    reset({
      edu_id: newEduId,
      exam_name: '',
      board_university: '',
      passing_year: '',
      marks: '',
    });
    setStillEnrolled(false);
    setFormOpened(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    document.getElementById('saveDetails').innerText = 'Save';
  };

  const onSubmit = (data) => {
    dispatch(setResumeEducations({ id, data: data }));
    setFormOpened(false);
    reset();

    if (editStatus) {
      toast.success('Education details updated successfully.', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'light',
      });
    } else {
      toast.success('Education saved successfully.', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'light',
      });
    }

    setEditStatus(false);
  };

  const editEducation = (eduId) => {
    const educationToEdit = educations.find((edu) => edu.edu_id === eduId);
    if (educationToEdit) {
      setEditStatus(true);
      document.getElementById('saveDetails').innerText = 'Update';
      setFormOpened(true);
      setEducationFormData(educationToEdit);
      setStillEnrolled(!educationToEdit.date && !educationToEdit.year);
      reset(educationToEdit);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const confirmDelete = (eduId) => {
    setDeleteId(eduId);
    const modalElement = document.getElementById('deleteConfirmationModal');
    if (modalElement && window.bootstrap) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    }
  };

  const executeDelete = () => {
    if (deleteId) {
      dispatch(deleteEducationFromResume({ id, eduId: deleteId }));
      reset();
      setFormOpened(false);
      setDeleteId(null);
      const modalElement = document.getElementById('deleteConfirmationModal');
      if (modalElement && window.bootstrap) {
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
      }
    }
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      dispatch(reorderEducations({ id, startIndex: draggedIndex, endIndex: index }));
    }
    setDraggedIndex(null);
  };

  const nextButton = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(`/bio-data/work-experience/?id=${id}`);
    }, educations.length >= 1 ? 1200 : 500);
  };

  return (
    <>
      <div className='resume-form-div py-custom'>
        <div className='form-heading'>
          <h1>Education</h1>
          <p>Let's define your career goals to highlight your aspirations.</p>
        </div>

        <div className='mt-5 mb-4'>
          {educations.map((edu, index) => (
            <div
              className='saved-details-div mb-3'
              key={edu.edu_id || index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              style={{ cursor: "grab" }}
            >
              <div className='content-div'>
                <p className='title'>
                  {edu.exam_name || edu.degree}, <span>{edu.board_university || edu.institute_name}</span>
                </p>
                <p className='all-details'>
                  {(edu.board_university || edu.institute_name) && (
                    <span>
                      <img src="/front-assets/images/icons/education-icon.svg" width={18} height={18} alt="Education" /> {edu.board_university || edu.institute_name}
                    </span>
                  )}
                  {edu.marks && (
                    <>
                      |<span>{edu.marks}</span>
                    </>
                  )}
                  {(edu.passing_year || edu.year) ? (
                    <>
                      |<span><img src="/front-assets/images/icons/date.svg" alt="Date" /> {edu.passing_year || edu.year}</span>
                    </>
                  ) : (
                    <span>Year not added</span>
                  )}
                </p>
              </div>
              <div className='button-div'>
                <div
                  className="drag-handle"
                  title="Drag to reorder">

                  <svg width="16" height="6" viewBox="0 0 16 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 0H1C0.45 0 0 0.45 0 1C0 1.55 0.45 2 1 2H15C15.55 2 16 1.55 16 1C16 0.45 15.55 0 15 0ZM1 6H15C15.55 6 16 5.55 16 5C16 4.45 15.55 4 15 4H1C0.45 4 0 4.45 0 5C0 5.55 0.45 6 1 6Z" fill="black" />
                  </svg>

                </div>
                <button type='button' className='edit-btn' onClick={() => editEducation(edu.edu_id)}>
                  <img src="/front-assets/images/icons/edit.svg" width={28} height={28} alt="Edit" />
                </button>
                <button type='button' className='delete-btn' onClick={() => confirmDelete(edu.edu_id)}>
                  <img src="/front-assets/images/icons/delete.svg" width={28} height={28} alt="Delete" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
          <div className="container-fluid px-0  pb-5 pb-md-0 my-5 mb-md-0">

            <div className={`row ${formOpened === true ? '' : 'd-none'}`}>

              <input type="text"  {...register("edu_id", { required: "ID is required" })} id="edu_id" defaultValue={educationFormData.edu_id || `edu_${Number(eduIindex)}_${id}`} hidden />

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4"> 
                <div className="each-input-div">
                  <label htmlFor="exam_name">Name of Exam<span className='text-danger'>*</span></label>
                  <input type="text" {...register("exam_name", { required: "Name of exam is required" })} className={`${errors.exam_name ? 'is-invalid' : ''}`} id="exam_name" placeholder="E.g., Madhyamik, H.S. (Science), B.Sc. (Biology)" />
                </div>
                {errors.exam_name && <p className="input-error">{errors.exam_name.message}</p>}
              </div>


              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="board_university">Board / University<span className='text-danger'>*</span></label>
                  <input type="text"  {...register("board_university", { required: "Board / University is required" })} className={`${errors.board_university ? 'is-invalid' : ''}`} id="board_university" placeholder="E.g., W.B.B.S.E." />
                </div>
                {errors.board_university && <p className="input-error">{errors.board_university.message}</p>}
              </div>

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="passing_year">Year of Passing<span className='text-danger'>*</span></label>
                  <CustomInput
                    type="select"
                    register={register}
                    registerName="passing_year"
                    registerOptions={{ required: "Year of passing is required" }}
                    setValue={setValue}
                    options={Array.from({ length: 80 }, (_, i) => {
                      const year = new Date().getFullYear() + 1 - i;
                      return { value: String(year), label: String(year) };
                    })}
                    search={true}
                    className={`${errors.passing_year ? 'is-invalid' : ''}`}
                    placeholder="Select year"
                  />
                </div>
                {errors.passing_year && <p className="input-error">{errors.passing_year.message}</p>}
              </div>

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="marks">% of Marks<span className='text-danger'>*</span></label>
                  <input
                    type="text"
                    inputMode="decimal"
                    {...register("marks", { required: "Marks are required", pattern: { value: /^(100|[1-9]?\d)(\.\d{1,2})?%?$/, message: "Enter valid marks percentage" } })}
                    className={`${errors.marks ? 'is-invalid' : ''}`}
                    id="marks"
                    placeholder="E.g., 60%"
                    onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.%]/g, ''); }}
                  />
                </div>
                {errors.marks && <p className="input-error">{errors.marks.message}</p>}
              </div>

            </div>

            <div className={`cancel-save-btn-div ${formOpened === true ? '' : 'd-none'}`}>
              <button type='button' className={`cancel-btn`} onClick={() => setFormOpened(false)}>
                <img src="/front-assets/images/icons/cancel.svg" alt="Cancel" />
                Cancel
              </button>

              <button type='submit' className='save-btn'>
                <img src="/front-assets/images/icons/save.svg" alt="Save" />
                <span id='saveDetails'>Save</span></button>
            </div>


            <button type='button' className={`add-more-btn ${formOpened === true ? 'd-none' : ''}`} onClick={AddMoreEducation}>
              <img src="/front-assets/images/icons/add-more.svg" alt="Add More" /> Add More Education
            </button>
          </div >

        </form>

        <div className='next-prev-btn-div d-none d-lg-flex'>
          <button type='button' onClick={() => router.back()} className='prev-btn'>Prev</button>
          {educations.length < 1 && !formOpened && <button type='button' onClick={nextButton} className='prev-btn'>Skip</button>}
          <button type='button' onClick={nextButton} className='next-btn'>{educations.length >= 1 ? 'Next' : 'Skip & Next'}</button>
        </div>

        <div className='mob-form-bottom-nav custom-container d-lg-none'>
          <MobProgressArea />
          <div className='form-button-div'>
            <button type='button' onClick={() => router.back()} className='prev-btn'>Prev</button>
            <button type='button' onClick={nextButton} className='next-btn'>{educations.length >= 1 ? 'Next' : 'Skip & Next'}</button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal start */}
      <div className="modal fade completedModal" id="deleteConfirmationModal" tabIndex="-1" aria-labelledby="deleteConfirmationModalLabel" data-bs-backdrop="static" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body py-4">
              <h5 className='heading text-center'>Confirm Deletion</h5>
              <p className='sub-heading text-center mt-2'>Are you sure you want to delete this item?</p>
              <div className='btn-div mt-4'>
                <button type="button" className='cancel-btn' data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                <button type="button" onClick={executeDelete} className='got-it-btn bg-danger text-white border-0' aria-label="Delete">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal end */}

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

      <ToastContainer />
    </>
  );
}
