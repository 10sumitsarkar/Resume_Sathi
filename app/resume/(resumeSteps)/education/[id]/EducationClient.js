'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeEducations, deleteEducationFromResume, reorderEducations } from '../../../reducer/resume-reducer';
import MobProgressArea from '../../../components/MobProgressArea';
import CustomInput from '../../../../components/CustomInput/CustomInput';

export default function Education() {
  const { id } = useParams();
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
    if (educationFormData?.date === '' && educationFormData?.year === '') {
      setStillEnrolled(true);
    } else {
      setStillEnrolled(false);
    }
  }, [educationFormData]);

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
      degree: '',
      field_study: '',
      institute_name: '',
      location: '',
      date: '',
      year: '',
    });
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
    if (educations.length >= 1) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        router.push(`/resume/certificate/${id}`);
      }, 2500);
    } else {
      toast.error('At least one education required.', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'light',
      });
    }
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
                  {edu.degree}, <span>{edu.field_study}</span>
                </p>
                <p className='all-details'>
                  {edu.institute_name && (
                    <span>
                      <img src="/front-assets/images/icons/education-icon.svg" width={18} height={18} alt="Education" /> {edu.institute_name}
                    </span>
                  )}
                  {edu.location && (
                    <>
                      |<span><img src="/front-assets/images/icons/location.svg" alt="Location" /> {edu.location}</span>
                    </>
                  )}
                  {(edu.date && edu.year) ? (
                    <>
                      |<span><img src="/front-assets/images/icons/date.svg" alt="Date" /> {edu.date}, {edu.year}</span>
                    </>
                  ) : (
                    <span>Still enrolled</span>
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
                  <label htmlFor="degree">Degree</label>
                  <CustomInput
                    type="select"
                    register={register}
                    registerName="degree"
                    registerOptions={{ required: 'Degree is required' }}
                    options={[
                      { value: 'Secondary School (10th)', label: 'Secondary School (10th)' },
                      { value: 'Higher Secondary (12th)', label: 'Higher Secondary (12th)' },
                      { value: 'High School Diploma', label: 'High School Diploma' },
                      { value: 'GED', label: 'GED' },
                      { value: 'ITI', label: 'ITI' },
                      { value: 'Polytechnic Diploma', label: 'Polytechnic Diploma' },
                      { value: 'Vocational Training', label: 'Vocational Training' },
                      { value: 'Certificate Course', label: 'Certificate Course' },
                      { value: 'Diploma', label: 'Diploma' },
                      { value: 'Advanced Diploma', label: 'Advanced Diploma' },
                      { value: 'Post Graduate Diploma', label: 'Post Graduate Diploma' },
                      { value: 'Associate of Arts (AA)', label: 'Associate of Arts (AA)' },
                      { value: 'Associate of Science (AS)', label: 'Associate of Science (AS)' },
                      { value: 'Associate of Applied Science (AAS)', label: 'Associate of Applied Science (AAS)' },
                      { value: 'Bachelor of Arts (BA)', label: 'Bachelor of Arts (BA)' },
                      { value: 'Bachelor of Science (BSc/BS)', label: 'Bachelor of Science (BSc/BS)' },
                      { value: 'Bachelor of Commerce (BCom)', label: 'Bachelor of Commerce (BCom)' },
                      { value: 'Bachelor of Business Administration (BBA)', label: 'Bachelor of Business Administration (BBA)' },
                      { value: 'Bachelor of Computer Applications (BCA)', label: 'Bachelor of Computer Applications (BCA)' },
                      { value: 'Bachelor of Technology (BTech)', label: 'Bachelor of Technology (BTech)' },
                      { value: 'Bachelor of Engineering (BE)', label: 'Bachelor of Engineering (BE)' },
                      { value: 'Bachelor of Architecture (BArch)', label: 'Bachelor of Architecture (BArch)' },
                      { value: 'Bachelor of Design (BDes)', label: 'Bachelor of Design (BDes)' },
                      { value: 'Bachelor of Fine Arts (BFA)', label: 'Bachelor of Fine Arts (BFA)' },
                      { value: 'Bachelor of Education (BEd)', label: 'Bachelor of Education (BEd)' },
                      { value: 'Bachelor of Laws (LLB)', label: 'Bachelor of Laws (LLB)' },
                      { value: 'Bachelor of Pharmacy (BPharm)', label: 'Bachelor of Pharmacy (BPharm)' },
                      { value: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)', label: 'MBBS' },
                      { value: 'Bachelor of Dental Surgery (BDS)', label: 'BDS' },
                      { value: 'Bachelor of Hotel Management (BHM)', label: 'Bachelor of Hotel Management (BHM)' },
                      { value: 'Bachelor of Journalism and Mass Communication (BJMC)', label: 'BJMC' },
                      { value: 'Master of Arts (MA)', label: 'Master of Arts (MA)' },
                      { value: 'Master of Science (MSc/MS)', label: 'Master of Science (MSc/MS)' },
                      { value: 'Master of Commerce (MCom)', label: 'Master of Commerce (MCom)' },
                      { value: 'Master of Business Administration (MBA)', label: 'Master of Business Administration (MBA)' },
                      { value: 'Master of Computer Applications (MCA)', label: 'Master of Computer Applications (MCA)' },
                      { value: 'Master of Technology (MTech)', label: 'Master of Technology (MTech)' },
                      { value: 'Master of Engineering (ME)', label: 'Master of Engineering (ME)' },
                      { value: 'Master of Education (MEd)', label: 'Master of Education (MEd)' },
                      { value: 'Master of Laws (LLM)', label: 'Master of Laws (LLM)' },
                      { value: 'Master of Pharmacy (MPharm)', label: 'Master of Pharmacy (MPharm)' },
                      { value: 'Master of Architecture (MArch)', label: 'Master of Architecture (MArch)' },
                      { value: 'Master of Design (MDes)', label: 'Master of Design (MDes)' },
                      { value: 'Doctor of Philosophy (PhD)', label: 'Doctor of Philosophy (PhD)' },
                      { value: 'Doctor of Medicine (MD)', label: 'Doctor of Medicine (MD)' },
                      { value: 'Doctor of Education (EdD)', label: 'Doctor of Education (EdD)' },
                      { value: 'Doctor of Dental Surgery (DDS)', label: 'Doctor of Dental Surgery (DDS)' },
                      { value: 'Doctor of Pharmacy (PharmD)', label: 'Doctor of Pharmacy (PharmD)' },
                      { value: 'CA (Chartered Accountant)', label: 'CA (Chartered Accountant)' },
                      { value: 'CS (Company Secretary)', label: 'CS (Company Secretary)' },
                      { value: 'CMA (Cost & Management Accountant)', label: 'CMA (Cost & Management Accountant)' },
                      { value: 'CPA (Certified Public Accountant)', label: 'CPA (Certified Public Accountant)' },
                      { value: 'CFA (Chartered Financial Analyst)', label: 'CFA (Chartered Financial Analyst)' },
                      { value: 'Other', label: 'Other' },
                    ]}
                    search={true}
                    placeholder="E.g., Bachelor of Technology"
                    className={`form-control ${errors.degree ? 'is-invalid' : ''}`}
                  />
                </div>
                {errors.degree && <p className="input-error">{errors.degree.message}</p>}
              </div>


              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="field_study">Field of Study</label>
                  <input type="text"  {...register("field_study")} className={`form-control ${errors.field_study ? 'is-invalid' : ''}`} id="field_study" placeholder="E.g., Computer Science" />
                </div>
                {errors.field_study && <p className="input-error">{errors.field_study.message}</p>}
              </div>

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="institute_name">University/Institution Name</label>
                  <input type="text"  {...register("institute_name", { required: "University/Institution name is required" })} className={`form-control ${errors.institute_name ? 'is-invalid' : ''}`} id="institute_name" placeholder="E.g., Delhi University" />
                </div>
                {errors.institute_name && <p className="input-error">{errors.institute_name.message}</p>}
              </div>

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="location">Location</label>
                  <input type="text"  {...register("location", { required: "Location is required" })} className={`form-control ${errors.location ? 'is-invalid' : ''}`} id="location" placeholder="E.g., Delhi, India" />
                </div>
                {errors.location && <p className="input-error">{errors.location.message}</p>}
              </div>


              <div className="col-12 col-lg-12 col-xl-12 col-xxl-6 mb-4">
                <div className="each-input-div">
                  <label htmlFor="date">Graduation Date</label>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="each-input-div">
                        <CustomInput
                          type="select"
                          register={register}
                          registerName="date"
                          registerOptions={{ required: !stillEnrolled ? 'Month is required' : false }}
                          options={[
                            { value: 'January', label: 'January' },
                            { value: 'February', label: 'February' },
                            { value: 'March', label: 'March' },
                            { value: 'April', label: 'April' },
                            { value: 'May', label: 'May' },
                            { value: 'June', label: 'June' },
                            { value: 'July', label: 'July' },
                            { value: 'August', label: 'August' },
                            { value: 'September', label: 'September' },
                            { value: 'October', label: 'October' },
                            { value: 'November', label: 'November' },
                            { value: 'December', label: 'December' },
                          ]}
                          onChange={() => setStillEnrolled(false)}
                          placeholder="Month"
                            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                            disabled={stillEnrolled}
                        />
                    </div>

                    {errors.date && <p className="input-error">{errors.date.message}</p>}
                  </div>
                  <div className="col-6">
                    <div className="each-input-div">
                      <CustomInput
                        type="select"
                        register={register}
                        registerName="year"
                        registerOptions={{ required: !stillEnrolled ? 'Month is required' : false }}
                        options={Array.from({ length: 50 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return { value: year, label: String(year) };
                        })}
                        search={true}
                        onChange={() => setStillEnrolled(false)}
                        placeholder="Year"
                        className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                        disabled={stillEnrolled}
                      />
                    </div>

                    {errors.year && <p className="input-error">{errors.year.message}</p>}
                  </div>
                </div>
                <label className='checked-label mt-3'>
                  <input
                    type="checkbox"
                    checked={stillEnrolled}
                    onChange={handleStillEnrolledChange}

                    hidden
                  />
                  <label className='checkbox-label'></label>
                  I'm still enrolled
                </label>

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
              <img src="/front-assets/images/icons/add-more.svg" alt="Add More" /> Add More Experience
            </button>
          </div >

        </form>

        <div className='next-prev-btn-div d-none d-lg-flex'>
          <button type='button' onClick={() => router.back()} className='prev-btn'>Prev</button>
          <button type='button' onClick={nextButton} className='next-btn'>Next</button>
        </div>

        <div className='mob-form-bottom-nav custom-container d-lg-none'>
          <MobProgressArea />
          <div className='form-button-div'>
            <button type='button' onClick={() => router.back()} className='prev-btn'>Prev</button>
            <button type='button' onClick={nextButton} className='next-btn'>Next</button>
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
