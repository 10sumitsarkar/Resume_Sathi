'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setResumePersonalInfomation } from '../../../reducer/resume-reducer';
import MobProgressArea from '../../../components/MobProgressArea';

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const compressImageFile = async (file) => {
  const originalDataUrl = await readFileAsDataUrl(file);
  const image = new Image();

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = originalDataUrl;
  });

  const maxSize = 700;
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext('2d');
  if (!context) return originalDataUrl;

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.72);
};

export default function PersonalInfo() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const personalInfomation = useSelector(
    (state) =>
      state.resume.resumes.find((resume) => resume.id === id)?.personal_infomation || {}
  );

  const [loading, setLoading] = useState(false);
  const [personalFormData, setPersonalFormData] = useState(personalInfomation);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: personalInfomation,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      compressImageFile(file).then((base64Image) => {
        setPersonalFormData((prev) => ({
          ...prev,
          photo: base64Image,
        }));
        setValue('photo', base64Image);
      }).catch(() => {
        alert('Could not process this image. Please try another photo.');
      });
    }
  };

  useEffect(() => {
    const subscription = watch((value) => {
      setPersonalFormData((prev) => ({
        ...value,
        photo: prev.photo, // Preserve photo
      }));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    dispatch(setResumePersonalInfomation({ id: id, data: personalFormData }));
  }, [personalFormData, dispatch, id]);

  const onSubmit = () => {
    const completedPersonalInfo = { ...personalFormData, step_done: true };
    setLoading(true);
    setValue('step_done', true);
    dispatch(setResumePersonalInfomation({ id: id, data: completedPersonalInfo }));
    setTimeout(() => {
      setLoading(false);
      router.push(`/resume/summary/${id}`);
    }, 1000);
  };

 return (
    <>
      <div className='resume-form-div py-custom'>
        <div className='form-heading'>
          <h1>Personal Information</h1>
          <p>Let’s start with your basic details to build your professional profile.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="container-fluid px-0 py-custom  pb-5 pb-md-0 mb-5 mb-md-0">
            <div className="row">
              <div className="col-12">
                <div className="add-photo-div">
                  <div className="img-div">
                    {personalFormData.photo ? (
                      <img src={personalFormData.photo} alt="Preview" />
                    ) : (
                      <img src="/front-assets/images/icons/user-icon.svg" alt="Default" />
                    )}
                  </div>
                  <div className="add-photo-text">
                    <p>Add a photo to your resume</p>
                    <label htmlFor="add-photo">
                      Add a photo
                    </label>
                    <input type="file" {...register("photo")} accept="image/*" className={` ${errors.photo ? 'is-invalid' : ''}`} id="add-photo" hidden onChange={handleImageChange} />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="first_name">First Name<span className='text-danger'>*</span></label>
                  <input type="text"  {...register("firstName", { required: "First Name is required" })} className={` ${errors.firstName ? 'is-invalid' : ''}`} id="first_name" placeholder="First Name" value={personalFormData.firstName || ''} onInput={(e) => { setPersonalFormData(prev => ({ ...prev, firstName: e.target.value })); }} />
                </div>
                {errors.firstName && <p className="input-error">{errors.firstName.message}</p>}
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="last_name">Last Name</label>
                  <input type="text" {...register('lastName')} className="form-control" id="last_name" placeholder="Last Name" value={personalFormData.lastName || ''} />
                </div>
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="email">Email<span className='text-danger'>*</span></label>
                  <input type="text" {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address", }, })} className={` ${errors.email ? 'is-invalid' : ''}`} id="email" placeholder="Email" value={personalFormData.email || ''} />
                </div>
                {errors.email && <p className="input-error">{errors.email.message}</p>}
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="phone">Phone<span className='text-danger'>*</span></label>
                  <input type="tel" {...register('phone', { required: "Phone is required", pattern: { value: /^\d{10}$/, message: "Phone must be 10 digits", }, })} className={` ${errors.phone ? 'is-invalid' : ''}`} id="phone" placeholder="Phone" value={personalFormData.phone || ''} maxLength={10} />
                </div>
                {errors.phone && <p className="input-error">{errors.phone.message}</p>}
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="city">City<span className='text-danger'>*</span></label>
                  <input type="text" {...register('city', { required: "City is required" })} className={` ${errors.city ? 'is-invalid' : ''}`} id="city" placeholder="City" value={personalFormData.city || ''} />
                </div>
                {errors.city && <p className="input-error">{errors.city.message}</p>}
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="State">State<span className='text-danger'>*</span></label>
                  <input type="text" {...register('state', { required: "State is required" })} className={` ${errors.state ? 'is-invalid' : ''}`} id="State" placeholder="State" value={personalFormData.state || ''} />
                </div>
                {errors.state && <p className="input-error">{errors.state.message}</p>}
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="website">website</label>
                  <input type="text" {...register('website', { pattern: {value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/\S*)?$/,message: 'Please enter a valid website URL',}})} className={` ${errors.website ? 'is-invalid' : ''}`} id="website" placeholder="www.resumesathi.com" value={personalFormData.website || ''} />
                </div>
                 {errors.website && <p className="input-error">{errors.website.message}</p>}
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="experience">Experience<span className='text-danger'>*</span></label>
                  <div className='radio-btn-div mt-2'>
                    <label>
                      <input type="radio" {...register('experience', { required: "Experience is required" })} name='experience' className={` ${errors.experience ? 'is-invalid' : ''}`} id="experience" placeholder="Experience" value={'Fresher'} hidden checked={personalFormData.experience === 'Fresher' ? true : false} />
                      Fresher
                    </label>
                    <label>
                      <input type="radio" {...register('experience', { required: "Experience is required" })} name='experience' className={` ${errors.experience ? 'is-invalid' : ''}`} id="experience" placeholder="Experience" value={'Experienced'} hidden checked={personalFormData.experience === 'Experienced' ? true : false} />
                      Experienced
                    </label>
                  </div>
                  {errors.experience && <p className="input-error">{errors.experience.message}</p>}
                </div>
              </div>

            </div >
          </div >
          <div className='next-prev-btn-div d-none d-lg-flex'>
            <button type="button" className="prev-btn" onClick={() => router.back()}>Prev</button>
            <button type='submit' className='next-btn'>Next</button>
          </div>



          <div className="mob-form-bottom-nav custom-container d-lg-none">
            <MobProgressArea/>
            <div className='form-button-div'>
              <button type="button" className="prev-btn" onClick={() => router.back()}>Prev</button>
              <button type='submit' className='next-btn'>Next</button>
            </div>
          </div>
        </form>
      </div >

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
    </>
  )
}
