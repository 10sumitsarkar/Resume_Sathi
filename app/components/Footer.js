// components/Footer.jsx

import Link from "next/link";

export default function Footer() {
  return (
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
  );
}
