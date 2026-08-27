'use client';

import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import '../../../tools-css/animate.min.css';
import '../../../tools-css/css-animation.css';
import CustomInput from '../../../../components/CustomInput/CustomInput';
import Link from 'next/link';

export default function AnimationPreview() {
  const animations = {
    attentionSeekers: [
      'bounce', 'flash', 'pulse', 'rubberBand', 'shakeX', 'shakeY',
      'headShake', 'swing', 'tada', 'wobble', 'jello', 'heartBeat'
    ],
    fadingEntrances: ['fadeIn', 'fadeInDown', 'fadeInLeft', 'fadeInRight', 'fadeInUp'],
    flippers: ['flip', 'flipInX', 'flipInY'],
    lightspeed: ['lightSpeedInRight', 'lightSpeedInLeft'],
    rotatingEntrances: ['rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight'],
    zoomEntrances: ['zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp'],
  };

  const [category, setCategory] = useState('attentionSeekers');
  const [selectedAnimation, setSelectedAnimation] = useState(animations['attentionSeekers'][0]);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    setSelectedAnimation(animations[category][0]);
  }, [category]);

  const copyToClipboard = () => {
    const code = `<h1 class="animate__animated animate__${selectedAnimation}">Example Text</h1>`;
    navigator.clipboard.writeText(code).then(() => {
      setCodeCopied(true);
      toast.success('Copied! successfully.', {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: false,
        theme: "light",
        hideProgressBar: true,
      });
      setTimeout(() => setCodeCopied(false), 3500);
    });
  };

  return (
    <div className='tools-right-div custom-container pb-mob-100'>
      <div className='css-animation-tool mt-5'>

        <div className="text-select-divs">
          <CustomInput
            type="select"
            options={Object.keys(animations).map((cat) => ({ value: cat, label: cat.replace(/([A-Z])/g, ' $1').trim() }))}
            value={category}
            onChange={(v) => setCategory(v)}
          />

          <CustomInput
            type="select"
            options={animations[category].map((anim) => ({ value: anim, label: anim }))}
            value={selectedAnimation}
            onChange={(v) => setSelectedAnimation(v)}
          />
        </div>
        <div className="animate-preview-output-area">


          <div id="animatedText" className={`animate__animated animate__${selectedAnimation} animate__infinite fs-mob-24`}>
            ResumeSathi
          </div>
        </div>



        <div className="mt-3 animation-css-code">
          {`<h1 class="animate__animated animate__${selectedAnimation}">Example Text</h1>`}
          <button type='button' className="bottom-copy-btn" title="Copy CSS" onClick={copyToClipboard}>
            {codeCopied ? (
              <>
                <img src="/front-assets/images/icons/tick.svg" alt="Copied" width={24} height={24} />Copied! to clipboard
              </>
            ) : (
              <>
                <img src="/front-assets/images/icons/copy-text.svg" alt="Copied" width={24} height={24} />Copy to clipboard</>
            )}

          </button>

        </div>

        <div className="tools-details-div">
          <h1>Animation.css Preview</h1>
          <p>Easily apply stunning animations to your elements using Animate.css! Simply add the appropriate classes to your HTML elements and see the effects in action.</p>

          <p className='text-with-head'>Add the following link inside the <code>&lt;head&gt;</code> tag of your HTML file.</p>
          <code className='full-code'>
            {`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">`}
          </code>
          <h2>Core Classes (Required for Animations)</h2>
          <ul>
            <li><b>animate__animated → </b> Always required to apply animations.</li>
            <li><b>animate__infinite →</b> Loops the animation infinitely.</li>
            <li><b>animate__repeat-1, animate__repeat-2, animate__repeat-3 →</b> Controls the number of animation repeats.</li>
            <li><b>animate__delay-1s, animate__delay-2s, animate__delay-3s →</b> Adds a delay before the animation starts.</li>
            <li><b>animate__faster, animate__fast, animate__slow, animate__slower →</b> Controls the animation speed.</li>
          </ul>
          <blockquote>
            <p>This tool works perfectly on all devices, including smartphones and tablets&mdash;designed with mobile users in mind.</p>
          </blockquote>

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
            <Link prefetch={false} href="/terms-and-conditions/" className="text-decoration-none text-muted">Terms & Conditions</Link> |
            <Link prefetch={false} href="/privacy-policy/" className="text-decoration-none text-muted"> Privacy Policy</Link>
          </div>
        </footer>
      </div>

      <ToastContainer />
    </div>
  );
}
