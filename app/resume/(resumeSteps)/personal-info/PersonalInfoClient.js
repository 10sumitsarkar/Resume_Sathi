'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setResumePersonalInfomation } from '../../reducer/resume-reducer';
import MobProgressArea from '../../components/MobProgressArea';

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});

// Crop frame + output settings
const CROP_BOX_SIZE = 280; // px, square preview box shown to the user
const OUTPUT_SIZE = 500;   // px, final exported square image size
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export default function PersonalInfo() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const dispatch = useDispatch();

  const personalInfomation = useSelector(
    (state) =>
      state.resume.resumes.find((resume) => resume.id === id)?.personal_infomation || {}
  );

  const [loading, setLoading] = useState(false);
  const [personalFormData, setPersonalFormData] = useState(personalInfomation);

  // ---- Crop modal state ----
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImage, setRawImage] = useState(null);       // Image() instance being cropped
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });  // user drag offset (in display px)
  const [baseScale, setBaseScale] = useState(1);         // "cover" scale to fill the crop box

  const dragStateRef = useRef({ dragging: false, startX: 0, startY: 0, startOffset: { x: 0, y: 0 } });
  const fileInputRef = useRef(null);

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

  // ---- Open crop modal when a file is picked ----
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const img = await loadImage(dataUrl);

      const scale = Math.max(CROP_BOX_SIZE / img.width, CROP_BOX_SIZE / img.height);

      setRawImage(img);
      setBaseScale(scale);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setCropModalOpen(true);
    } catch {
      alert('Could not process this image. Please try another photo.');
    } finally {
      // allow re-selecting the same file later
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ---- Clamp drag offset so the image always covers the crop box ----
  const clampOffset = (nextOffset, currentZoom) => {
    if (!rawImage) return { x: 0, y: 0 };
    const dispW = rawImage.width * baseScale * currentZoom;
    const dispH = rawImage.height * baseScale * currentZoom;

    const maxX = Math.max(0, (dispW - CROP_BOX_SIZE) / 2);
    const maxY = Math.max(0, (dispH - CROP_BOX_SIZE) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, nextOffset.x)),
      y: Math.min(maxY, Math.max(-maxY, nextOffset.y)),
    };
  };

  const handleZoomChange = (e) => {
    const nextZoom = parseFloat(e.target.value);
    setZoom(nextZoom);
    setOffset((prev) => clampOffset(prev, nextZoom));
  };

  // ---- Drag to reposition (mouse + touch) ----
  const getPoint = (e) => {
    if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };

  const startDrag = (e) => {
    const p = getPoint(e);
    dragStateRef.current = { dragging: true, startX: p.x, startY: p.y, startOffset: offset };
  };

  const onDrag = (e) => {
    if (!dragStateRef.current.dragging) return;
    e.preventDefault();
    const p = getPoint(e);
    const dx = p.x - dragStateRef.current.startX;
    const dy = p.y - dragStateRef.current.startY;
    const next = {
      x: dragStateRef.current.startOffset.x + dx,
      y: dragStateRef.current.startOffset.y + dy,
    };
    setOffset(clampOffset(next, zoom));
  };

  const endDrag = () => {
    dragStateRef.current.dragging = false;
  };

  // ---- Render cropped area onto a canvas and save it ----
  const applyCrop = () => {
    if (!rawImage) return;

    const dispW = rawImage.width * baseScale * zoom;
    const dispH = rawImage.height * baseScale * zoom;

    // top-left of the image relative to the crop box, in display px
    const imgLeft = (CROP_BOX_SIZE - dispW) / 2 + offset.x;
    const imgTop = (CROP_BOX_SIZE - dispH) / 2 + offset.y;

    const srcPerDisplay = 1 / (baseScale * zoom);

    const sx = (0 - imgLeft) * srcPerDisplay;
    const sy = (0 - imgTop) * srcPerDisplay;
    const sSize = CROP_BOX_SIZE * srcPerDisplay;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(rawImage, sx, sy, sSize, sSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

    setPersonalFormData((prev) => ({ ...prev, photo: croppedDataUrl }));
    setValue('photo', croppedDataUrl);
    closeCropModal();
  };

  const closeCropModal = () => {
    setCropModalOpen(false);
    setRawImage(null);
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
      router.push(`/resume/summary?id=${id}`);
    }, 1000);
  };

  const dispW = rawImage ? rawImage.width * baseScale * zoom : 0;
  const dispH = rawImage ? rawImage.height * baseScale * zoom : 0;
  const imgLeft = rawImage ? (CROP_BOX_SIZE - dispW) / 2 + offset.x : 0;
  const imgTop = rawImage ? (CROP_BOX_SIZE - dispH) / 2 + offset.y : 0;

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
                      {personalFormData.photo ? 'Change photo' : 'Add a photo'}
                    </label>
                    <input
                      type="file"
                      {...register('photo')}
                      accept="image/*"
                      className={` ${errors.photo ? 'is-invalid' : ''}`}
                      id="add-photo"
                      hidden
                      ref={(el) => {
                        register('photo').ref(el);
                        fileInputRef.current = el;
                      }}
                      onChange={handleImageChange}
                    />
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

      {/* ---- Crop Modal ---- */}
     {cropModalOpen && rawImage && (
  <div className="crop-modal-overlay">
    <div className="crop-modal-panel">
      <div className="crop-modal-header">
        <span className="crop-modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2v14a2 2 0 0 0 2 2h14" />
            <path d="M18 22V8a2 2 0 0 0-2-2H2" />
          </svg>
        </span>
        <h3 className="crop-modal-title">Adjust your photo</h3>
        <p className="crop-modal-subtitle">Drag to reposition, use the slider to zoom.</p>
      </div>

      <div className="crop-frame-wrapper">
        <div
          className="crop-frame"
          onMouseDown={startDrag}
          onMouseMove={onDrag}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={startDrag}
          onTouchMove={onDrag}
          onTouchEnd={endDrag}
        >
          <img
            src={rawImage.src}
            alt="Crop preview"
            draggable={false}
            style={{
              left: imgLeft,
              top: imgTop,
              width: dispW,
              height: dispH,
            }}
          />
          <span className="crop-frame-ring" />
        </div>
      </div>

      <div className="crop-zoom-row">
        <span className="crop-zoom-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          onChange={handleZoomChange}
          className="crop-zoom-slider"
          style={{ '--crop-zoom-pct': `${((zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100}%` }}
        />
        <span className="crop-zoom-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
            <line x1="11" y1="8" x2="11" y2="14" />
          </svg>
        </span>
      </div>

      <div className="crop-modal-actions">
        <button type="button" onClick={closeCropModal} className="crop-cancel-btn">
          Cancel
        </button>
        <button type="button" onClick={applyCrop} className="crop-apply-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Apply
        </button>
      </div>
    </div>
  </div>
)}

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