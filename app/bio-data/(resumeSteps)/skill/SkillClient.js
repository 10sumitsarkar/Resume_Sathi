'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeSkills, deleteSkillFromResume, reorderSkills, markResumeStepSkipped } from '../../reducer/resume-reducer';
import MobProgressArea from '../../components/MobProgressArea';
import CustomInput from '../../../components/CustomInput/CustomInput';

export default function Skills() {

  const searchParams = useSearchParams();
const id = searchParams.get('id');
   const router = useRouter();
   const formRef = useRef(null);
 
   const [loading, setLoading] = useState(false);
   const [formOpened, setFormOpened] = useState('');
   const [editStatus, setEditStatus] = useState(false);
   const [skillIndex, setSkillIndex] = useState(1);
   const [draggedIndex, setDraggedIndex] = useState(null);
   const [deleteId, setDeleteId] = useState(null);
 
   const skills = useSelector(
     (state) => state.resume.resumes.find((resume) => resume.id === id)?.skills || []
   );
   const personalInfomation = useSelector(
     (state) => state.resume.resumes.find((resume) => resume.id === id)?.personal_infomation || {}
   );
   const isExperienced = personalInfomation.experience === 'Experienced';
   const [skillFormData, setSkillFormData] = useState(skills);
 
   const dispatch = useDispatch();
 
   const {
     register,
     handleSubmit,
     watch,
     reset,
     formState: { errors },
   } = useForm({
     mode: 'onChange',
     defaultValues: skillFormData
   });
 
 
 
   useEffect(() => {
     if (skills.length < 1) {
       setFormOpened(true);
     } else {
       setFormOpened(false);
     }
   }, []);
 
 
 
   const AddMoreSkill = () => {
     const newIndex = `${Date.now()}`;
     setSkillIndex(newIndex);
     const newskillId = `edu_${newIndex}_${id}`;
     reset({
    skill_id: newskillId,
       skill_name: '',
       proficiency_level: '',
     });
     setFormOpened(true);
     setTimeout(() => {
       formRef.current?.scrollIntoView({ behavior: 'smooth' });
     }, 100);
     document.getElementById('saveDetails').innerText = 'Save';
   };
 
   const onSubmit = (data) => {
     dispatch(setResumeSkills({ id, data: data }));
     setFormOpened(false);
     reset();
 
     if (editStatus) {
       toast.success('Skill details updated successfully.', {
         position: 'top-right',
         autoClose: 5000,
         theme: 'light',
       });
     } else {
       toast.success('Skill saved successfully.', {
         position: 'top-right',
         autoClose: 5000,
         theme: 'light',
       });
     }
 
     setEditStatus(false);
   };
 
   const editSkill= (skillId) => {
     const skillToEdit = skills.find(edu => edu.skill_id === skillId);
     if (skillToEdit) {
       setEditStatus(true);
       document.getElementById('saveDetails').innerText = 'Update';
       setFormOpened(true);
       setSkillFormData(skillToEdit);
       reset(skillToEdit);
       setTimeout(() => {
         formRef.current?.scrollIntoView({ behavior: 'smooth' });
       }, 100);
     }
   };
 
   const confirmDelete = (skillId) => {
     setDeleteId(skillId);
     const modalElement = document.getElementById('deleteConfirmationModal');
     if (modalElement && window.bootstrap) {
       const modal = new window.bootstrap.Modal(modalElement);
       modal.show();
     }
   };

   const executeDelete = () => {
     if (deleteId) {
       dispatch(deleteSkillFromResume({ id, skillId: deleteId }));
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
       dispatch(reorderSkills({ id, startIndex: draggedIndex, endIndex: index }));
     }
     setDraggedIndex(null);
   };
 
   const nextButton = () => {
     if (isExperienced && skills.length < 1) {
       toast.error('Please add at least one skill.', {
         position: 'top-right',
         autoClose: 5000,
         theme: 'light',
       });
       return;
     }

     if (!isExperienced && skills.length < 1) {
       dispatch(markResumeStepSkipped({ id, step: 'skill' }));
     }

     setLoading(true);
     setTimeout(() => {
       setLoading(false);
       router.push(`/bio-data/work-experience/?id=${id}`);
     }, 2500);
   };

  return (
    <>
      <div className='resume-form-div py-custom'>
        <div className='form-heading'>
          <h1>Skills</h1>
          <p>Let's add your key skills to highlight your expertise.</p>
        </div>

        <div className='mt-5 mb-4'>
          {skills.map((skill, index) => (
            <div 
              className='saved-details-div mb-3' 
              key={skill.skill_id || index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              style={{ cursor: "grab" }}
            >
              <div className='content-div'>
                <p className='title'>{skill.skill_name}</p>
                <p className='all-details'>
                  {skill.proficiency_level && (
                    <span>
                      <img src="/front-assets/images/icons/profeciency-level.svg" width={18} height={18} alt="Organization" />
                      {skill.proficiency_level}
                    </span>
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
                <button type='button' className='edit-btn' onClick={() => editSkill(skill.skill_id)}>
                  <img src="/front-assets/images/icons/edit.svg" width={28} height={28} alt="Edit" />
                </button>
                <button type='button' className='delete-btn' onClick={() => confirmDelete(skill.skill_id)}>
                  <img src="/front-assets/images/icons/delete.svg" width={28} height={28} alt="Delete" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
          <div className="container-fluid px-0  pb-5 pb-md-0 my-5 mb-md-0">
            <div className={`row ${formOpened === true ? '' : 'd-none'}`}>
              <input type="text" {...register("skill_id", { required: "ID is required" })} id="skill_id" defaultValue={skillFormData.skill_id || `edu_${Number(skillIndex)}_${id}`} hidden />

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="skill_name">Skill Name<span className='text-danger'>*</span></label>
                  <input type="text" {...register("skill_name", { required: "Skill name is required" })} className={` ${errors.skill_name ? 'is-invalid' : ''}`} id="skill_name" placeholder="E.g., JavaScript, UI/UX Design" />
                </div>
                {errors.skill_name && <p className="input-error">{errors.skill_name.message}</p>}
              </div>

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className="each-input-div">
                  <label htmlFor="proficiency_level">Proficiency Level<span className='text-danger'>*</span></label>
                  <CustomInput
                    type="select"
                    register={register}
                    registerName="proficiency_level"
                    registerOptions={{ required: 'Proficiency level is required' }}
                    options={[
                      { value: 'Beginner', label: 'Beginner' },
                      { value: 'Intermediate', label: 'Intermediate' },
                      { value: 'Proficient', label: 'Proficient' },
                      { value: 'Advanced', label: 'Advanced' },
                      { value: 'Expert', label: 'Expert' },
                      { value: 'Master', label: 'Master' },
                    ]}
                    placeholder="Select Proficiency Level"
                    className={` ${errors.proficiency_level ? 'is-invalid' : ''}`}
                  />
                </div>
                {errors.proficiency_level && <p className="input-error">{errors.proficiency_level.message}</p>}
              </div>
            </div>

            <div className={`cancel-save-btn-div ${formOpened === true ? '' : 'd-none'}`}>
              <button type='button' className='cancel-btn' onClick={() => setFormOpened(false)}>
                <img src="/front-assets/images/icons/cancel.svg" alt="Cancel" />
                Cancel
              </button>
              <button type='submit' className='save-btn'>
                <img src="/front-assets/images/icons/save.svg" alt="Save" />
                <span id='saveDetails'>Save</span>
              </button>
            </div>

            <button type='button' className={`add-more-btn ${formOpened === true ? 'd-none' : ''}`} onClick={AddMoreSkill}>
              <img src="/front-assets/images/icons/add-more.svg" alt="Add More" /> Add More Skills
            </button>
          </div>
        </form>

        <div className='next-prev-btn-div d-none d-lg-flex'>
          <button type='button' onClick={() => router.back()} className='prev-btn'>Prev</button>
          <button type='button' onClick={nextButton} className='next-btn'>{isExperienced || skills.length >= 1 ? 'Next' : 'Skip & Next'}</button>
        </div>

        <div className="mob-form-bottom-nav custom-container d-lg-none">
          <MobProgressArea />
          <div className='form-button-div'>
            <button type='button' onClick={() => router.back()} className='prev-btn'>Prev</button>
            <button type='button' onClick={nextButton} className='next-btn'>{isExperienced || skills.length >= 1 ? 'Next' : 'Skip & Next'}</button>
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
