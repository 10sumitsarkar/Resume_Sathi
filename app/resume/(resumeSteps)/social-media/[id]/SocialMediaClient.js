'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeSocialMedias, deleteSocialMediaFromResume, reorderSocialMedias, markResumeStepSkipped } from '../../../reducer/resume-reducer';
import MobProgressArea from '../../../components/MobProgressArea';
import CustomInput from '../../../../components/CustomInput/CustomInput';

export default function SocialMedia() {

  const { id } = useParams();
  const router = useRouter();
  const formRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [formOpened, setFormOpened] = useState('');
  const [editStatus, setEditStatus] = useState(false);
  const [socialMediaIndex, setSocialMediaIndex] = useState(1);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const socialMedias = useSelector(
    (state) => state.resume.resumes.find((resume) => resume.id === id)?.social_medias || []
  );
  const [socialMediaFormData, setSocialMediaFormData] = useState(socialMedias);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: socialMediaFormData
  });



  useEffect(() => {
    if (socialMedias.length < 1) {
      setFormOpened(true);
    } else {
      setFormOpened(false);
    }
  }, []);



  const AddMoreSocialMedia = () => {
    const newIndex = `${Date.now()}`;
    setSocialMediaIndex(newIndex);
    const newsocialMediaId = `edu_${newIndex}_${id}`;
    reset({
      socialMedia_id: newsocialMediaId,
      social_name: '',
      social_url: '',
    });
    setFormOpened(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    document.getElementById('saveDetails').innerText = 'Save';
  };

  const onSubmit = (data) => {
    dispatch(setResumeSocialMedias({ id, data: data }));
    setFormOpened(false);
    reset();

    if (editStatus) {
      toast.success('Cocial Media details updated successfully.', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'light',
      });
    } else {
      toast.success('Cocial Media saved successfully.', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'light',
      });
    }

    setEditStatus(false);
  };

  const editSocialMedia = (socialMediaId) => {
    const socialMediaToEdit = socialMedias.find(social => social.socialMedia_id === socialMediaId);
    if (socialMediaToEdit) {
      setEditStatus(true);
      document.getElementById('saveDetails').innerText = 'Update';
      setFormOpened(true);
      setSocialMediaFormData(socialMediaToEdit);
      reset(socialMediaToEdit);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const confirmDelete = (socialMediaId) => {
    setDeleteId(socialMediaId);
    const modalElement = document.getElementById('deleteConfirmationModal');
    if (modalElement && window.bootstrap) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    }
  };

  const executeDelete = () => {
    if (deleteId) {
      dispatch(deleteSocialMediaFromResume({ id, socialMediaId: deleteId }));
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
      dispatch(reorderSocialMedias({ id, startIndex: draggedIndex, endIndex: index }));
    }
    setDraggedIndex(null);
  };

  const nextButton = () => {
    if (socialMedias.length < 1) {
      dispatch(markResumeStepSkipped({ id, step: 'social_media' }));
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(`/resume/internship/${id}`);
    }, 2500);
  };

  return (
    <>
      <div className='resume-form-div py-custom'>
        <div className='form-heading'>
          <h1>Social Media</h1>
          <p>Let's add your social media profiles to enhance your resume.</p>
        </div>

        <div className='mt-5 mb-4'>
          {socialMedias.map((socialMedia, index) => (
            <div 
              className='saved-details-div mb-3' 
              key={socialMedia.socialMedia_id || index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              style={{ cursor: "grab" }}
            >
              <div className='content-div'>
                <p className='title'>
                  {socialMedia.social_name}
                </p>
                <p className='all-details'>
                  {socialMedia.social_url ?
                    <span>
                      <img src="/front-assets/images/icons/link.svg" width={18} height={18} alt="Organization" /> {socialMedia.social_url}
                    </span>
                    : ''
                  }
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
                <button type='button' className='edit-btn' onClick={() => editSocialMedia(socialMedia.socialMedia_id)}>
                  <img src="/front-assets/images/icons/edit.svg" width={28} height={28} alt="Edit" />
                </button>
                <button type='button' className='delete-btn' onClick={() => confirmDelete(socialMedia.socialMedia_id)}>
                  <img src="/front-assets/images/icons/delete.svg" width={28} height={28} alt="Delete" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
          <div className="container-fluid px-0  pb-5 pb-md-0 my-5 mb-md-0">

            <div className={`row ${formOpened === true ? '' : 'd-none'}`}>

              <input type="text"  {...register("socialMedia_id", { required: "ID is required" })} id="socialMedia_id" defaultValue={socialMediaFormData.socialMedia_id || `edu_${Number(socialMediaIndex)}_${id}`} hidden />

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className="each-input-div">
                  <label htmlFor="social_name">Social Name</label>
                  <CustomInput
                    type="select"
                    register={register}
                    registerName="social_name"
                    registerOptions={{ required: 'Social name is required' }}
                    options={[
                      { value: 'LinkedIn', label: 'LinkedIn' },
                      { value: 'GitHub', label: 'GitHub' },
                      { value: 'Stack Overflow', label: 'Stack Overflow' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'Twitter', label: 'Twitter' },
                      { value: 'Facebook', label: 'Facebook' },
                      { value: 'Instagram', label: 'Instagram' },
                      { value: 'YouTube', label: 'YouTube' },
                      { value: 'Dribbble', label: 'Dribbble' },
                      { value: 'Behance', label: 'Behance' },
                      { value: 'Other', label: 'Other' },
                    ]}
                    placeholder="Select Social Platform"
                    className={` ${errors.social_name ? 'is-invalid' : ''}`}
                  />
                </div>
                {errors.social_name && <p className="input-error">{errors.social_name.message}</p>}
              </div>


              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="social_url">Social URL</label>
                  <input type="link"  {...register("social_url", { required: "Social URL is required", pattern: { value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/\S*)?$/, message: 'Please enter a valid URL', } })} className={` ${errors.social_url ? 'is-invalid' : ''}`} id="social_url" placeholder="E.g., https://social_url.com/in/username" />
                </div>
                {errors.social_url && <p className="input-error">{errors.social_url.message}</p>}
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


            <button type='button' className={`add-more-btn ${formOpened === true ? 'd-none' : ''}`} onClick={AddMoreSocialMedia}>
              <img src="/front-assets/images/icons/add-more.svg" alt="Add More" /> Add More Social Links
            </button>
          </div >

        </form>

        <div className='next-prev-btn-div d-none d-lg-flex'>
          <button type='button' onClick={() => router.back()} className='prev-btn'>Prev</button>
          <button type='button' onClick={nextButton} className='next-btn'>{socialMedias.length >= 1 ? 'Next' : 'Skip & Next'}</button>
        </div>

        <div className="mob-form-bottom-nav custom-container d-lg-none">
          <MobProgressArea />
          <div className='form-button-div'>
            <button type='button' onClick={() => router.back()} className='prev-btn'>Prev</button>
            <button type='button' onClick={nextButton} className='next-btn'>{socialMedias.length >= 1 ? 'Next' : 'Skip & Next'}</button>
          </div>
        </div>
      </div >

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

      {
        loading && (
          <div className='loader-div'>
            <div className='loader-inner-div'>
              <div className="box" id="loader1"></div>
              <div className="box" id="loader2"></div>
              <div className="box" id="loader3"></div>
              <div className="box" id="loader4"></div>
              <div className="box" id="loader5"></div>
            </div>
          </div>
        )
      }
      <ToastContainer />
    </>
  );
}
