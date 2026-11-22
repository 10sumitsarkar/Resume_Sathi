import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import FooterNav from "../../components/FooterNav";
import { DEFAULT_SITE_BASE } from "../../lib/apiConfig";
import {
  getAuthorArticleSlug,
  getAuthorArticleCategory,
  getAuthorArticleDescription,
  getAuthorArticleImage,
  getAuthorArticleTitle,
  getAuthorArticles,
  getAuthorProfileBySlug,
  getAuthorProfiles,
  getAuthorTopics,
} from "../authorData";
import "../authors.css";
import "../../blog/blog.css";

const siteUrl = DEFAULT_SITE_BASE.replace(/\/+$/, "");
export const dynamicParams = false;

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function generateStaticParams() {
  return getAuthorProfiles().map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const profile = getAuthorProfileBySlug(slug);
  if (!profile) return { title: "Author Not Found | ResumeSathi" };

  return {
    title: `${profile.name} | ResumeSathi Author`,
    description: profile.bio,
    alternates: { canonical: `${siteUrl}/authors/${profile.slug}/` },
    openGraph: {
      title: `${profile.name} | ResumeSathi Author`,
      description: profile.bio,
      url: `${siteUrl}/authors/${profile.slug}/`,
      images: [{ url: profile.image, alt: profile.name }],
    },
  };
}

export default async function AuthorProfilePage({ params }) {
  const { slug } = await params;
  const profile = getAuthorProfileBySlug(slug);
  if (!profile) notFound();

  const articles = getAuthorArticles(profile.slug);
  const topics = getAuthorTopics(articles);

  return (
    <>
      <NavBar />
      <main className="author-pages author-profile-page">
        <nav className="container-fluid custom-container author-breadcrumb" aria-label="Breadcrumb">
          <Link href="/authors/">Authors</Link>
          <span aria-hidden="true">/</span>
          <span>{profile.name}</span>
        </nav>
        <section className="author-profile">
          <div className="container-fluid custom-container author-profile__inner">
            <div className="author-profile__portrait">
              <Image
                className="author-profile__image"
                src={profile.image}
                alt={profile.name}
                width={144}
                height={144}
                loading="eager"
                decoding="async"
                unoptimized
              />
              <span>ResumeSathi author</span>
            </div>
            <div className="author-profile__content">
              <span className="author-pages__eyebrow">Meet the author</span>
              <h1>{profile.name}</h1>
              <p className="author-pages__role">{profile.title}</p>
              <p className="author-profile__bio">{profile.bio}</p>
              {topics.length > 0 && (
                <div className="author-profile__topic-block">
                  <h2>Topics covered</h2>
                  <ul className="author-profile__topics">
                    {topics.map((topic) => <li key={topic}>{topic}</li>)}
                  </ul>
                </div>
              )}
              <div className="author-profile__details">
                <h2>About this author&rsquo;s ResumeSathi content</h2>
                <p>
                  This profile brings together {articles.length} published
                  {articles.length === 1 ? " resource" : " resources"} associated
                  with {profile.name}&rsquo;s ResumeSathi byline. The role and
                  biography above describe the author as presented by the site;
                  the articles and guides below provide the detail behind each
                  topic.
                </p>
                <p>
                  The current topic list includes{" "}
                  {topics.length ? topics.join(", ") : "career resources"}.
                  Open an article card to read its full explanation, examples,
                  and any source notes included on that page. If a topic concerns
                  recruitment rules, eligibility, or dates, confirm the latest
                  information with the relevant official authority before acting.
                </p>
                <p>
                  The list is generated from content linked to this profile, so
                  it can change when published articles or guides are added or
                  updated. Publication dates are shown on cards when available.
                  Browse by the headline and summary to find a relevant resource,
                  and use the article itself for the complete context rather than
                  relying only on a short card description.
                </p>
              </div>
              <div className="author-profile__actions">
                <span>{articles.length} articles &amp; guides</span>
                <Link href="#articles">Browse articles <span aria-hidden="true">↓</span></Link>
              </div>
            </div>
          </div>
        </section>
        <section className="author-pages__articles rk-blog-scope" id="articles">
          <div className="container-fluid custom-container">
            <header className="author-pages__articles-heading">
              <div>
                <span className="author-pages__eyebrow">From the author</span>
                <h2>Articles &amp; guides</h2>
              </div>
              <p>Explore the latest career resources and exam preparation content.</p>
            </header>
            {articles.length ? (
              <div className="row g-4">
                {articles.map((article) => {
                  const articleSlug = getAuthorArticleSlug(article);
                  const articleHref =
                    article.contentType === "exam-guide"
                      ? `/exam-guides/${articleSlug}/`
                      : `/blog/${articleSlug}/`;
                  const publishedDate = formatDate(article.created_at);
                  return (
                    <div className="col-sm-6 col-lg-4" key={`${article.contentType}-${articleSlug}`}>
                      <article className="rk-blog-card">
                        <Link
                          prefetch={false}
                          href={articleHref}
                          className="rk-blog-card-img"
                        >
                          <Image
                            src={getAuthorArticleImage(article)}
                            alt={getAuthorArticleTitle(article)}
                            width={640}
                            height={380}
                            className="rk-blog-card-img"
                            loading="lazy"
                            decoding="async"
                            unoptimized
                          />
                          <span className="rk-blog-cat">
                            {getAuthorArticleCategory(article)}
                          </span>
                        </Link>
                        <div className="rk-blog-card-body">
                          {publishedDate && (
                            <span className="rk-blog-date">
                              Published: {publishedDate}
                            </span>
                          )}
                          <h3>
                            <Link prefetch={false} href={articleHref}>
                              {getAuthorArticleTitle(article)}
                            </Link>
                          </h3>
                          <p>{getAuthorArticleDescription(article)}</p>
                          <Link
                            prefetch={false}
                            href={articleHref}
                            className="rk-blog-readmore"
                          >
                            {article.contentType === "exam-guide"
                              ? "Read full guide"
                              : "Read full article"}
                            <span aria-hidden="true"> →</span>
                          </Link>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="author-pages__empty">No articles are currently listed for this author.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FooterNav />
    </>
  );
}
