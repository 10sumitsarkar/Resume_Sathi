'use client';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getApiBase } from '../lib/apiConfig';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`${getApiBase()}/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        setFeedback({
          type: 'error',
          message: `We couldn't read the server response (HTTP ${response.status}). Please try again.`,
        });
        return;
      }

      if (!response.ok) {
        setFeedback({
          type: 'error',
          message: result.errors?.email?.[0] || result.message || 'We could not subscribe you. Please try again.',
        });
        return;
      }

      setEmail('');
      setFeedback(null);
      toast.success(
        <div className="rk-newsletter-toast">
          <strong>Thank you for subscribing!</strong>
          <span>
            {result.email_sent === true
              ? 'Confirmation email sent.'
              : 'Confirmation email could not be sent.'}
          </span>
        </div>,
        {
          autoClose: 4000,
          closeOnClick: true,
        },
      );
    } catch {
      setFeedback({
        type: 'error',
        message: 'We could not connect to the subscription service. Please try again in a moment.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <ToastContainer position="bottom-center" />
      <section className="newsletter-footer container-fluid rk-footer-newsletter" aria-labelledby="rk-newsletter-heading">
        <div className="rk-newsletter-content">
          <span className="rk-newsletter-eyebrow">A little career boost</span>
          <h2 className="heading fs-mob-22" id="rk-newsletter-heading">
            Sign up to our newsletter to receive updates
          </h2>
          <p className="subheading fs-mob-16">
            Stay informed with the latest career advice, exam updates, and practical resources delivered to your inbox.
          </p>

          <form className="form-group rk-newsletter-form" onSubmit={handleSubmit}>
            <label className="rk-newsletter-label" htmlFor="rk-newsletter-email">Email address</label>
            <div className="rk-newsletter-input-wrap">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M3 5.75A2.75 2.75 0 0 1 5.75 3h12.5A2.75 2.75 0 0 1 21 5.75v12.5A2.75 2.75 0 0 1 18.25 21H5.75A2.75 2.75 0 0 1 3 18.25V5.75Zm2 .3v.28l7 5.25 7-5.25v-.28A.75.75 0 0 0 18.25 5H5.75A.75.75 0 0 0 5 5.75Zm14 2.78-6.4 4.8a1 1 0 0 1-1.2 0L5 8.83v9.42c0 .41.34.75.75.75h12.5c.41 0 .75-.34.75-.75V8.83Z" />
              </svg>
              <input
                id="rk-newsletter-email"
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email address"
                autoComplete="email"
                maxLength={255}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={isSubmitting}
                aria-describedby={feedback ? 'rk-newsletter-feedback' : 'rk-newsletter-note'}
              />
            </div>
            <button type="submit" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</span>
              {!isSubmitting && (
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M4.75 11a1 1 0 1 0 0 2h10.79l-3.27 3.27a1 1 0 1 0 1.41 1.42l4.98-4.98a1 1 0 0 0 0-1.42l-4.98-4.98a1 1 0 0 0-1.41 1.42L15.54 11H4.75Z" />
                </svg>
              )}
            </button>
          </form>

          {feedback ? (
            <p
              className={`rk-newsletter-feedback is-${feedback.type}`}
              id="rk-newsletter-feedback"
              role={feedback.type === 'error' ? 'alert' : 'status'}
              aria-live="polite"
            >
              {feedback.message}
            </p>
          ) : (
            <p className="rk-newsletter-note" id="rk-newsletter-note">
              No spam, ever. Just useful updates.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
