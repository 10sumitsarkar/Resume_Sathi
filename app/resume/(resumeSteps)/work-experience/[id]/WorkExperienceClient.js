"use client";

import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  setResumeWorkExperiences,
  deleteWorkExperienceFromResume,
  reorderWorkExperiences,
  markResumeStepSkipped,
} from "../../../reducer/resume-reducer";
import MobProgressArea from "../../../components/MobProgressArea";
import CustomInput from '../../../../components/CustomInput/CustomInput';

export default function WorkExperience() {
  const { id } = useParams();
  const router = useRouter();
  const formRef = useRef(null);

  const [stillEnrolled, setStillEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formOpened, setFormOpened] = useState("");
  const [editStatus, setEditStatus] = useState(false);
  const [workEperienceIndex, setWorkExperienceIndex] = useState(1);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const work_experiences = useSelector(
    (state) =>
      state.resume.resumes.find((resume) => resume.id === id)
        ?.work_experiences || [],
  );
  const personalInfomation = useSelector(
    (state) =>
      state.resume.resumes.find((resume) => resume.id === id)
        ?.personal_infomation || {},
  );
  const isExperienced = personalInfomation.experience === "Experienced";

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: work_experiences[0] || {},
  });

  const workExperienceFormData = watch(); // Get real-time form values

  useEffect(() => {
    if (!workExperienceFormData.end_month && !workExperienceFormData.end_year) {
      setStillEnrolled(true);
    } else {
      setStillEnrolled(false);
    }
  }, [workExperienceFormData.end_month, workExperienceFormData.end_year]);

  useEffect(() => {
    if (work_experiences.length < 1) {
      setFormOpened(true);
    } else {
      setFormOpened(false);
    }
  }, [work_experiences.length]);

  const handleStillEnrolledChange = (e) => {
    const checked = e.target.checked;
    setStillEnrolled(checked);
    if (checked) {
      setValue("end_month", "");
      setValue("end_year", "");
    }
  };

  const AddMoreWorkExperience = () => {
    const newIndex = `${Date.now()}`;
    setWorkExperienceIndex(newIndex);
    const newWorkExperienceId = `workEperience_${newIndex}_${id}`;
    reset({
      workEperience_id: newWorkExperienceId,
      job_title: "",
      company_name: "",
      employee_type: "",
      location: "",
      start_month: "",
      start_year: "",
      end_month: "",
      end_year: "",
      description: '',
    });
    setFormOpened(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    document.getElementById("saveDetails").innerText = "Save";
  };

  const onSubmit = (data) => {
    dispatch(setResumeWorkExperiences({ id, data }));
    setFormOpened(false);
    reset();

    if (editStatus) {
      toast.success("Work experience updated successfully.", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    } else {
      toast.success("Work experience saved successfully.", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    }
    setEditStatus(false);
  };

  const editWorkExperience = (workExperienceId) => {
    const workExperienceToEdit = work_experiences.find(
      (exp) => exp.workEperience_id === workExperienceId,
    );
    if (workExperienceToEdit) {
      setEditStatus(true);
      document.getElementById("saveDetails").innerText = "Update";
      setFormOpened(true);
      reset(workExperienceToEdit);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const confirmDelete = (workExperienceId) => {
    setDeleteId(workExperienceId);
    const modalElement = document.getElementById('deleteConfirmationModal');
    if (modalElement && window.bootstrap) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    }
  };

  const executeDelete = () => {
    if (deleteId) {
      dispatch(deleteWorkExperienceFromResume({ id, workExperienceId: deleteId }));
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
      dispatch(reorderWorkExperiences({ id, startIndex: draggedIndex, endIndex: index }));
    }
    setDraggedIndex(null);
  };

  const nextButton = () => {
    if (isExperienced && work_experiences.length < 1) {
      toast.error("Please add at least one work experience because you selected Experienced.", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }

    if (!isExperienced && work_experiences.length < 1) {
      dispatch(markResumeStepSkipped({ id, step: 'work_experience' }));
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(`/resume/social-media/${id}`);
    }, 2500);
  };
  return (
    <>
      <div className="resume-form-div py-custom">
        <div className="form-heading">
          <h1>Work Experience</h1>
          <p>
            Let's add your professional experience to showcase your expertise.
          </p>
        </div>

        <div className="mt-5 mb-4">
          {work_experiences.map((workEperience, index) => (
            <div 
              className="saved-details-div mb-3" 
              key={workEperience.workEperience_id || index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              style={{ cursor: "grab" }}
            >
              <div className="content-div">
                <p className="title">
                  {workEperience.company_name} ,{" "}
                  <span>{workEperience.job_title}</span>
                </p>
                <p className="all-details">
                  {workEperience.location ? (
                    <span>
                      <img
                        src="/front-assets/images/icons/location.svg"
                        width={18}
                        height={18}
                        alt="Education"
                      />{" "}
                      {workEperience.location}
                    </span>
                  ) : (
                    ""
                  )}

                  {workEperience.end_month && workEperience.end_year ? (
                    <>
                      |
                      <span>
                        <img
                          src="/front-assets/images/icons/date.svg"
                          alt="date"
                        />{" "}
                        {workEperience.end_month}, {workEperience.end_year}
                      </span>
                    </>
                  ) : (
                    <span>
                      <img
                        src="/front-assets/images/icons/date.svg"
                        alt="date"
                      />{" "}
                      Working till now
                    </span>
                  )}
                </p>
              </div>

              <div className="button-div">
                <div 
                  className="drag-handle" 
                  title="Drag to reorder">
                  
<svg width="16" height="6" viewBox="0 0 16 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 0H1C0.45 0 0 0.45 0 1C0 1.55 0.45 2 1 2H15C15.55 2 16 1.55 16 1C16 0.45 15.55 0 15 0ZM1 6H15C15.55 6 16 5.55 16 5C16 4.45 15.55 4 15 4H1C0.45 4 0 4.45 0 5C0 5.55 0.45 6 1 6Z" fill="black"/>
</svg>

                </div>
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() =>
                    editWorkExperience(workEperience.workEperience_id)
                  }
                >
                  <img
                    src="/front-assets/images/icons/edit.svg"
                    width={28}
                    height={28}
                    alt="Edit"
                  />
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() =>
                    confirmDelete(workEperience.workEperience_id)
                  }
                >
                  <img
                    src="/front-assets/images/icons/delete.svg"
                    width={28}
                    height={28}
                    alt="Delete"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
          <div className="container-fluid px-0  pb-5 pb-md-0 my-5 mb-md-0">
            <div className={`row ${formOpened === true ? "" : "d-none"}`}>
              <input
                type="text"
                {...register("workEperience_id", {
                  required: "ID is required",
                })}
                id="workEperience_id"
                defaultValue={
                  workExperienceFormData.workEperience_id ||
                  `workEperience_${Number(workEperienceIndex)}_${id}`
                }
                hidden
              />

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className="each-input-div">
                  <label htmlFor="job_title">Job Title</label>
                  <input
                    type="text"
                    {...register("job_title", {
                      required: "Job Title is required",
                    })}
                    className={` ${errors.job_title ? "is-invalid" : ""}`}
                    id="job_title"
                    placeholder="E.g., Software Engineer"
                  />
                </div>
                {errors.job_title && (
                  <p className="input-error">{errors.job_title.message}</p>
                )}
              </div>

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className="each-input-div">
                  <label htmlFor="company_name">Company Name</label>
                  <input
                    type="text"
                    {...register("company_name", {
                      required: "Company name is required",
                    })}
                    className={` ${errors.company_name ? "is-invalid" : ""}`}
                    id="company_name"
                    placeholder="E.g., Delhi University"
                  />
                </div>
                {errors.company_name && (
                  <p className="input-error">{errors.company_name.message}</p>
                )}
              </div>

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className="each-input-div">
                  <label htmlFor="employee_type">Employment Type</label>
                  <CustomInput
                    type="select"
                    register={register}
                    registerName="employee_type"
                    registerOptions={{ required: 'Employee type is required' }}
                    options={[
                      { value: 'Full-time', label: 'Full-time' },
                      { value: 'Part-time', label: 'Part-time' },
                      { value: 'Contract', label: 'Contract' },
                      { value: 'Freelance', label: 'Freelance' },
                      { value: 'Internship', label: 'Internship' },
                      { value: 'Temporary', label: 'Temporary' },
                      { value: 'Volunteer', label: 'Volunteer' },
                      { value: 'Other', label: 'Other' },
                    ]}
                    placeholder="Select Employee Type"
                    className={` ${errors.employee_type ? "is-invalid" : ""}`}
                  />
                </div>
                {errors.employee_type && (
                  <p className="input-error">{errors.employee_type.message}</p>
                )}
              </div>

              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className="each-input-div">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    {...register("location", {
                      required: "Location is required",
                    })}
                    className={` ${errors.location ? "is-invalid" : ""}`}
                    id="location"
                    placeholder="E.g., Delhi, India"
                  />
                </div>
                {errors.location && (
                  <p className="input-error">{errors.location.message}</p>
                )}
              </div>

              <div className="col-12 col-lg-12 col-xl-12 col-xxl-6 mb-4">
                <div className="each-input-div">
                  <label htmlFor="start_date">Start Date</label>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="each-input-div">
                      <CustomInput
                        type="select"
                        register={register}
                        registerName="start_month"
                        registerOptions={{ required: 'Month is required' }}
                        options={['January','February','March','April','May','June','July','August','September','October','November','December'].map(m=>({value:m,label:m}))}
                        placeholder="Month"
                        className={` ${errors.start_month ? "is-invalid" : ""}`}
                      />
                    </div>

                    {errors.start_month && (
                      <p className="input-error">
                        {errors.start_month.message}
                      </p>
                    )}
                  </div>
                  <div className="col-6">
                    <div className="each-input-div">
                      <CustomInput
                        type="select"
                        register={register}
                        registerName="start_year"
                        registerOptions={{ required: 'Month is required' }}
                        options={Array.from({ length: 50 }, (_, i) => ({ value: new Date().getFullYear() - i, label: String(new Date().getFullYear() - i) }))}
                        search={true}
                        placeholder="Year"
                        className={` ${errors.start_year ? "is-invalid" : ""}`}
                      />
                    </div>

                    {errors.start_year && (
                      <p className="input-error">{errors.start_year.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-12 col-xl-12 col-xxl-6 mb-4">
                <div className="each-input-div">
                  <label htmlFor="end_month">End Date</label>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="each-input-div">
                      <CustomInput
                        type="select"
                        register={register}
                        registerName="end_month"
                        registerOptions={{ required: !stillEnrolled ? 'Month is required' : false }}
                        options={['January','February','March','April','May','June','July','August','September','October','November','December'].map(m=>({value:m,label:m}))}
                        placeholder="Month"
                        className={` ${errors.end_month ? "is-invalid" : ""}`}
                        disabled={stillEnrolled}
                        onChange={() => setStillEnrolled(false)}
                      />
                    </div>

                    {errors.end_month && (
                      <p className="input-error">{errors.end_month.message}</p>
                    )}
                  </div>
                  <div className="col-6">
                    <div className="each-input-div">
                      <CustomInput
                        type="select"
                        register={register}
                        registerName="end_year"
                        registerOptions={{ required: !stillEnrolled ? 'Month is required' : false }}
                        options={Array.from({ length: 50 }, (_, i) => ({ value: new Date().getFullYear() - i, label: String(new Date().getFullYear() - i) }))}
                        search={true}
                        placeholder="Year"
                        className={` ${errors.end_year ? "is-invalid" : ""}`}
                        disabled={stillEnrolled}
                        onChange={() => setStillEnrolled(false)}
                      />
                    </div>

                    {errors.end_year && (
                      <p className="input-error">{errors.end_year.message}</p>
                    )}
                  </div>
                </div>
                <label className="checked-label mt-3">
                  <input
                    type="checkbox"
                    checked={stillEnrolled}
                    onChange={handleStillEnrolledChange}
                    hidden
                  />
                  <label className="checkbox-label"></label>
                  I'm still enrolled
                </label>
              </div>

              <div className="col-12 mb-4">
                <div className="each-input-div">
                  <label htmlFor="description">Description (Optional)</label>
                  <textarea
                    rows={8}
                    {...register("description")}
                    className={``}
                    id="description"
                   placeholder="Describe your work, experience, achievements, responsibilities, or any relevant details..."
                  ></textarea>
                  <button type="button" className="refine-al-btn">
                    <img
                      src="/front-assets/images/icons/refine-ai.svg"
                      alt="Refine AI"
                    />{" "}
                    Refine with AI
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`cancel-save-btn-div ${formOpened === true ? "" : "d-none"}`}
            >
              <button
                type="button"
                className={`cancel-btn`}
                onClick={() => setFormOpened(false)}
              >
                <img src="/front-assets/images/icons/cancel.svg" alt="Cancel" />
                Cancel
              </button>

              <button type="submit" className="save-btn">
                <img src="/front-assets/images/icons/save.svg" alt="Save" />
                <span id="saveDetails">Save</span>
              </button>
            </div>

            <button
              type="button"
              className={`add-more-btn ${formOpened === true ? "d-none" : ""}`}
              onClick={AddMoreWorkExperience}
            >
              <img
                src="/front-assets/images/icons/add-more.svg"
                alt="Add More"
              />{" "}
              Add More Experience
            </button>
          </div>
        </form>

        <div className="next-prev-btn-div d-none d-lg-flex">
          <button
            type="button"
            onClick={() => router.back()}
            className="prev-btn"
          >
            Prev
          </button>
          <button type="button" onClick={nextButton} className="next-btn">
            {isExperienced || work_experiences.length >= 1 ? "Next" : "Skip & Next"}
          </button>
        </div>

        <div className="mob-form-bottom-nav custom-container d-lg-none">
          <MobProgressArea />
          <div className="form-button-div">
            <button
              type="button"
              onClick={() => router.back()}
              className="prev-btn"
            >
              Prev
            </button>
            <button type="button" onClick={nextButton} className="next-btn">
              {isExperienced || work_experiences.length >= 1 ? "Next" : "Skip & Next"}
            </button>
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
        <div className="loader-div">
          <div className="loader-inner-div">
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
