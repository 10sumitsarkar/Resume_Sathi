// components/Footer.jsx

import Link from "next/link";
import NewsletterSignup from "./NewsletterSignup";

export default function Footer() {
  return (
    <>
    <NewsletterSignup />
    <footer className="rk-footer">
      <div className="container-fluid custom-container rk-footer-inner">
        <div className="rk-footer-brand">
          <div className="rk-logo">
            <img
              src="/front-assets/images/logo/logo.svg"
              className="img-fluid nav-logo"
              width={200}
              height={35}
              alt="ResumeSathi"
            />
          </div>

          <p className="rk-footer-tag">
            Your data, always yours. Create resumes without signup or hidden fees.
          </p>

          <div className="rk-footer-socials">
            <div className="rk-footer-col-title">Follow us</div>
            <div className="rk-footer-social-links">
              <a
                className="rk-footer-social-link"
                href="https://www.youtube.com/@Resume_Sathi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
                </svg>
              </a>
              <a
                className="rk-footer-social-link"
                href="https://www.facebook.com/resumesathi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.3c0-3 1.8-4.7 4.5-4.7 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z" />
                </svg>
              </a>
              <a
                className="rk-footer-social-link"
                href="https://in.pinterest.com/resumesathi/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 0 0-4.4 23.2c0-.9 0-2 .2-3l1.6-6.8s-.4-.8-.4-2c0-1.9 1.1-3.3 2.5-3.3 1.2 0 1.7.9 1.7 2 0 1.2-.8 3-1.2 4.7-.3 1.4.7 2.5 2.1 2.5 2.5 0 4.4-2.7 4.4-6.6 0-3.4-2.4-5.8-5.9-5.8-4 0-6.4 3-6.4 6.2 0 1.2.5 2.5 1.1 3.2.1.1.2.3.1.5l-.4 1.4c-.1.4-.2.5-.6.3-1.8-.8-2.9-3.2-2.9-5.1 0-4.2 3.1-8.1 9-8.1 4.7 0 8.4 3.4 8.4 7.9 0 4.7-3 8.6-7.1 8.6-1.4 0-2.8-.8-3.3-1.7l-.9 3.4c-.3 1.1-1 2.3-1.5 3.1A12 12 0 1 0 12 0Z" />
                </svg>
              </a>
              <a
                className="rk-footer-social-link"
                href="https://www.instagram.com/resume_sathi/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                </svg>
              </a>
              <a
                className="rk-footer-social-link"
                href="https://chat.whatsapp.com/GR0WvVRAYL7CB9shgfdn3R?s=sw&p=a&mlu=4&ilr=4&iam=2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp community"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M20.52 3.48A11.83 11.83 0 0 0 12.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.15 1.6 5.96L.08 24l6.3-1.65a11.9 11.9 0 0 0 5.7 1.45h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.47-8.42ZM12.09 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.88 9.88 0 0 1-1.52-5.27c0-5.46 4.45-9.9 9.91-9.9a9.83 9.83 0 0 1 7 2.9 9.83 9.83 0 0 1 2.9 7c0 5.46-4.45 9.9-9.9 9.9Zm5.43-7.42c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.8-1.49-1.78-1.66-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.72.64.73.23 1.4.2 1.92.12.59-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="rk-footer-cols">
          <div className="rk-footer-col">
            <div className="rk-footer-col-title">Product</div>

            <Link prefetch={false} href="/templates/">Resume Templates</Link>
            <Link prefetch={false} href="/bio-data/">Bio Data</Link>
            <Link prefetch={false} href="/tools/">Tools</Link>
            <Link prefetch={false} href="/tools/id-card-maker/">ID Card Maker</Link>
            <Link prefetch={false} href="/tools/typing/">Typing Practice</Link>
          </div>

          <div className="rk-footer-col">
            <div className="rk-footer-col-title">Resources</div>

            <Link prefetch={false} href="/blog/">Blog</Link>
            <Link prefetch={false} href="/exam-guides/">Exam Guides</Link>
          </div>

          <div className="rk-footer-col">
            <div className="rk-footer-col-title">Company</div>

            <Link prefetch={false} href="/about/">About</Link>
            <Link prefetch={false} href="/terms-and-conditions/">Terms & Conditions</Link>
            <Link prefetch={false} href="/privacy-policy/">Privacy Policy</Link>
            <Link prefetch={false} href="/disclaimer/">Disclaimer</Link>
            <Link prefetch={false} href="/contact/">Contact</Link>
          </div>
        </div>
      </div>

      <div className="rk-footer-bottom">
        <div className="container-fluid custom-container rk-footer-bottom-inner">
          <span>© {new Date().getFullYear()} ResumeSathi · Your data never leaves your device</span>
          <span>Made with ♥ for every career</span>
        </div>
      </div>
    </footer>
    </>
  );
}
