'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeCertifications, deleteCertificateFromResume, reorderCertificates, markResumeStepSkipped } from '../../../reducer/resume-reducer';
import MobProgressArea from '../../../components/MobProgressArea';
import CustomInput from '../../../../components/CustomInput/CustomInput';

export default function Certifications() {
  const { id } = useParams();
  const router = useRouter();
  const formRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [formOpened, setFormOpened] = useState('');
  const [editStatus, setEditStatus] = useState(false);
  const [certificateIndex, setCertificateIndex] = useState(1);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const certificates = useSelector(
    (state) => state.resume.resumes.find((resume) => resume.id === id)?.certificates || []
  );
  const [certificateFormData, setCertificateFormData] = useState(certificates);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: certificateFormData
  });



  useEffect(() => {
    if (certificates.length < 1) {
      setFormOpened(true);
    } else {
      setFormOpened(false);
    }
  }, []);



  const AddMoreCertificate = () => {
    const newIndex = `${Date.now()}`;
    setCertificateIndex(newIndex);
    const newCertificateId = `edu_${newIndex}_${id}`;
    reset({
      certificate_id: newCertificateId,
      certificate_name: '',
      issuing_organization: '',
      issue_date: '',
      description: '',
    });
    setFormOpened(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    document.getElementById('saveDetails').innerText = 'Save';
  };

  const onSubmit = (data) => {
    dispatch(setResumeCertifications({ id, data: data }));
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

  const editCertificate = (certificateId) => {
    const certificateToEdit = certificates.find(edu => edu.certificate_id === certificateId);
    if (certificateToEdit) {
      setEditStatus(true);
      document.getElementById('saveDetails').innerText = 'Update';
      setFormOpened(true);
      setCertificateFormData(certificateToEdit);
      reset(certificateToEdit);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const confirmDelete = (certificateId) => {
    setDeleteId(certificateId);
    const modalElement = document.getElementById('deleteConfirmationModal');
    if (modalElement && window.bootstrap) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    }
  };

  const executeDelete = () => {
    if (deleteId) {
      dispatch(deleteCertificateFromResume({ id, certificateId: deleteId }));
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
      dispatch(reorderCertificates({ id, startIndex: draggedIndex, endIndex: index }));
    }
    setDraggedIndex(null);
  };

  const nextButton = () => {
    if (certificates.length < 1) {
      dispatch(markResumeStepSkipped({ id, step: 'certificate' }));
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(`/resume/skill/${id}`);
    }, 2500);
  };


  return (
    <>
      <div className='resume-form-div py-custom'>
        <div className='form-heading'>
          <h1>Certifications</h1>
          <p>Let's add your professional certifications to showcase your expertise.</p>
        </div>

        <div className='mt-5 mb-4'>
          {certificates.map((certificate, index) => (
            <div 
              className='saved-details-div mb-3' 
              key={certificate.certificate_id || index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              style={{ cursor: "grab" }}
            >
              <div className='content-div'>
                <p className='title'>{certificate.certificate_name}</p>
                <p className='all-details'>
                  {certificate.issuing_organization && (
                    <span>
                      <img src="/front-assets/images/icons/education-icon.svg" width={18} height={18} alt="Organization" /> {certificate.issuing_organization}
                    </span>
                  )}
                  {certificate.issue_date && (
                    <>
                      | <span><img src="/front-assets/images/icons/date.svg" width={18} height={18} alt="Date" /> {certificate.issue_date}</span>
                    </>
                  )}
                </p>
              </div>

              <div className='button-div'>
                <div 
                  className="drag-handle" 
                  title="Drag to reorder">
                 
<svg width="16" height="6" viewBox="0 0 16 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 0H1C0.45 0 0 0.45 0 1C0 1.55 0.45 2 1 2H15C15.55 2 16 1.55 16 1C16 0.45 15.55 0 15 0ZM1 6H15C15.55 6 16 5.55 16 5C16 4.45 15.55 4 15 4H1C0.45 4 0 4.45 0 5C0 5.55 0.45 6 1 6Z" fill="black"/>
</svg>

                </div>
                <button type='button' className='edit-btn' onClick={() => editCertificate(certificate.certificate_id)}>
                  <img src="/front-assets/images/icons/edit.svg" width={28} height={28} alt="Edit" />
                </button>
                <button type='button' className='delete-btn' onClick={() => confirmDelete(certificate.certificate_id)}>
                  <img src="/front-assets/images/icons/delete.svg" width={28} height={28} alt="Delete" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Certification Form */}
        <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
          <div className="container-fluid px-0 pb-5 pb-md-0 my-5 mb-md-0">
            <div className={`row ${formOpened === true ? '' : 'd-none'}`}>
              <input type="text" hidden {...register("certificate_id", { required: "ID is required" })} defaultValue={certificateFormData.certificate_id || `edu_${Number(certificateIndex)}_${id}`} />

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="certificate_name">Certification Name</label>
                  <input type="text" {...register("certificate_name", { required: "Field of Study is required" })} className={`form-control ${errors.certificate_name ? 'is-invalid' : ''}`} id="certificate_name" placeholder="E.g., Google UX Design Certificate" />
                  {errors.certificate_name && <p className="input-error">{errors.certificate_name.message}</p>}
                </div>
              </div>

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="issuing_organization">Issuing Organization</label>
                  <input type="text" {...register("issuing_organization", { required: "Issuing Organization is required" })} className={`form-control ${errors.issuing_organization ? 'is-invalid' : ''}`} id="issuing_organization" placeholder="E.g., Delhi University" />
                  {errors.issuing_organization && <p className="input-error">{errors.issuing_organization.message}</p>}
                </div>
              </div>

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="issue_date">Issue Date</label>
                  <CustomInput
                    type="date"
                    register={register}
                    registerName="issue_date"
                    registerOptions={{ required: 'Issue date is required' }}
                    className={`form-control ${errors.issue_date ? 'is-invalid' : ''}`}
                    placeholder="Select date"
                  />
                  {errors.issue_date && <p className="input-error">{errors.issue_date.message}</p>}
                </div>
              </div>

              <div className="col-12 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="description">Description (Optional)</label>
                  <textarea rows={8} {...register("description")} className={`form-control`} id="description" placeholder="Add details about the certification, skills learned, topics covered, or achievements earned..."></textarea>
                  <button type='button' className='refine-al-btn'>
                    <img src="/front-assets/images/icons/refine-ai.svg" alt="Refine AI" /> Refine with AI
                  </button>
                </div>
              </div>
            </div>

            <div className={`cancel-save-btn-div ${formOpened === true ? '' : 'd-none'}`}>
              <button type='button' className='cancel-btn' onClick={() => setFormOpened(false)}>
                <img src="/front-assets/images/icons/cancel.svg" alt="Cancel" /> Cancel
              </button>
              <button type='submit' className='save-btn'>
                <img src="/front-assets/images/icons/save.svg" alt="Save" />
                <span id='saveDetails'>Save</span>
              </button>
            </div>

            <button type='button' className={`add-more-btn ${formOpened === true ? 'd-none' : ''}`} onClick={AddMoreCertificate}>
              <img src="/front-assets/images/icons/add-more.svg" alt="Add More" /> Add More Experience
            </button>
          </div>
        </form>

        {/* Navigation Buttons */}
        <div className='next-prev-btn-div d-none d-lg-flex'>
          <button type='button' onClick={() => router.back()} className='prev-btn'>Prev</button>
          <button type='button' onClick={nextButton} className='next-btn'>{certificates.length >= 1 ? 'Next' : 'Skip & Next'}</button>
        </div>

        <div className="mob-form-bottom-nav custom-container d-lg-none">
          <MobProgressArea />
          <div className='form-button-div'>
            <button type='button' onClick={() => router.back()} className='prev-btn'>Prev</button>
            <button type='button' onClick={nextButton} className='next-btn'>{certificates.length >= 1 ? 'Next' : 'Skip & Next'}</button>
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

      {/* Loader */}
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
