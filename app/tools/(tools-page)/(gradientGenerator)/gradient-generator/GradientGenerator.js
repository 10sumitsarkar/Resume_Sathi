'use client';

import dynamic from 'next/dynamic';
const SketchPicker = dynamic(() => import('./components/SketchPickerClient'), { ssr: false });

import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import '../../../tools-css/gradientGenerator.css';
import Link from 'next/link';
import CustomInput from '../../../../components/CustomInput/CustomInput';

export default function GradientGenerator() {
  const [colorCount, setColorCount] = useState(2);
  const [colorStops, setColorStops] = useState([]);
  const [gradientType, setGradientType] = useState('linear');
  const [direction, setDirection] = useState('to right');
  const [gradientCSS, setGradientCSS] = useState('Wait...');
  const [copyIcon, setCopyIcon] = useState(
    '/front-assets/images/icons/copy-text.svg'
  );

  const [selectedStopIndex, setSelectedStopIndex] = useState(0);
  const [sketchColor, setSketchColor] = useState({
    r: 144,
    g: 77,
    b: 178,
    a: 1,
  });

  const parseRGBA = (rgbaStr) => {
    const [r, g, b, a] = rgbaStr.match(/[\d.]+/g).map(Number);
    return { r, g, b, a: a ?? 1 };
  };

  useEffect(() => {
    if (colorStops.length > 0) {
      const currentColor = colorStops[selectedStopIndex]?.color || colorStops[0].color;
      setSketchColor(parseRGBA(currentColor));
    }
  }, [colorStops, selectedStopIndex]);

  useEffect(() => {
    generateRandomGradient();
  }, [colorCount]);

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  };

  const generateRandomGradient = () => {
    if (colorCount < 2 || colorCount > 5) return;
    const newColorStops = Array.from({ length: colorCount }).map((_, i) => ({
      color: getRandomColor(),
      position: parseFloat((i / (colorCount - 1)).toFixed(2)),
    }));
    setColorStops(newColorStops);
  };

  const updateColorStop = (index, newColor, newPosition) => {
    setColorStops((prev) => {
      const updated = [...prev];
      if (newColor !== null) updated[index].color = newColor;
      if (newPosition !== null) updated[index].position = parseFloat(newPosition);
      return [...updated];
    });
  };

  const removeColorStop = (indexToRemove) => {
    if (colorStops.length <= 2) return;
    const updated = colorStops.filter((_, index) => index !== indexToRemove);
    setColorStops(updated);

    if (indexToRemove === selectedStopIndex) {
      setSelectedStopIndex(0);
    } else if (indexToRemove < selectedStopIndex) {
      setSelectedStopIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (colorStops.length < 2) return;
    const stopsString = colorStops
      .map((stop) => `${stop.color} ${Math.floor(stop.position * 100)}%`)
      .join(', ');
    const css =
      gradientType === 'linear'
        ? `linear-gradient(${direction}, ${stopsString})`
        : `radial-gradient(circle, ${stopsString})`;
    setGradientCSS(css);
  }, [colorStops, gradientType, direction]);

  const handleCopy = () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(`background: ${gradientCSS}`).then(() => {
          setCopyIcon('/front-assets/images/icons/tick.svg');
          setTimeout(() => {
            setCopyIcon('/front-assets/images/icons/copy-text.svg');
          }, 1500);
        });
      } else {
        // Fallback for insecure context or unsupported clipboard API (mostly on mobile)
        const textarea = document.createElement("textarea");
        textarea.value = `background: ${gradientCSS}`;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (successful) {
          setCopyIcon('/front-assets/images/icons/tick.svg');
          setTimeout(() => {
            setCopyIcon('/front-assets/images/icons/copy-text.svg');
          }, 1500);
        } else {
          throw new Error("Fallback copy failed");
        }
      }

      toast.success('Copied! successfully.', {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: false,
        theme: "light",
        hideProgressBar: true,
      });


    } catch (err) {
      console.error("Copy failed:", err);
      toast.error('Failed to copy.', {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: false,
        theme: "light",
      });
    }
  };


  const addColorStop = () => {
    if (colorStops.length >= 5) return;
    const newColorStops = [...colorStops, { color: getRandomColor(), position: 1 }];
    const updatedStops = newColorStops.map((stop, i) => ({
      ...stop,
      position: parseFloat((i / (newColorStops.length - 1)).toFixed(2)),
    }));
    setColorStops(updatedStops);
  };


  // When scroll in mobile then add class 'scrolled' in gradient box
  const boxRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!boxRef.current) return;

      const isMobile = window.innerWidth < 567;
      const scrollY = window.scrollY;

      const shouldBeScrolled = isMobile && scrollY > 5 && scrollY <= 915;

      // Remove class when scrollY > 915
      if (scrollY > 915) {
        boxRef.current.classList.remove('scrolled');
        setScrolled(false);
        return;
      }

      // Avoid class toggling if the state is the same
      if (shouldBeScrolled !== scrolled) {
        setScrolled(shouldBeScrolled);
        boxRef.current.classList.toggle('scrolled', shouldBeScrolled);
      }

      // Optional: remove class if screen is wider
      if (!isMobile) {
        boxRef.current.classList.remove('scrolled');
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    handleScroll(); // initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [scrolled]);


  return (

    <>
      <div className='gradient-main-box-area' ref={boxRef}>
        <div className="gradient-main-box" style={{ background: gradientCSS }}>
          <button type='button' className="copy-btn transformCopyTxtBtn" title="Copy CSS" onClick={handleCopy}>
            <img src={copyIcon} alt="Copy" width="24" height="24" />
          </button>
        </div>
      </div>


      <div className='tools-right-div custom-container pb-mob-100'>
      <div className='gradient-all-colors-div p-4'>
            <div className='top-customize-div'>
              <div className='gradient-type-div'>
                <label className='each-gradient-type-label'>
                  <input type="radio" name="gradientType" value="linear" onChange={(e) => setGradientType(e.target.value)} checked={gradientType === "linear"} hidden />
                  Linear
                </label>
                <label className='each-gradient-type-label'>
                  <input type="radio" value="radial" name="gradientType" onChange={(e) => setGradientType(e.target.value)} checked={gradientType === "radial"} hidden />
                  Radial
                </label>
              </div>

              <div className='direction-select'>
                <div>
                  <div className='direction-icon'>
                    <span>
                      {direction === 'to right' ? '→' : ''}
                      {direction === 'to left' ? '←' : ''}
                      {direction === 'to bottom' ? '↓' : ''}
                      {direction === 'to top' ? '↑' : ''}
                      {direction === 'to top right' ? '↗' : ''}
                      {direction === 'to bottom right' ? '↘' : ''}
                      {direction === 'to top left' ? '↖' : ''}
                      {direction === 'to bottom left' ? '↙' : ''}
                    </span>
                  </div>
                </div>
                <CustomInput
                  type="select"
                  options={[
                    { value: 'to right', label: 'Right' },
                    { value: 'to left', label: 'Left' },
                    { value: 'to bottom', label: 'Bottom' },
                    { value: 'to top', label: 'Top' },
                    { value: 'to top right', label: 'Top Right' },
                    { value: 'to bottom right', label: 'Bottom Right' },
                    { value: 'to top left', label: 'Top Left' },
                    { value: 'to bottom left', label: 'Bottom Left' },
                  ]}
                  value={direction}
                  onChange={(v) => setDirection(v)}
                  disabled={gradientType !== 'linear'}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-7">
                <SketchPicker
                  color={sketchColor}
                  onChange={(color) => {
                    setSketchColor(color.rgb);
                    const rgbaString = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
                    updateColorStop(selectedStopIndex, rgbaString, null);
                  }}
                />
              </div>

              <div className="col-md-5 order-first order-md-last">
                <div className="generate-gradient-buttons-div mb-3 mb-md-0">
                  <div className='total-color-label-div'>
                    <label htmlFor="colorCount">STOPS</label>


                    <div className='d-flex align-items-center gap-3'>
                      <button className="random-gradient-btn" title="Random Gradient" onClick={generateRandomGradient}>
                        <img src="/front-assets/images/icons/reload.svg" width="27" height="27" alt="Reload" />
                      </button>
                      <button type='button' className={`add-btn ${colorStops.length < 5 ? '' : 'disabled'}`} onClick={addColorStop}>
                        Add +
                      </button>
                    </div>
                  </div>

                  <div id="colorStopsContainer">
                    {colorStops.map((stop, index) => {
                      const percent = Math.floor(stop.position * 100);
                      const background = `linear-gradient(90deg, ${stop.color} ${percent}%,rgb(255, 255, 255) ${percent + 0.1}%)`;

                      return (
                        <div className={`color-stop-container ${selectedStopIndex === index ? 'selected' : ''}`} key={index} onClick={() => setSelectedStopIndex(index)}>
                          <div>
                            <div
                              className={`custom-color-box ${selectedStopIndex === index ? 'selected' : ''}`}
                              style={{ backgroundColor: stop.color }}
                              onClick={() => {
                                setSelectedStopIndex(index);
                                setSketchColor(parseRGBA(stop.color));
                              }}
                            ></div>
                          </div>

                          <div className="color-stop-slider-div">
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={stop.position}
                              className="range-slider__range"
                              onChange={(e) => updateColorStop(index, null, e.target.value)}
                              style={{ background }}
                            />
                            <span style={{ left: `${percent}%`, display: "block" }}>{percent}%</span>
                          </div>

                          <button type='button' onClick={() => removeColorStop(index)} title="Remove Color" className={`remove-color-btn ${colorStops.length > 2 ? '' : 'disabled'}`}>
                            <img src="/front-assets/images/icons/cancel.svg" alt="Remove" width="24" height="24" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 generated-gradient-code" id="gradientCode">
            <span>background:</span> {gradientCSS}
            <button type='button' className="bottom-copy-btn" title="Copy CSS" onClick={handleCopy}>
              <img src={copyIcon} alt="Copy" width="24" height="24" />
              {copyIcon === "/front-assets/images/icons/copy-text.svg" ? "Copy to clipboard" : "Copied! to clipboard"}
            </button>

          </div>

          <div className="tools-details-div">
            <h1>CSS Gradient Generator &ndash; Create Stunning Backgrounds Online</h1>
            <p>Design eye-catching CSS gradients with this free tool,gradient generator effect which works in a browser. That's right&mdash;you don't have to write any code to use this tool. It works for designers, developers, and people who are just looking for color ideas.</p>
            <h2>Features of this Tool</h2>
            <ul>
              <li><b>Instant Gradient Preview:</b> You can see changes instantly when you change the colors and colors stop.</li>
              <li><b>Linear & Radial Gradients:</b> With just one click, you can switch between linear and radial gradient. The tools are easy to use and also allow you to change the color direction</li>
              <li><b>Add Up to 5 Color Stops:</b> Create gradients with up to five color stops. Set each stop's position and color easily.</li>
              <li><b>Random Gradient Generator:</b> Need idea? Click on the randomizer button and explore unique color combinations automatically.</li>
              <li><b>One-Click CSS Copy</b> Generate and copy the final CSS code with one click. Fully Responsive</li>
            </ul>
            <blockquote>
              <p>This tool works perfectly on all devices, including smartphones and tablets&mdash;designed with mobile users in mind.</p>
            </blockquote>
            <h2>Where You Can Use It</h2>
            <ul>
              <li>Stylish website backgrounds</li>
              <li>Gradient buttons and hover effects</li>
              <li>Hero sections, cards, and banners</li>
              <li>UI design inspiration for apps and landing page</li>
            </ul>
            <h2>Perfect Fit For</h2>
            <p>This gradient tool is ideal for:</p>
            <ul>
              <li>Web developers and UI designer</li>
              <li>Front-end designers and CSS enthusiasts</li>
              <li>Creatives exploring color theory or visual design</li>
            </ul>
            <h2>Why Users Choose This Tool</h2>
            <ul>
              <li>No signup or any installation required</li>
              <li>Easy to use color picker with opacity control</li>
              <li>Interactive sliders for gradient control</li>
              <li>Clear and clean interface</li>
              <li>Absolutely free to use</li>
            </ul>
            <h2>Creating Beautiful Gradients Now</h2>
            <p>Use this tool to create vibrant, responsive CSS gradients which bring your web designs to life, spark creativity, and save you time.</p>
            <p>With just a few clicks, you can create your next amazing background.</p>
          </div>
          <div className="newsletter-footer container-fluid">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <div className="heading fs-mob-22">
                  Sign up to our newsletter to receive updates
                </div>
                <div className="subheading fs-mob-16">
                  Stay informed with the latest news, insights, and updates delivered right to your inbox.
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-8 col-md-6">
                <div className="form-group">
                  <input type="email" className="form-control" placeholder="Enter your email" />
                  <button type="submit">Subscribe</button>
                </div>
              </div>
            </div>

            <div className="social-icons">
              <a href="#" target="_blank" rel="nofollow">
                {/* Instagram Icon */}
                <svg viewBox="0 0 512 512">
                  <path d="M363.273,0H148.728C66.719,0,0,66.719,0,148.728v214.544C0,445.281,66.719,512,148.728,512h214.544C445.281,512,512,445.281,512,363.273V148.728C512,66.719,445.281,0,363.273,0z M472,363.272C472,423.225,423.225,472,363.273,472H148.728C88.775,472,40,423.225,40,363.273V148.728C40,88.775,88.775,40,148.728,40h214.544C423.225,40,472,88.775,472,148.728V363.272z" />
                  <path d="M256,118c-76.094,0-138,61.906-138,138s61.906,138,138,138s138-61.906,138-138S332.094,118,256,118z M256,354c-54.037,0-98-43.963-98-98s43.963-98,98-98s98,43.963,98,98S310.037,354,256,354z" />
                  <circle cx="396" cy="116" r="20" />
                </svg>
              </a>

              <a href="#" target="_blank" rel="nofollow">
                {/* Facebook Icon */}
                <svg viewBox="0 0 24 24">
                  <path d="m15.997 3.985h2.191v-3.816c-.378-.052-1.678-.169-3.192-.169-3.159 0-5.323 1.987-5.323 5.639v3.361h-3.486v4.266h3.486v10.734h4.274v-10.733h3.345l.531-4.266h-3.877v-2.939c.001-1.233.333-2.077 2.051-2.077z" />
                </svg>
              </a>

              <a href="#" target="_blank" rel="nofollow">
                {/* LinkedIn Icon */}
                <svg viewBox="0 0 24 24">
                  <path d="m23.994 24v-.001h.006v-8.802c0-4.306-.927-7.623-5.961-7.623-2.42 0-4.044 1.328-4.707 2.587h-.07v-2.185h-4.773v16.023h4.97v-7.934c0-2.089.396-4.109 2.983-4.109 2.549 0 2.587 2.384 2.587 4.243v7.801z" />
                  <path d="m.396 7.977h4.976v16.023h-4.976z" />
                  <path d="m2.882 0c-1.591 0-2.882 1.291-2.882 2.882s1.291 2.909 2.882 2.909 2.882-1.318 2.882-2.909c-.001-1.591-1.292-2.882-2.882-2.882z" />
                </svg>
              </a>

              <a href="#" target="_blank" rel="nofollow">
                {/* Twitter Icon */}
                <svg viewBox="0 0 512 512">
                  <path d="M512,97.248c-19.04,8.352-39.328,13.888-60.48,16.576c21.76-12.992,38.368-33.408,46.176-58.016c-20.288,12.096-42.688,20.64-66.56,25.408C411.872,60.704,384.416,48,354.464,48c-58.112,0-104.896,47.168-104.896,104.992c0,8.32,0.704,16.32,2.432,23.936c-87.264-4.256-164.48-46.08-216.352-109.792c-9.056,15.712-14.368,33.696-14.368,53.056c0,36.352,18.72,68.576,46.624,87.232c-16.864-0.32-33.408-5.216-47.424-12.928c0,0.32,0,0.736,0,1.152c0,51.008,36.384,93.376,84.096,103.136c-8.544,2.336-17.856,3.456-27.52,3.456c-6.72,0-13.504-0.384-19.872-1.792c13.6,41.568,52.192,72.128,98.08,73.12c-35.712,27.936-81.056,44.768-130.144,44.768c-8.608,0-16.864-0.384-25.12-1.44C46.496,446.88,101.6,464,161.024,464c193.152,0,298.752-160,298.752-298.688c0-4.64-0.16-9.12-0.384-13.568C480.224,136.96,497.728,118.496,512,97.248z" />
                </svg>
              </a>
            </div>
          </div>

          <footer className="footer-bottom d-none d-md-flex">
            <div>
              © {new Date().getFullYear()} toolsAdda. All rights reserved.
            </div>
            <div>
              <Link prefetch={false} href="/terms" className="text-decoration-none text-muted">Terms & Conditions</Link> |
              <Link prefetch={false} href="/privacy" className="text-decoration-none text-muted"> Privacy Policy</Link>
            </div>
          </footer>

        <ToastContainer />
      </div>
    </>

  );
}
