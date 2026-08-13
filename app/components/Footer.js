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
        </div>

        <div className="rk-footer-cols">
          <div className="rk-footer-col">
            <div className="rk-footer-col-title">Product</div>

            <Link prefetch={false} href="/tools/">Tools</Link>
            <Link prefetch={false} href="/typing/">Typing Practice</Link>
          </div>

          <div className="rk-footer-col">
            <div className="rk-footer-col-title">Jobs</div>

            <Link prefetch={false} href="/jobs/">Jobs</Link>
            <Link prefetch={false} href="/blog/">Career Tips</Link>
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
