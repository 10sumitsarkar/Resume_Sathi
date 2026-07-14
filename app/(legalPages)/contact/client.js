'use client';

import React, { useState, useEffect, useCallback } from 'react';
import NavBar from '../../components/NavBar';
import FooterNav from '../../components/FooterNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../legal-pages.css';

const CONTACT_EMAIL = 'support@resumesathi.com';
const CONTACT_PHONE = '+91 00000 00000';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const CONTACT_API_ENDPOINT = `${API_BASE_URL}/api/contact`;

const INITIAL_STATE = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

// Generates a fresh, simple math challenge
const generateCaptcha = () => {
  const a = Math.floor(Math.random() * 9) + 1; // 1-9
  const b = Math.floor(Math.random() * 9) + 1; // 1-9
  return { a, b, answer: a + b };
};

export default function ContactClient() {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ---- Captcha state ----
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
  }, []);

  const handleVerifyCaptcha = (e) => {
    e.preventDefault();
    if (captchaInput.trim() === '') {
      setCaptchaError('Please solve the sum to continue.');
      return;
    }
    if (Number(captchaInput.trim()) === captcha.answer) {
      setCaptchaVerified(true);
      setCaptchaError('');
    } else {
      setCaptchaError('That’s not quite right — try the new sum below.');
      refreshCaptcha();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim()) {
      next.name = 'Please enter your name.';
    }

    if (!form.email.trim()) {
      next.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Please enter a valid email address.';
    }

    if (!form.message.trim()) {
      next.message = 'Please enter your message.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const applyServerErrors = (serverErrors) => {
    if (!serverErrors) return;
    const mapped = {};
    Object.keys(serverErrors).forEach((key) => {
      const val = serverErrors[key];
      mapped[key] = Array.isArray(val) ? val[0] : val;
    });
    setErrors((prev) => ({ ...prev, ...mapped }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extra guard — should not normally trigger since form is locked pre-verify
    if (!captchaVerified) {
      toast.error('Please verify the captcha before sending your message.', {
        position: 'top-right',
        autoClose: 4000,
        closeOnClick: false,
        theme: 'light',
      });
      return;
    }

    if (!validate()) return;

    setSubmitting(true);

    try {
      const res = await fetch(CONTACT_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          message: form.message.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.status === 422) {
        applyServerErrors(data?.errors);
        toast.error('Please fix the highlighted fields and try again.', {
          position: 'top-right',
          autoClose: 4000,
          closeOnClick: false,
          theme: 'light',
        });
        return;
      }

      if (!res.ok) {
        throw new Error(data?.message || 'Something went wrong. Please try again.');
      }

      toast.success(data?.message || 'Your message has been sent successfully!', {
        position: 'top-right',
        autoClose: 4000,
        closeOnClick: false,
        theme: 'light',
      });

      setForm(INITIAL_STATE);
      setErrors({});
      // Lock the form again and issue a fresh captcha for the next message
      setCaptchaVerified(false);
      refreshCaptcha();
    } catch (err) {
      console.error('Contact form submission failed:', err);
      toast.error(
        err.message || 'Unable to send your message right now. Please try again later.',
        { position: 'top-right', autoClose: 4000, closeOnClick: false, theme: 'light' }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />

      <section className="lp-hero">
        <div className="container-fluid custom-container">
          <span className="lp-eyebrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            We&rsquo;d Love to Hear From You
          </span>
          <h1>Contact Us</h1>
          <p>
            Questions, feedback, or partnership ideas — send us a message and our team will
            get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section className="lp-body">
        <div className="container-fluid custom-container">
          <div className="ct-grid">
            <div className="ct-info-card">
              <h3>Get in Touch</h3>

              <div className="ct-info-row">
                <div className="ct-info-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <p className="ct-info-label">Email</p>
                  <p className="ct-info-value">
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </p>
                </div>
              </div>

              <div className="ct-info-row d-none">
                <div className="ct-info-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 9.81a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 7.91a16 16 0 0 0 5.45 5.45l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14.92z" />
                  </svg>
                </div>
                <div>
                  <p className="ct-info-label">Phone</p>
                  <p className="ct-info-value">
                    <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`}>{CONTACT_PHONE}</a>
                  </p>
                </div>
              </div>

              <div className="ct-info-row">
                <div className="ct-info-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 4.418-8 12-8 12S4 14.418 4 10a8 8 0 0 1 16 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="ct-info-label">Location</p>
                  <p className="ct-info-value">India</p>
                </div>
              </div>

              <div className="ct-info-row">
                <div className="ct-info-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <p className="ct-info-label">Response Time</p>
                  <p className="ct-info-value">Within 24–48 hours</p>
                </div>
              </div>
            </div>

            <div className="ct-form-card">
              <h3>Send a Message</h3>
              <p>Fill out the form below and we&rsquo;ll respond to your email directly.</p>

              {/* ---------------- CAPTCHA GATE ---------------- */}
              {!captchaVerified && (
                <div className="ct-captcha-box">
                  <div className="ct-captcha-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="ct-captcha-body">
                    <p className="ct-captcha-title">Quick check before you write to us</p>
                    <p className="ct-captcha-sub">
                      Solve this to unlock the form &mdash; helps us keep spam out.
                    </p>

                    <div className="ct-captcha-row">
                      <span className="ct-captcha-sum">
                        {captcha.a} + {captcha.b} =
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={captchaInput}
                        onChange={(e) => {
                          setCaptchaInput(e.target.value);
                          if (captchaError) setCaptchaError('');
                        }}
                        placeholder="?"
                        className="ct-captcha-input"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleVerifyCaptcha(e);
                        }}
                      />
                      <button
                        type="button"
                        className="ct-captcha-verify-btn"
                        onClick={handleVerifyCaptcha}
                      >
                        Verify
                      </button>
                    </div>

                    {captchaError && <p className="ct-error">{captchaError}</p>}
                  </div>
                </div>
              )}

              {captchaVerified && (
                <div className="ct-captcha-verified">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Verified — you can fill the form now
                </div>
              )}

              <fieldset
                disabled={!captchaVerified}
                className={`ct-fieldset ${!captchaVerified ? 'ct-fieldset--locked' : ''}`}
              >
                <form onSubmit={handleSubmit} noValidate>
                  <div className="ct-row-2">
                    <div className="ct-field">
                      <label htmlFor="ct-name">Your Name <span className='text-danger'>*</span></label>
                      <input
                        id="ct-name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="ct-error">{errors.name}</p>}
                    </div>

                    <div className="ct-field">
                      <label htmlFor="ct-email">Your Email <span className='text-danger'>*</span></label>
                      <input
                        id="ct-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                      />
                      {errors.email && <p className="ct-error">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="ct-row">
                    <div className="ct-field">
                      <label htmlFor="ct-phone">Phone Number (optional)</label>
                      <input
                        id="ct-phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 00000 00000"
                      />
                      {errors.phone && <p className="ct-error">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="ct-field">
                    <label htmlFor="ct-message">Message <span className='text-danger'>*</span></label>
                    <textarea
                      id="ct-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                    />
                    {errors.message && <p className="ct-error">{errors.message}</p>}
                  </div>

                  <button type="submit" className="ct-submit-btn" disabled={submitting || !captchaVerified}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </fieldset>
            </div>
          </div>
        </div>
      </section>

      <FooterNav />
      <ToastContainer />
    </>
  );
}