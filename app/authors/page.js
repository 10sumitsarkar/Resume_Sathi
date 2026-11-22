import Link from "next/link";
import Image from "next/image";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import FooterNav from "../components/FooterNav";
import { DEFAULT_SITE_BASE } from "../lib/apiConfig";
import {
  getAuthorArticles,
  getAuthorProfiles,
  getAuthorTopics,
} from "./authorData";
import "./authors.css";

const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");

export const metadata = {
  title: "Authors | ResumeSathi",
  description: "Meet the authors who write ResumeSathi career articles and exam guides.",
  alternates: { canonical: `${siteUrl}/authors/` },
};

export default function AuthorsPage() {
  const profiles = getAuthorProfiles();

  return (
    <>
      <NavBar />
      <main className="container-fluid custom-container author-pages">
        <header className="author-hero">
          <div className="author-hero__copy">
            <span className="author-pages__eyebrow">Meet our contributors</span>
            <h1>People behind <span>ResumeSathi</span></h1>
            <p>
              Get to know the authors creating practical career resources and
              exam guides for the ResumeSathi community.
            </p>
          </div>
          <div className="author-hero__visual" aria-hidden="true">
            <span className="author-hero__orbit author-hero__orbit--outer" />
            <span className="author-hero__orbit author-hero__orbit--inner" />
            <span className="author-hero__spark">R</span>
          </div>
        </header>
        <section className="author-directory-intro" aria-labelledby="author-directory-heading">
          <h2 id="author-directory-heading">Browse ResumeSathi authors and their work</h2>
          <p>
            This directory connects each contributor profile with the articles and
            exam guides published under that author&rsquo;s byline. Open a profile to
            see its current topic labels, a count of the listed resources, and links
            to the full articles. The profile pages make it easier to follow a
            subject from a short overview to the complete guide.
          </p>
          <h3>Career resources for different stages of a job search</h3>
          <p>
            The current article library includes practical topics such as resume
            structure, ATS-friendly writing, applications for freshers, interview
            preparation, job offers, workplace decisions, and career changes. Some
            articles explain how to choose a format or present experience; others
            focus on preparing for a conversation with an employer or evaluating a
            next step. Use the article title and summary on the profile page to
            decide whether a resource fits the question you are researching.
          </p>
          <h3>Exam guides and recruitment information</h3>
          <p>
            ResumeSathi also publishes exam-preparation guides alongside career
            advice. The available guide topics include state and national
            recruitment examinations, with pages covering subjects such as
            eligibility, syllabus, exam pattern, and preparation resources where
            those details are provided. Recruitment rules and dates can change, so
            applicants should confirm current requirements with the relevant
            recruiting authority before making decisions.
          </p>
          <p>
            Author profiles are navigation pages, not substitutes for the full
            articles or official notices. They show the byline information and
            published resources available in the site&rsquo;s content library.
            Article dates appear when they are supplied with the publication data.
            If you are looking for a specific topic, compare the profile topic
            labels and article descriptions, then open the linked page for its
            complete context and any cited sources.
          </p>
        </section>
        <div className="author-pages__grid">
          {profiles.map((profile) => {
            const articles = getAuthorArticles(profile.slug);
            const topics = getAuthorTopics(articles);
            return (
              <article className="author-pages__card" key={profile.slug}>
                <div className="author-pages__card-head">
                  <Image
                    className="author-pages__avatar"
                    src={profile.image}
                    alt={profile.name}
                    width={104}
                    height={104}
                    loading="lazy"
                    decoding="async"
                    unoptimized
                  />
                  <div>
                    <span className="author-pages__card-label">ResumeSathi author</span>
                    <h2>{profile.name}</h2>
                    <p className="author-pages__role">{profile.title}</p>
                  </div>
                </div>
                <p className="author-pages__bio">{profile.bio}</p>
                {topics.length > 0 && (
                  <div className="author-pages__topics">
                    <span className="author-pages__topics-label">Topics</span>
                    <ul>
                      {topics.map((topic) => <li key={topic}>{topic}</li>)}
                    </ul>
                  </div>
                )}
                <div className="author-pages__card-footer">
                  <span>{articles.length} articles &amp; guides</span>
                  <Link href={`/authors/${profile.slug}/`}>
                    View profile <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
      <FooterNav />
    </>
  );
}
