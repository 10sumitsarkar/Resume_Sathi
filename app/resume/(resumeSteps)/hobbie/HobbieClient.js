'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeHobbies, deleteHobbieFromResume, reorderHobbies, markResumeSubmitted, markResumeStepSkipped } from '../../reducer/resume-reducer';
import MobProgressArea from '../../components/MobProgressArea';

export default function Hobbie() {

  const searchParams = useSearchParams();
const id = searchParams.get('id');
  const router = useRouter();
  const formRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [formOpened, setFormOpened] = useState('');
  const [editStatus, setEditStatus] = useState(false);
  const [hobbieIndex, setHobbieIndex] = useState(1);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const hobbies = useSelector(
    (state) => state.resume.resumes.find((resume) => resume.id === id)?.hobbies || []
  );
  const [hobbieFormData, setHobbieFormData] = useState(hobbies);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: hobbieFormData
  });
  const watchedHobbie = watch('hobbies');
  const hasHobbieData = hobbies.length >= 1 || Boolean(watchedHobbie?.trim());



  useEffect(() => {
    if (hobbies.length < 1) {
      setFormOpened(true);
    } else {
      setFormOpened(false);
    }
  }, []);



  const AddMoreHobbie = () => {
    const newIndex = `${Date.now()}`;
    setHobbieIndex(newIndex);
    const newhobbieId = `edu_${newIndex}_${id}`;
    reset({
      hobbie_id: newhobbieId,
      hobbies: '',
    });
    setFormOpened(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    document.getElementById('saveDetails').innerText = 'Save';
  };

  const onSubmit = (data) => {
    dispatch(setResumeHobbies({ id, data: data }));
    setFormOpened(false);
    reset();

    if (editStatus) {
      toast.success('Hobbies updated successfully.', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'light',
      });
    } else {
      toast.success('Hobbies saved successfully.', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'light',
      });
    }

    setEditStatus(false);
  };

  const editHobbie = (hobbieId) => {
    const hobbieToEdit = hobbies.find(hobbie => hobbie.hobbie_id === hobbieId);
    if (hobbieToEdit) {
      setEditStatus(true);
      document.getElementById('saveDetails').innerText = 'Update';
      setFormOpened(true);
      setHobbieFormData(hobbieToEdit);
      reset(hobbieToEdit);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const confirmDelete = (hobbieId) => {
    setDeleteId(hobbieId);
    const modalElement = document.getElementById('deleteConfirmationModal');
    if (modalElement && window.bootstrap) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    }
  };

  const executeDelete = () => {
    if (deleteId) {
      dispatch(deleteHobbieFromResume({ id, hobbieId: deleteId }));
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
      dispatch(reorderHobbies({ id, startIndex: draggedIndex, endIndex: index }));
    }
    setDraggedIndex(null);
  };

  const submitResume = () => {
    const currentHobbie = getValues();
    const hobbieText = currentHobbie?.hobbies?.trim();

    if (formOpened && hobbieText) {
      dispatch(setResumeHobbies({
        id,
        data: {
          ...currentHobbie,
          hobbie_id: currentHobbie.hobbie_id || `edu_${Date.now()}_${id}`,
          hobbies: hobbieText,
        },
      }));
    } else if (hobbies.length < 1) {
      dispatch(markResumeStepSkipped({ id, step: 'hobbie' }));
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const modalElement = document.getElementById('completedModal');
      if (modalElement && window.bootstrap) {
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 2500);
  };

  const handleCloseAndNavigate = () => {
    const modalEl = document.querySelector('.modal.show');
    if (modalEl && window.bootstrap) {
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }

    dispatch(markResumeSubmitted(id));
    router.push(`/resume/preview?id=${id}`);
  };

  return (
    <>
      <div className='resume-form-div py-custom'>
        <div className='form-heading'>
          <h1>Hobbies</h1>
          <p>Let's talk about the activities you enjoy in your free time</p>
        </div>

        <div className='mt-5 mb-4'>
          {hobbies.map((hobbie, index) => (
            <div 
              className='saved-details-div mb-3' 
              key={hobbie.hobbie_id || index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              style={{ cursor: "grab" }}
            >
              <div className='content-div'>
                <p className='title'>
                  {hobbie.hobbies}
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
                <button type='button' className='edit-btn' onClick={() => editHobbie(hobbie.hobbie_id)}>
                  <img src="/front-assets/images/icons/edit.svg" width={28} height={28} alt="Edit" />
                </button>
                <button type='button' className='delete-btn' onClick={() => confirmDelete(hobbie.hobbie_id)}>
                  <img src="/front-assets/images/icons/delete.svg" width={28} height={28} alt="Delete" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
          <div className="container-fluid px-0  pb-5 pb-md-0 my-5 mb-md-0">

            <div className={`row ${formOpened === true ? '' : 'd-none'}`}>

              <input type="text"  {...register("hobbie_id", { required: "ID is required" })} id="hobbie_id" defaultValue={hobbieFormData.hobbie_id || `edu_${Number(hobbieIndex)}_${id}`} hidden />


              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="hobbies">Hobbie<span className='text-danger'>*</span></label>
                  <input type="link"  {...register("hobbies", { required: "Hobbie is required" })} className={` ${errors.hobbies ? 'is-invalid' : ''}`} id="hobbies" placeholder="E.g., Painting, Football" />
                </div>
                {errors.hobbies && <p className="input-error">{errors.hobbies.message}</p>}
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


            <button type='button' className={`add-more-btn ${formOpened === true ? 'd-none' : ''}`} onClick={AddMoreHobbie}>
              <img src="/front-assets/images/icons/add-more.svg" alt="Add More" /> Add More Hobbie
            </button>
          </div >

        </form>

        <div className='next-prev-btn-div d-none d-lg-flex'>
          <button type='button' onClick={() => router.back()} className='prev-btn'>Prev</button>
          <button type='button' onClick={submitResume} className='next-btn'>{hasHobbieData ? 'Submit' : 'Skip & Submit'}</button>
        </div>

        <div className="mob-form-bottom-nav custom-container d-lg-none">
          <MobProgressArea />
          <div className='form-button-div'>
            <button type='button' onClick={() => router.back()} className='prev-btn'>Prev</button>
            <button type='button' onClick={submitResume} className='next-btn'>{hasHobbieData ? 'Submit' : 'Skip & Submit'}</button>
          </div>
        </div>
      </div >

      {/* All steps completed modal start */}

      <div className="modal fade completedModal" id="completedModal" tabIndex="-1" aria-labelledby="completedModalLabel" data-bs-backdrop="static" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body py-4">
              <img src="/front-assets/images/icons/completed-image.svg" width={175} height={175} className='img-fluid mx-auto d-block' alt="Completed" />
              <h5 className='heading'>Your Resume is Ready!</h5>
              <p className='sub-heading'>Your resume is looking good. We're just one step away from finalizing it!</p>
              <div className='btn-div'>
                <button className='cancel-btn' data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                <button onClick={handleCloseAndNavigate} className='got-it-btn' aria-label="Close">Got It</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* All steps completed modal end */}

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
