'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setResumePersonalInfomation } from '../../reducer/resume-reducer';
import MobProgressArea from '../../components/MobProgressArea';
import CustomInput from '../../../components/CustomInput/CustomInput';

const COUNTRY_CODES = [
  { value: '+91', label: '+91' },
  { value: '+1', label: '+1' },
  { value: '+44', label: '+44' },
  { value: '+61', label: '+61' },
  { value: '+971', label: '+971' },
  { value: '+966', label: '+966' },
  { value: '+92', label: '+92' },
  { value: '+880', label: '+880' },
  { value: '+65', label: '+65' },
  { value: '+81', label: '+81' },
  { value: '+82', label: '+82' },
  { value: '+49', label: '+49' },
  { value: '+33', label: '+33' },
  { value: '+55', label: '+55' },
  { value: '+27', label: '+27' },
  { value: '+234', label: '+234' },
  { value: '+52', label: '+52' },
  { value: '+7', label: '+7' },
];

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
const NAME_RULE = {
  required: "This field is required",
  pattern: { value: /^[A-Za-z\s.'-]+$/, message: "Only letters are allowed" },
};
const OPTIONAL_NAME_RULE = {
  pattern: { value: /^[A-Za-z\s.'-]*$/, message: "Only letters are allowed" },
};
const PIN_RULE = {
  required: "Pin code is required",
  pattern: { value: /^\d{6}$/, message: "Pin code must be 6 digits" },
};
const REQUIRED_TEXT_RULE = {
  required: "This field is required",
  validate: (value) => String(value || "").trim().length > 0 || "This field is required",
};
const SELECT_OPTIONS = {
  maritalStatus: [
    { value: "Unmarried", label: "Unmarried" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" },
  ],
  sex: [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ],
  nationality: [
    { value: "Indian", label: "Indian" },
    { value: "Other", label: "Other" },
  ],
  religion: [
    { value: "Hindu", label: "Hindu" },
    { value: "Muslim", label: "Muslim" },
    { value: "Christian", label: "Christian" },
    { value: "Sikh", label: "Sikh" },
    { value: "Buddhist", label: "Buddhist" },
    { value: "Jain", label: "Jain" },
    { value: "Other", label: "Other" },
  ],
  caste: [
    { value: "General", label: "General" },
    { value: "OBC", label: "OBC" },
    { value: "SC", label: "SC" },
    { value: "ST", label: "ST" },
    { value: "EWS", label: "EWS" },
    { value: "Other", label: "Other" },
  ],
};

const buildAddress = (data, prefix) =>
  [
    data[`${prefix}_address_line`],
    data[`${prefix}_city`],
    data[`${prefix}_state`],
    data[`${prefix}_pin`] ? `Pin - ${data[`${prefix}_pin`]}` : "",
  ].filter(Boolean).join(", ");

const buildPersonalPreviewData = (data, photo) => ({
  ...data,
  photo,
  permanent_address: buildAddress(data, "permanent"),
  present_address: buildAddress(data, "present"),
});

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
  const [sameAsPermanent, setSameAsPermanent] = useState(
    Boolean(personalInfomation.same_as_permanent_address)
  );

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
    defaultValues: {
      ...personalInfomation,
      country_code: personalInfomation.country_code || '+91',
      nationality: personalInfomation.nationality || 'Indian',
    },
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

  const copyPermanentToPresent = (source = personalFormData) => {
    const nextFields = {
      present_address_line: source.permanent_address_line || "",
      present_city: source.permanent_city || "",
      present_state: source.permanent_state || "",
      present_pin: source.permanent_pin || "",
    };

    Object.entries(nextFields).forEach(([key, value]) => {
      setValue(key, value, { shouldDirty: true, shouldValidate: true });
    });
    setPersonalFormData((prev) => ({ ...prev, ...nextFields }));
  };

  const handleSameAsPermanentChange = (e) => {
    const checked = e.target.checked;
    setSameAsPermanent(checked);
    setValue("same_as_permanent_address", checked, { shouldDirty: true });
    if (checked) copyPermanentToPresent();
  };

  useEffect(() => {
    const subscription = watch((value) => {
      setPersonalFormData((prev) => ({
        ...buildPersonalPreviewData(value, prev.photo),
      }));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (sameAsPermanent) {
      copyPermanentToPresent(personalFormData);
    }
  }, [
    sameAsPermanent,
    personalFormData.permanent_address_line,
    personalFormData.permanent_city,
    personalFormData.permanent_state,
    personalFormData.permanent_pin,
  ]);

  useEffect(() => {
    dispatch(setResumePersonalInfomation({ id: id, data: personalFormData }));
  }, [personalFormData, dispatch, id]);

  const onSubmit = (data) => {
    const completedPersonalInfo = {
      ...buildPersonalPreviewData({ ...personalFormData, ...data }, personalFormData.photo),
      same_as_permanent_address: sameAsPermanent,
      step_done: true,
    };
    setLoading(true);
    setValue('step_done', true);
    dispatch(setResumePersonalInfomation({ id: id, data: completedPersonalInfo }));
    setTimeout(() => {
      setLoading(false);
      router.push(`/bio-data/education/?id=${id}`);
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
                    <p>Add a photo to your bio-data</p>
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
              <div className="col-12"><h5 className="mb-3">Basic Details</h5></div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="first_name">First Name<span className='text-danger'>*</span></label>
                  <input type="text"  {...register("firstName", NAME_RULE)} className={` ${errors.firstName ? 'is-invalid' : ''}`} id="first_name" placeholder="First Name" value={personalFormData.firstName || ''} onInput={(e) => { setPersonalFormData(prev => ({ ...prev, firstName: e.target.value })); }} />
                </div>
                {errors.firstName && <p className="input-error">{errors.firstName.message}</p>}
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="last_name">Last Name</label>
                  <input type="text" {...register('lastName', OPTIONAL_NAME_RULE)} className={` ${errors.lastName ? 'is-invalid' : ''}`} id="last_name" placeholder="Last Name" value={personalFormData.lastName || ''} />
                </div>
                {errors.lastName && <p className="input-error">{errors.lastName.message}</p>}
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="date_of_birth">Date of Birth<span className='text-danger'>*</span></label>
                  <CustomInput
                    type="date"
                    register={register}
                    registerName="date_of_birth"
                    registerOptions={{ required: 'Date of birth is required' }}
                    setValue={setValue}
                    value={personalFormData.date_of_birth}
                    maxDate={new Date().toISOString()}
                    className={` ${errors.date_of_birth ? 'is-invalid' : ''}`}
                    placeholder="Select date of birth"
                  />
                </div>
                {errors.date_of_birth && <p className="input-error">{errors.date_of_birth.message}</p>}
              </div>
              <div className="col-12"><h5 className="mb-3 mt-2">Family Details</h5></div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="father_name">Father's Name<span className='text-danger'>*</span></label>
                  <input type="text" {...register('father_name', NAME_RULE)} className={` ${errors.father_name ? 'is-invalid' : ''}`} id="father_name" placeholder="Father's Name" value={personalFormData.father_name || ''} />
                </div>
                {errors.father_name && <p className="input-error">{errors.father_name.message}</p>}
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="mother_name">Mother's Name<span className='text-danger'>*</span></label>
                  <input type="text" {...register('mother_name', NAME_RULE)} className={` ${errors.mother_name ? 'is-invalid' : ''}`} id="mother_name" placeholder="Mother's Name" value={personalFormData.mother_name || ''} />
                </div>
                {errors.mother_name && <p className="input-error">{errors.mother_name.message}</p>}
              </div>
              <div className="col-12"><h5 className="mb-3">Permanent Address</h5></div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4"><div className='each-input-div'><label htmlFor="permanent_address_line">Address<span className='text-danger'>*</span></label><input type="text" {...register('permanent_address_line', REQUIRED_TEXT_RULE)} className={` ${errors.permanent_address_line ? 'is-invalid' : ''}`} id="permanent_address_line" placeholder="Village / Street / P.O. / P.S." value={personalFormData.permanent_address_line || ''} /></div>{errors.permanent_address_line && <p className="input-error">{errors.permanent_address_line.message}</p>}</div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4"><div className='each-input-div'><label htmlFor="permanent_city">City / District<span className='text-danger'>*</span></label><input type="text" {...register('permanent_city', NAME_RULE)} className={` ${errors.permanent_city ? 'is-invalid' : ''}`} id="permanent_city" placeholder="City / District" value={personalFormData.permanent_city || ''} /></div>{errors.permanent_city && <p className="input-error">{errors.permanent_city.message}</p>}</div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4"><div className='each-input-div'><label htmlFor="permanent_state">State<span className='text-danger'>*</span></label><input type="text" {...register('permanent_state', NAME_RULE)} className={` ${errors.permanent_state ? 'is-invalid' : ''}`} id="permanent_state" placeholder="State" value={personalFormData.permanent_state || ''} /></div>{errors.permanent_state && <p className="input-error">{errors.permanent_state.message}</p>}</div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4"><div className='each-input-div'><label htmlFor="permanent_pin">Pin Code<span className='text-danger'>*</span></label><input type="text" inputMode="numeric" maxLength={6} {...register('permanent_pin', PIN_RULE)} className={` ${errors.permanent_pin ? 'is-invalid' : ''}`} id="permanent_pin" placeholder="721632" value={personalFormData.permanent_pin || ''} onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 6); }} /></div>{errors.permanent_pin && <p className="input-error">{errors.permanent_pin.message}</p>}</div>
              <div className="col-12">
                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2 mb-3">
                  <h5 className="mb-0">Present Address</h5>
                  <label className="checked-label m-0">
                    <input
                      type="checkbox"
                      {...register("same_as_permanent_address")}
                      checked={sameAsPermanent}
                      onChange={handleSameAsPermanentChange}
                      hidden
                    />
                    <div className="checkbox-label"></div>
                    Same as permanent address
                  </label>
                </div>
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4"><div className='each-input-div'><label htmlFor="present_address_line">Address<span className='text-danger'>*</span></label><input type="text" {...register('present_address_line', REQUIRED_TEXT_RULE)} className={` ${errors.present_address_line ? 'is-invalid' : ''}`} id="present_address_line" placeholder="Village / Street / P.O. / P.S." value={personalFormData.present_address_line || ''} readOnly={sameAsPermanent} /></div>{errors.present_address_line && <p className="input-error">{errors.present_address_line.message}</p>}</div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4"><div className='each-input-div'><label htmlFor="present_city">City / District<span className='text-danger'>*</span></label><input type="text" {...register('present_city', NAME_RULE)} className={` ${errors.present_city ? 'is-invalid' : ''}`} id="present_city" placeholder="City / District" value={personalFormData.present_city || ''} readOnly={sameAsPermanent} /></div>{errors.present_city && <p className="input-error">{errors.present_city.message}</p>}</div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4"><div className='each-input-div'><label htmlFor="present_state">State<span className='text-danger'>*</span></label><input type="text" {...register('present_state', NAME_RULE)} className={` ${errors.present_state ? 'is-invalid' : ''}`} id="present_state" placeholder="State" value={personalFormData.present_state || ''} readOnly={sameAsPermanent} /></div>{errors.present_state && <p className="input-error">{errors.present_state.message}</p>}</div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4"><div className='each-input-div'><label htmlFor="present_pin">Pin Code<span className='text-danger'>*</span></label><input type="text" inputMode="numeric" maxLength={6} {...register('present_pin', PIN_RULE)} className={` ${errors.present_pin ? 'is-invalid' : ''}`} id="present_pin" placeholder="721632" value={personalFormData.present_pin || ''} readOnly={sameAsPermanent} onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 6); }} /></div>{errors.present_pin && <p className="input-error">{errors.present_pin.message}</p>}</div>
              <div className="col-12"><h5 className="mb-3 mt-2">Community & Identity Details</h5></div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="caste">Caste</label>
                  <CustomInput type="select" register={register} registerName="caste" setValue={setValue} options={SELECT_OPTIONS.caste} value={personalFormData.caste} placeholder="Select caste" />
                </div>
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="marital_status">Marital Status</label>
                  <CustomInput type="select" register={register} registerName="marital_status" setValue={setValue} options={SELECT_OPTIONS.maritalStatus} value={personalFormData.marital_status} placeholder="Select marital status" />
                </div>
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="sex">Sex</label>
                  <CustomInput type="select" register={register} registerName="sex" setValue={setValue} options={SELECT_OPTIONS.sex} value={personalFormData.sex} placeholder="Select sex" />
                </div>
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="nationality">Nationality</label>
                  <CustomInput type="select" register={register} registerName="nationality" setValue={setValue} options={SELECT_OPTIONS.nationality} value={personalFormData.nationality || 'Indian'} placeholder="Select nationality" />
                </div>
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="religion">Religion</label>
                  <CustomInput type="select" register={register} registerName="religion" setValue={setValue} options={SELECT_OPTIONS.religion} value={personalFormData.religion} placeholder="Select religion" />
                </div>
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="languages">Languages</label>
                  <input type="text" {...register('languages', { pattern: { value: /^[A-Za-z\s,]+$/, message: "Use language names separated by comma or Enter" } })} className={` ${errors.languages ? 'is-invalid' : ''}`} id="languages" placeholder="Bengali, Hindi" value={personalFormData.languages || ''} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const nextValue = `${e.currentTarget.value.trim().replace(/,+$/, '')}, `;
                      setValue('languages', nextValue, { shouldDirty: true, shouldValidate: true });
                      setPersonalFormData((prev) => ({ ...prev, languages: nextValue }));
                    }
                  }} />
                </div>
                {errors.languages && <p className="input-error">{errors.languages.message}</p>}
              </div>
              <div className="col-12"><h5 className="mb-3 mt-2">Contact Details</h5></div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="email">Email</label>
                  <input type="text" {...register('email', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address", }, })} className={` ${errors.email ? 'is-invalid' : ''}`} id="email" placeholder="Email" value={personalFormData.email || ''} />
                </div>
                {errors.email && <p className="input-error">{errors.email.message}</p>}
              </div>
              <div className="col-md-6 col-lg-12 col-xl-6 mb-4">
                <div className='each-input-div'>
                  <label htmlFor="phone">Phone<span className='text-danger'>*</span></label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                    <div style={{ width: 92, flexShrink: 0 }}>
                      <CustomInput
                        type="select"
                        options={COUNTRY_CODES}
                        search={true}
                        placeholder="Code"
                        value={personalFormData.country_code || '+91'}
                        onChange={(value) => {
                          const nextValue = value || '+91';
                          setPersonalFormData((prev) => ({ ...prev, country_code: nextValue }));
                          setValue('country_code', nextValue, { shouldValidate: true, shouldDirty: true });
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <input type="tel" {...register('phone', { required: "Phone is required", pattern: { value: /^\d{10}$/, message: "Phone must be 10 digits", }, })} className={` ${errors.phone ? 'is-invalid' : ''}`} id="phone" placeholder="Phone" value={personalFormData.phone || ''} maxLength={10} onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10); }} onChange={(e) => setPersonalFormData(prev => ({ ...prev, phone: e.target.value }))} />
                    </div>
                  </div>
                </div>
                {errors.phone && <p className="input-error">{errors.phone.message}</p>}
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
