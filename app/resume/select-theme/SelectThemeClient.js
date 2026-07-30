'use client';
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import ResumeTemplate1 from '../templates/ResumeTemplate1'
import ResumeTemplate2 from '../templates/ResumeTemplate2'
import ResumeTemplate3 from '../templates/ResumeTemplate3'
import ResumeTemplate4 from '../templates/ResumeTemplate4'
import ResumeTemplate5 from '../templates/ResumeTemplate5'
import ResumeTemplate6 from '../templates/ResumeTemplate6'
import ResumeTemplate7 from '../templates/ResumeTemplate7'
import { useDispatch, useSelector } from 'react-redux'
import { setResumeConfigration } from '../reducer/resume-reducer'
import { getResumeCustomizationClasses } from '../utils/fontSize'


const AVAILABLE_TEMPLATES = [
    { id: 'ResumeTemplate1', component: ResumeTemplate1 },
    { id: 'ResumeTemplate2', component: ResumeTemplate2 },
    { id: 'ResumeTemplate3', component: ResumeTemplate3 },
    { id: 'ResumeTemplate4', component: ResumeTemplate4 },
    { id: 'ResumeTemplate5', component: ResumeTemplate5 },
    { id: 'ResumeTemplate6', component: ResumeTemplate6 },
    { id: 'ResumeTemplate7', component: ResumeTemplate7 },
];

export default function selectTheme() {
      const searchParams = useSearchParams();
  const id = searchParams.get('id');
    const router = useRouter(); // similar to useNavigate()
    const [activeIndexes, setActiveIndexes] = useState([0, 1, 2])
    const [mobCustomizeSlider, setMobCustomizeSlider] = useState()
    const [loading, setLoading] = useState(false);
    const configuration = useSelector(state => state.resume.resumes.find(resume => resume.id === id)?.configuration || {
        font_style: 'poppins',
        layout_style: 'all',
        color_palette: 'color-2',
        selected_theme: 'ResumeTemplate1',
    });

    // Initialize based on Redux or fallback to default
    const [customizeData, setCustomizeData] = useState({
        ...configuration,
        layout_style: 'all',
    });
    const customizationClasses = getResumeCustomizationClasses(customizeData);



    const handleCustomizationChange = (key, value) => {
        setCustomizeData({
            ...customizeData,
            [key]: value,
        });
    }

    const dispatch = useDispatch();
    const addCustomizeData = () => {

        setLoading(true);
        dispatch(setResumeConfigration({ id: id, data: customizeData }));
        setTimeout(() => {
            setLoading(false);
            router.push(`/resume/personal-info/?id=${id}`);
        }, 2500);
    };

    const toggleIndex = (index) => {
        setActiveIndexes((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        )
    }

    // Close mobile bottom slider close on outside click
    const sliderRef = useRef();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sliderRef.current && !sliderRef.current.contains(event.target)) {
                setMobCustomizeSlider();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Layout Filter
    const filterLayout = (key, value) => {
        setCustomizeData({
            ...customizeData,
            [key]: value,
        });
    }


    return (
        <>
            <section className='select-theme-area'>
                <div className="left-side">
                    <div className='customization-div'>
                        <p className='heading fs-mob-20'>Customization</p>

                        <div className="scroll-div">

                            <div className={`each-collapse-div ${activeIndexes.includes(0) ? 'active' : ''}`}>
                                <button type='button' className='collapse-btn' onClick={() => toggleIndex(0)}>
                                    Font Style Options
                                </button>
                                <div className='collapse-content'>
                                    <label>
                                        <input type="radio" name='fontStyle' checked={customizeData?.font_style === 'poppins'}
                                            onChange={() => handleCustomizationChange('font_style', 'poppins')} hidden />
                                        <div className='radio-btn'></div>
                                        Poppins
                                    </label>
                                    <label>
                                        <input type="radio" name='fontStyle' checked={customizeData?.font_style === 'roboto'}
                                            onChange={() => handleCustomizationChange('font_style', 'roboto')} hidden />
                                        <div className='radio-btn'></div>
                                        Roboto
                                    </label>
                                    <label>
                                        <input type="radio" name='fontStyle' checked={customizeData?.font_style === 'arial'}
                                            onChange={() => handleCustomizationChange('font_style', 'arial')} hidden />
                                        <div className='radio-btn'></div>
                                        Arial
                                    </label>
                                    <label>
                                        <input type="radio" name='fontStyle' checked={customizeData?.font_style === 'montserrat'}
                                            onChange={() => handleCustomizationChange('font_style', 'montserrat')} hidden />
                                        <div className='radio-btn'></div>
                                        Montserrat
                                    </label>
                                </div>
                            </div>

                            <div className={`each-collapse-div ${activeIndexes.includes(1) ? 'active' : ''}`}>
                                <button type='button' className='collapse-btn' onClick={() => toggleIndex(1)}>
                                    Layout Style
                                </button>
                                <div className='collapse-content'>
                                    <label>
                                        <input type="radio" name='layoutStyle' checked={!customizeData?.layout_style || customizeData?.layout_style === 'all'}
                                            onChange={() => filterLayout('layout_style', 'all')} hidden />
                                        <div className='radio-btn'></div>
                                        All
                                    </label>
                                    <label>
                                        <input type="radio" name='layoutStyle' checked={customizeData?.layout_style === 'single-column'}
                                            onChange={() => filterLayout('layout_style', 'single-column')} hidden />
                                        <div className='radio-btn'></div>
                                        Single Column
                                    </label>
                                    <label>
                                        <input type="radio" name='layoutStyle' checked={customizeData?.layout_style === 'two-column'}
                                            onChange={() => filterLayout('layout_style', 'two-column')} hidden />
                                        <div className='radio-btn'></div>
                                        Two Column
                                    </label>
                                </div>
                            </div>

                            <div className={`each-collapse-div ${activeIndexes.includes(2) ? 'active' : ''}`}>
                                <button type='button' className='collapse-btn' onClick={() => toggleIndex(2)}>
                                    Color Palette
                                </button>
                                <div className='collapse-content color-palette-div'>
                                    <label className='color1'>
                                        <input type="radio" name='colorPalette' checked={customizeData?.color_palette === 'color-1'}
                                            onChange={() => handleCustomizationChange('color_palette', 'color-1')} hidden />
                                    </label>
                                    <label className='color2'>
                                        <input type="radio" name='colorPalette' checked={customizeData?.color_palette === 'color-2'}
                                            onChange={() => handleCustomizationChange('color_palette', 'color-2')} hidden />
                                    </label>
                                    <label className='color3'>
                                        <input type="radio" name='colorPalette' checked={customizeData?.color_palette === 'color-3'}
                                            onChange={() => handleCustomizationChange('color_palette', 'color-3')} hidden />
                                    </label>
                                    <label className='color4'>
                                        <input type="radio" name='colorPalette' checked={customizeData?.color_palette === 'color-4'}
                                            onChange={() => handleCustomizationChange('color_palette', 'color-4')} hidden />
                                    </label>
                                    <label className='color5'>
                                        <input type="radio" name='colorPalette' checked={customizeData?.color_palette === 'color-5'}
                                            onChange={() => handleCustomizationChange('color_palette', 'color-5')} hidden />
                                    </label>
                                    <label className='color6'>
                                        <input type="radio" name='colorPalette' checked={customizeData?.color_palette === 'color-6'}
                                            onChange={() => handleCustomizationChange('color_palette', 'color-6')} hidden />
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="right-side py-custom">
                    <div className="container-fluid custom-container ps-3 ps-md-4 ps-md-0">
                        <div className='resume-select-headings'>
                            <h1 className='fs-mob-24'>Choose Your Resume Template</h1>
                            <p>Select a professionally designed resume template</p>
                        </div>
                        <div className="row">
                            {AVAILABLE_TEMPLATES.filter(template => !customizeData?.layout_style || customizeData?.layout_style === 'all' || template.component.layoutStyle === customizeData?.layout_style).map((template) => {
                                const TemplateComponent = template.component;
                                return (
                                    <div key={template.id} className={`col-md-4 mb-3 ${customizeData?.selected_theme === template.id ? 'active' : ''}`}>
                                        <label className='each-resume-label'>
                                            <input type="radio" name="selectResume" checked={customizeData?.selected_theme === template.id}
                                                onChange={() => handleCustomizationChange('selected_theme', template.id)} hidden />
                                            <img src="/front-assets/images/icons/resume-selected.svg" className='img-fluid resume-selected-icon' alt="Checked" />
                                            <TemplateComponent isStatic={true} additionalClass={customizationClasses} />
                                        </label>
                                    </div>
                                );
                            })}
                        </div>

                        <div className='use-template-btn-div custom-container'>
                            <div className='mob-customize-btn d-md-none' onClick={() => setMobCustomizeSlider('open')}>
                                <img src="/front-assets/images/icons/customization.svg" width={30} height={30} alt="Setting" />
                            </div>
                            <button className='next-button m-0' onClick={addCustomizeData}>Use this template</button>
                        </div>
                    </div>
                </div>

                <div ref={sliderRef} className={`mob-customization-slider d-md-none ${mobCustomizeSlider === 'open' ? 'open' : ''}`}>
                    <div className='header'>
                        Customization
                        <img src="/front-assets/images/icons/close-cross.svg" onClick={() => setMobCustomizeSlider()} alt="Close" />
                    </div>
                    <div className="scroll-div">

                        <div className={`each-collapse-div ${activeIndexes.includes(0) ? 'active' : ''}`}>
                            <button type='button' className='collapse-btn' onClick={() => toggleIndex(0)}>
                                Font Style Options
                            </button>
                            <div className='collapse-content'>
                                <label>
                                    <input type="radio" name='fontStyleMob' checked={customizeData?.font_style === 'poppins'}
                                        onChange={() => handleCustomizationChange('font_style', 'poppins')} hidden />
                                    <div className='radio-btn'></div>
                                    Poppins
                                </label>
                                <label>
                                    <input type="radio" name='fontStyleMob' checked={customizeData?.font_style === 'roboto'}
                                        onChange={() => handleCustomizationChange('font_style', 'roboto')} hidden />
                                    <div className='radio-btn'></div>
                                    Roboto
                                </label>
                                <label>
                                    <input type="radio" name='fontStyleMob' checked={customizeData?.font_style === 'arial'}
                                        onChange={() => handleCustomizationChange('font_style', 'arial')} hidden />
                                    <div className='radio-btn'></div>
                                    Arial
                                </label>
                                <label>
                                    <input type="radio" name='fontStyleMob' checked={customizeData?.font_style === 'montserrat'}
                                        onChange={() => handleCustomizationChange('font_style', 'montserrat')} hidden />
                                    <div className='radio-btn'></div>
                                    Montserrat
                                </label>
                            </div>
                        </div>

                        <div className={`each-collapse-div ${activeIndexes.includes(1) ? 'active' : ''}`}>
                            <button type='button' className='collapse-btn' onClick={() => toggleIndex(1)}>
                                Layout Style
                            </button>
                            <div className='collapse-content'>
                                <label>
                                    <input type="radio" name='layoutStyleMob' checked={!customizeData?.layout_style || customizeData?.layout_style === 'all'}
                                        onChange={() => filterLayout('layout_style', 'all')} hidden />
                                    <div className='radio-btn'></div>
                                    All
                                </label>
                                <label>
                                    <input type="radio" name='layoutStyleMob' checked={customizeData?.layout_style === 'single-column'}
                                        onChange={() => filterLayout('layout_style', 'single-column')} hidden />
                                    <div className='radio-btn'></div>
                                    Single Column
                                </label>
                                <label>
                                    <input type="radio" name='layoutStyleMob' checked={customizeData?.layout_style === 'two-column'}
                                        onChange={() => filterLayout('layout_style', 'two-column')} hidden />
                                    <div className='radio-btn'></div>
                                    Two Column
                                </label>
                            </div>
                        </div>

                        <div className={`each-collapse-div ${activeIndexes.includes(2) ? 'active' : ''}`}>
                            <button type='button' className='collapse-btn' onClick={() => toggleIndex(2)}>
                                Color Palette
                            </button>
                            <div className='collapse-content color-palette-div'>
                                <label className='color1'>
                                    <input type="radio" name='colorPaletteMob' checked={customizeData?.color_palette === 'color-1'}
                                        onChange={() => handleCustomizationChange('color_palette', 'color-1')} hidden />
                                </label>
                                <label className='color2'>
                                    <input type="radio" name='colorPaletteMob' checked={customizeData?.color_palette === 'color-2'}
                                        onChange={() => handleCustomizationChange('color_palette', 'color-2')} hidden />
                                </label>
                                <label className='color3'>
                                    <input type="radio" name='colorPaletteMob' checked={customizeData?.color_palette === 'color-3'}
                                        onChange={() => handleCustomizationChange('color_palette', 'color-3')} hidden />
                                </label>
                                <label className='color4'>
                                    <input type="radio" name='colorPaletteMob' checked={customizeData?.color_palette === 'color-4'}
                                        onChange={() => handleCustomizationChange('color_palette', 'color-4')} hidden />
                                </label>
                                <label className='color5'>
                                    <input type="radio" name='colorPaletteMob' checked={customizeData?.color_palette === 'color-5'}
                                        onChange={() => handleCustomizationChange('color_palette', 'color-5')} hidden />
                                </label>
                                <label className='color6'>
                                    <input type="radio" name='colorPaletteMob' checked={customizeData?.color_palette === 'color-6'}
                                        onChange={() => handleCustomizationChange('color_palette', 'color-6')} hidden />
                                </label>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

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
        </>
    )
}
