'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeEducations, deleteEducationFromResume, reorderEducations } from '../../../reducer/resume-reducer';
import MobProgressArea from '../../../components/MobProgressArea';

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
                  <select
                    id="degree"
                    {...register("degree", { required: "Degree is required" })}
                    className={`form-control ${errors.degree ? 'is-invalid' : ''}`}
                    defaultValue=""
                  >
                    <option value="" disabled className="d-none">E.g., Bachelor of Technology</option>
                    {/* School Education */}
                    <option value="Secondary School (10th)">Secondary School (10th)</option>
                    <option value="Higher Secondary (12th)">Higher Secondary (12th)</option>
                    <option value="High School Diploma">High School Diploma</option>
                    <option value="GED">GED</option>

                    {/* Vocational & Technical */}
                    <option value="ITI">ITI</option>
                    <option value="Polytechnic Diploma">Polytechnic Diploma</option>
                    <option value="Vocational Training">Vocational Training</option>
                    <option value="Certificate Course">Certificate Course</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Advanced Diploma">Advanced Diploma</option>
                    <option value="Post Graduate Diploma">Post Graduate Diploma</option>

                    {/* Associate Degrees */}
                    <option value="Associate of Arts (AA)">Associate of Arts (AA)</option>
                    <option value="Associate of Science (AS)">Associate of Science (AS)</option>
                    <option value="Associate of Applied Science (AAS)">Associate of Applied Science (AAS)</option>

                    {/* Bachelor's Degrees */}
                    <option value="Bachelor of Arts (BA)">Bachelor of Arts (BA)</option>
                    <option value="Bachelor of Science (BSc/BS)">Bachelor of Science (BSc/BS)</option>
                    <option value="Bachelor of Commerce (BCom)">Bachelor of Commerce (BCom)</option>
                    <option value="Bachelor of Business Administration (BBA)">Bachelor of Business Administration (BBA)</option>
                    <option value="Bachelor of Computer Applications (BCA)">Bachelor of Computer Applications (BCA)</option>
                    <option value="Bachelor of Technology (BTech)">Bachelor of Technology (BTech)</option>
                    <option value="Bachelor of Engineering (BE)">Bachelor of Engineering (BE)</option>
                    <option value="Bachelor of Architecture (BArch)">Bachelor of Architecture (BArch)</option>
                    <option value="Bachelor of Design (BDes)">Bachelor of Design (BDes)</option>
                    <option value="Bachelor of Fine Arts (BFA)">Bachelor of Fine Arts (BFA)</option>
                    <option value="Bachelor of Education (BEd)">Bachelor of Education (BEd)</option>
                    <option value="Bachelor of Laws (LLB)">Bachelor of Laws (LLB)</option>
                    <option value="Bachelor of Pharmacy (BPharm)">Bachelor of Pharmacy (BPharm)</option>
                    <option value="Bachelor of Medicine and Bachelor of Surgery (MBBS)">MBBS</option>
                    <option value="Bachelor of Dental Surgery (BDS)">BDS</option>
                    <option value="Bachelor of Hotel Management (BHM)">Bachelor of Hotel Management (BHM)</option>
                    <option value="Bachelor of Journalism and Mass Communication (BJMC)">BJMC</option>

                    {/* Master's Degrees */}
                    <option value="Master of Arts (MA)">Master of Arts (MA)</option>
                    <option value="Master of Science (MSc/MS)">Master of Science (MSc/MS)</option>
                    <option value="Master of Commerce (MCom)">Master of Commerce (MCom)</option>
                    <option value="Master of Business Administration (MBA)">Master of Business Administration (MBA)</option>
                    <option value="Master of Computer Applications (MCA)">Master of Computer Applications (MCA)</option>
                    <option value="Master of Technology (MTech)">Master of Technology (MTech)</option>
                    <option value="Master of Engineering (ME)">Master of Engineering (ME)</option>
                    <option value="Master of Education (MEd)">Master of Education (MEd)</option>
                    <option value="Master of Laws (LLM)">Master of Laws (LLM)</option>
                    <option value="Master of Pharmacy (MPharm)">Master of Pharmacy (MPharm)</option>
                    <option value="Master of Architecture (MArch)">Master of Architecture (MArch)</option>
                    <option value="Master of Design (MDes)">Master of Design (MDes)</option>

                    {/* Doctoral Degrees */}
                    <option value="Doctor of Philosophy (PhD)">Doctor of Philosophy (PhD)</option>
                    <option value="Doctor of Medicine (MD)">Doctor of Medicine (MD)</option>
                    <option value="Doctor of Education (EdD)">Doctor of Education (EdD)</option>
                    <option value="Doctor of Dental Surgery (DDS)">Doctor of Dental Surgery (DDS)</option>
                    <option value="Doctor of Pharmacy (PharmD)">Doctor of Pharmacy (PharmD)</option>

                    {/* Professional Qualifications */}
                    <option value="CA (Chartered Accountant)">CA (Chartered Accountant)</option>
                    <option value="CS (Company Secretary)">CS (Company Secretary)</option>
                    <option value="CMA (Cost & Management Accountant)">CMA (Cost & Management Accountant)</option>
                    <option value="CPA (Certified Public Accountant)">CPA (Certified Public Accountant)</option>
                    <option value="CFA (Chartered Financial Analyst)">CFA (Chartered Financial Analyst)</option>

                    <option value="Other">Other</option>
                  </select>
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
                      <select
                        id="date"
                        {...register("date", {
                          required: !stillEnrolled ? 'Month is required' : false
                        })}
                        className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                        onChangeCapture={() => setStillEnrolled(false)}
                        defaultValue=""
                      >
                        <option value="" disabled>Month</option>
                        {[
                          "January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"
                        ].map((month) => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </div>

                    {errors.date && <p className="input-error">{errors.date.message}</p>}
                  </div>
                  <div className="col-6">
                    <div className="each-input-div">
                      <select
                        id="year"
                        {...register("year", {
                          required: !stillEnrolled ? 'Month is required' : false
                        })}
                        className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                        onChangeCapture={() => setStillEnrolled(false)}
                        defaultValue=""
                      >
                        <option value="" disabled>Year</option>
                        {Array.from({ length: 50 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return <option key={year} value={year}>{year}</option>;
                        })}
                      </select>
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
