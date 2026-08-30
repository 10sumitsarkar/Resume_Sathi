"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import FooterNav from "../components/FooterNav";
import ReduxProvider from "../resume/store/reduxProvider";
import ResumeTemplate1 from "../resume/templates/ResumeTemplate1";
import ResumeTemplate2 from "../resume/templates/ResumeTemplate2";
import ResumeTemplate3 from "../resume/templates/ResumeTemplate3";
import ResumeTemplate4 from "../resume/templates/ResumeTemplate4";
import ResumeTemplate5 from "../resume/templates/ResumeTemplate5";
import ResumeTemplate6 from "../resume/templates/ResumeTemplate6";
import ResumeTemplate7 from "../resume/templates/ResumeTemplate7";
import ResumeTemplate8 from "../resume/templates/ResumeTemplate8";
import ResumeTemplate9 from "../resume/templates/ResumeTemplate9";
import {
  TEMPLATE_CONTENT,
  createResumeFromTemplate,
} from "./ResumeTemplateContentClient";
import "../blog/blog.css";
import "./templates.css";

const TEMPLATE_COMPONENTS = {
  ResumeTemplate1,
  ResumeTemplate2,
  ResumeTemplate3,
  ResumeTemplate4,
  ResumeTemplate5,
  ResumeTemplate6,
  ResumeTemplate7,
  ResumeTemplate8,
  ResumeTemplate9,
};

function DetailInner({ slug, ContentComponent }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const template = TEMPLATE_CONTENT.find((item) => item.slug === slug);

  if (!template) return null;

  const TemplateComponent = TEMPLATE_COMPONENTS[template.id] || ResumeTemplate1;
  const relatedTemplates = TEMPLATE_CONTENT.filter((item) => item.slug !== slug);

  return (
    <>
      <NavBar />
      <section className="container-fluid custom-container small-hero-area template-detail-hero m-0">
        <div className="left-part">
          <div>
            <Link href="/templates/" className="template-back-link">
              Back to templates
            </Link>
            <p className="template-content-eyebrow">{template.role}</p>
            <h1 className="fs-mob-22">{template.title}</h1>
          </div>
          <p className="fs-mob-16 ms-0">{template.note}</p>
          <button
            type="button"
            className="template-content-start template-hero-left-btn"
            onClick={() => createResumeFromTemplate(template, dispatch, router, setLoading)}
            disabled={loading}
          >
            {loading ? "Opening..." : "Create Resume"}
          </button>
        </div>
        <div className="right-part template-hero-image">
          <img
            src="/front-assets/images/resume-hero.webp"
            className="img-fluid"
            width={500}
            height={360}
            alt={`${template.title} preview`}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="template-detail-page py-custom">
        <div className="container-fluid custom-container">
          <div className="row g-4 align-items-start">
            <div className="col-lg-8">
              <div className="template-content-preview">
                <TemplateComponent
                  isStatic={true}
                  additionalClass={`font-poppins layout-${template.layout} ${template.color}`}
                />
              </div>

              <article className="template-article">
                <div className="rk-article-text">
                  {ContentComponent ? <ContentComponent /> : null}
                </div>
                <button
                  type="button"
                  className="template-card-start template-detail-create"
                  onClick={() => createResumeFromTemplate(template, dispatch, router, setLoading)}
                  disabled={loading}
                >
                  {loading ? "Opening..." : "Create Resume"}
                </button>
              </article>
            </div>

            <aside className="col-lg-4">
              <div className="template-sidebar">
                <div className="template-sidebar-links">
                  <h2>More template pages</h2>
                  {relatedTemplates.map((item) => (
                    <Link href={`/templates/${item.slug}/`} key={item.slug}>
                      <span>{item.title}</span>
                      <small>{item.role}</small>
                    </Link>
                  ))}
                </div>

                <div className="template-sidebar-cta">
                  <h2>Use this template</h2>
                  <p>Start with this design and fill your personal information next.</p>
                  <button
                    type="button"
                    className="template-content-start"
                    onClick={() => createResumeFromTemplate(template, dispatch, router, setLoading)}
                    disabled={loading}
                  >
                    {loading ? "Opening..." : "Create Resume"}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
      <FooterNav />
    </>
  );
}

export default function TemplateDetailClient({ slug, ContentComponent }) {
  return (
    <ReduxProvider>
      <DetailInner slug={slug} ContentComponent={ContentComponent} />
    </ReduxProvider>
  );
}
