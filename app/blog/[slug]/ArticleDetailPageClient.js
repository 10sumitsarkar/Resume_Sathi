"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import '../blog.css';

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE || 'http://localhost:8000';
const API_BASE = `${BACKEND_BASE}/api`;
const DEFAULT_IMAGE = '/front-assets/images/resume-hero.webp';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

function getArticleSeo(article, slug) {
  const title = article?.meta_title || article?.og_title || getTitle(article) || 'Blog Article';
  const description = article?.meta_description || article?.og_description || article?.description || 'Read this helpful article from our blog.';
  const keywords = article?.meta_keywords || article?.keywords || [
    article?.category?.article_name || article?.category?.name || article?.category?.title || 'blog',
    'resume tips',
    'career advice',
  ].join(', ');
  const image = resolveMediaUrl(article?.og_image || article?.meta_image || article?.hero_image || article?.image);
  const canonical = `${SITE_URL}/blog/${slug || getSlug(article) || ''}`;

  return {
    title,
    description,
    keywords,
    image,
    canonical,
  };
}

function resolveMediaUrl(url) {
  if (!url) return DEFAULT_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url;
  }
  return `${BACKEND_BASE}/${url.replace(/^\/+/, '')}`;
}

function normalizeHtmlContent(html) {
  if (!html) return '';

  const base = BACKEND_BASE.replace(/\/+$/, '');

  return html
    .replace(/(src|href)=("|')\/(?!\/)/g, `$1=$2${base}/`)
    .replace(/(src|href)=("|')((?!http:|https:|\/\/|mailto:|tel:|data:|#)[^"'>]+)("|')/g, (_match, attr, quote, pathRaw, closing) => {
      const path = pathRaw.replace(/^(?:\.\.\/)+/, '').replace(/^(?:\.\/)+/, '').replace(/^\/+/, '');
      return `${attr}=${quote}${base}/${path}${closing}`;
    });
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getSlug(item) {
  if (!item) return '';
  return item.slug || item.url_name || item.canonical_tag || '';
}

function getTitle(item) {
  if (!item) return '';
  return item.article_title || item.title || item.meta_title || item.name || 'Untitled article';
}

function applyDocumentMeta(meta) {
  if (typeof document === 'undefined') return;

  document.title = meta.title || 'Blog Article';

  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) {
    descriptionTag.setAttribute('content', meta.description || '');
  }

  const keywordsTag = document.querySelector('meta[name="keywords"]');
  if (keywordsTag) {
    keywordsTag.setAttribute('content', meta.keywords || '');
  }

  const canonicalTag = document.querySelector('link[rel="canonical"]');
  if (canonicalTag) {
    canonicalTag.setAttribute('href', meta.canonical || '');
  }

  const ogTitleTag = document.querySelector('meta[property="og:title"]');
  if (ogTitleTag) {
    ogTitleTag.setAttribute('content', meta.title || '');
  }

  const ogDescriptionTag = document.querySelector('meta[property="og:description"]');
  if (ogDescriptionTag) {
    ogDescriptionTag.setAttribute('content', meta.description || '');
  }

  const ogImageTag = document.querySelector('meta[property="og:image"]');
  if (ogImageTag) {
    ogImageTag.setAttribute('content', meta.image || '');
  }

  const twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitleTag) {
    twitterTitleTag.setAttribute('content', meta.title || '');
  }

  const twitterDescriptionTag = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescriptionTag) {
    twitterDescriptionTag.setAttribute('content', meta.description || '');
  }

  const twitterImageTag = document.querySelector('meta[name="twitter:image"]');
  if (twitterImageTag) {
    twitterImageTag.setAttribute('content', meta.image || '');
  }
}

export default function ArticleDetailPageClient({ article: initialArticle, slug: initialSlug }) {
  const params = useParams();
  const slug = params?.slug || initialSlug;
  const [article, setArticle] = useState(initialArticle || null);
  const [latest, setLatest] = useState([]);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', text: '' });
  const [loading, setLoading] = useState(!initialArticle);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (initialArticle) {
      setArticle(initialArticle);
      setLoading(false);
    }
  }, [initialArticle]);

  const fetchArticle = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/articles/slug/${encodeURIComponent(slug)}`);
      const data = await response.json();
      setArticle(data);
    } catch (err) {
      console.error(err);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatest = async () => {
    try {
      const response = await fetch(`${API_BASE}/articles/latest?limit=5`);
      const data = await response.json();
      setLatest(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setLatest([]);
    }
  };

  const fetchComments = async (id) => {
    if (!id) return;
    try {
      const response = await fetch(`${API_BASE}/article-comments?article_id=${id}`);
      const data = await response.json();
      setComments(Array.isArray(data.comments) ? data.comments : []);
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  };

  useEffect(() => {
    const isSameArticle = initialArticle && [initialArticle.url_name, initialArticle.slug, initialArticle.canonical_tag].includes(slug);
    if (!slug) return;
    if (isSameArticle) {
      setArticle(initialArticle);
      setLoading(false);
    } else {
      fetchArticle();
    }
  }, [slug, initialArticle]);

  useEffect(() => {
    if (!slug) return;
    fetchLatest();
  }, [slug]);

  useEffect(() => {
    if (article?.id) {
      fetchComments(article.id);
    }
  }, [article]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!article?.id) return;

    setPosting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE}/article-comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          text: form.text,
          article_id: article.id,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Unable to submit comment.');
      }

      setForm({ name: '', email: '', text: '' });
      setSuccess('Comment submitted successfully.');
      await fetchComments(article.id);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setPosting(false);
    }
  };

  const seo = getArticleSeo(article, slug);

  useEffect(() => {
    applyDocumentMeta(seo);
  }, [seo.title, seo.description, seo.keywords, seo.canonical, seo.image]);

  if (loading) {
    return (
      <div className="rk-loading">
        <div className="rk-spinner"></div>
        Loading article...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="rk-empty">
        <i className="bi bi-inboxes"></i>
        <p>Article not found.</p>
      </div>
    );
  }

  const categoryLabel = article.category?.article_name || article.category?.name || article.category?.title || 'General';
  const authorName = article.user?.name || 'Admin';

  return (
    <>
      <section className="container-fluid custom-container small-hero-area rk-article-hero">
        <div className="left-part">
          <div>
            <label className="tl-eyebrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 10C18.6569 10 20 8.65685 20 7C20 5.34315 18.6569 4 17 4C15.3431 4 14 5.34315 14 7C14 8.65685 15.3431 10 17 10Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 20C8.65685 20 10 18.6569 10 17C10 15.3431 8.65685 14 7 14C5.34315 14 4 15.3431 4 17C4 18.6569 5.34315 20 7 20Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 14H20V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H15C14.7348 20 14.4804 19.8946 14.2929 19.7071C14.1054 19.5196 14 19.2652 14 19V14ZM4 4H10V9C10 9.26522 9.89464 9.51957 9.70711 9.70711C9.51957 9.89464 9.26522 10 9 10H5C4.73478 10 4.48043 9.89464 4.29289 9.70711C4.10536 9.51957 4 9.26522 4 9V4Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {categoryLabel}
            </label>
            <h1 className="fs-mob-22">{article.article_title || article.title}</h1>
          </div>
          <div className="rk-article-meta">
            <span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H17V3C17 2.73478 16.8946 2.48043 16.7071 2.29289C16.5196 2.10536 16.2652 2 16 2C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3V4H9V3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H5C4.20435 4 3.44129 4.31607 2.87868 4.87868C2.31607 5.44129 2 6.20435 2 7V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7956 22 19V7C22 6.20435 21.6839 5.44129 21.1213 4.87868C20.5587 4.31607 19.7956 4 19 4ZM20 19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V12H20V19ZM20 10H4V7C4 6.73478 4.10536 6.48043 4.29289 6.29289C4.48043 6.10536 4.73478 6 5 6H7V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8C8.26522 8 8.51957 7.89464 8.70711 7.70711C8.89464 7.51957 9 7.26522 9 7V6H15V7C15 7.26522 15.1054 7.51957 15.2929 7.70711C15.4804 7.89464 15.7348 8 16 8C16.2652 8 16.5196 7.89464 16.7071 7.70711C16.8946 7.51957 17 7.26522 17 7V6H19C19.2652 6 19.5196 6.10536 19.7071 6.29289C19.8946 6.48043 20 6.73478 20 7V10Z" fill="black" />
              </svg>
              <span>{formatDate(article.created_at)}</span>
            </span>
            <span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C17.523 2 22 6.477 22 12C22.0034 14.3079 21.2053 16.5453 19.742 18.33L19.762 18.352L19.63 18.464C18.6921 19.5731 17.5235 20.4642 16.2056 21.0749C14.8878 21.6856 13.4525 22.0014 12 22C9.05 22 6.4 20.723 4.57 18.693L4.37 18.463L4.238 18.353L4.258 18.329C2.7949 16.5446 1.99679 14.3075 2 12C2 6.477 6.477 2 12 2ZM12 17C10.14 17 8.459 17.592 7.207 18.406C8.58958 19.4429 10.2718 20.0024 12 20C13.7282 20.0024 15.4104 19.4429 16.793 18.406C15.3623 17.4894 13.6991 17.0015 12 17ZM12 4C10.4945 3.99996 9.01959 4.42471 7.74472 5.22545C6.46985 6.02619 5.4468 7.1704 4.79316 8.52657C4.13951 9.88274 3.8818 11.3958 4.04965 12.8919C4.2175 14.388 4.80409 15.8064 5.742 16.984C7.363 15.821 9.575 15 12 15C14.425 15 16.637 15.821 18.258 16.984C19.1959 15.8064 19.7825 14.388 19.9503 12.8919C20.1182 11.3958 19.8605 9.88274 19.2068 8.52657C18.5532 7.1704 17.5301 6.02619 16.2553 5.22545C14.9804 4.42471 13.5055 3.99996 12 4ZM12 6C13.0609 6 14.0783 6.42143 14.8284 7.17157C15.5786 7.92172 16 8.93913 16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10C8 8.93913 8.42143 7.92172 9.17157 7.17157C9.92172 6.42143 10.9391 6 12 6ZM12 8C11.4696 8 10.9609 8.21071 10.5858 8.58579C10.2107 8.96086 10 9.46957 10 10C10 10.5304 10.2107 11.0391 10.5858 11.4142C10.9609 11.7893 11.4696 12 12 12C12.5304 12 13.0391 11.7893 13.4142 11.4142C13.7893 11.0391 14 10.5304 14 10C14 9.46957 13.7893 8.96086 13.4142 8.58579C13.0391 8.21071 12.5304 8 12 8Z" fill="#6B7280" />
              </svg>
              <span>{authorName}</span>
            </span>
          </div>
        </div>
      </section>

      <section className="rk-blog-page">
        <div className="container-fluid custom-container pb-120">
          <div className="row g-4">
            <div className="col-md-8 col-lg-9">
              <article className="rk-article-content">
                <div className="rk-article-text">
                  {article.contents?.length > 0 && article.contents.map((contentItem) => (
                    <div
                      key={contentItem.id}
                      className="rk-article-section"
                      dangerouslySetInnerHTML={{ __html: normalizeHtmlContent(contentItem.content) }}
                    />
                  ))}
                </div>

                <div className="rk-article-comments">
                  <h2><i className="bi bi-chat-left-text"></i> Comments {comments.length > 0 ? `(${comments.length})` : ''}</h2>

                  <div className="rk-comment-form">
                    <form onSubmit={handleSubmit}>
                      <div className="rk-form-row">
                        <input
                          value={form.name}
                          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Your name"
                          required
                        />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="Your email"
                          required
                        />
                      </div>
                      <textarea
                        value={form.text}
                        onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
                        placeholder="Write your comment"
                        rows={5}
                        required
                      />
                      <div className="rk-comment-form-footer">
                        <button type="submit" disabled={posting}>
                          {posting ? 'Posting...' : 'Post Comment'}
                        </button>
                        {error && <p className="rk-form-error"><i className="bi bi-exclamation-circle"></i> {error}</p>}
                        {success && <p className="rk-form-success"><i className="bi bi-check-circle"></i> {success}</p>}
                      </div>
                    </form>
                  </div>

                  <div className="rk-comments-list">
                    {comments.length === 0 ? (
                      <p className="rk-comments-empty">No comments yet. Be the first to comment.</p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="rk-comment-item">
                          <div className="rk-comment-avatar">{(comment.name || '?').charAt(0).toUpperCase()}</div>
                          <div className="rk-comment-body">
                            <div className="rk-comment-header">
                              <strong>{comment.name}</strong>
                              <span>{formatDate(comment.created_at)}</span>
                            </div>
                            <p>{comment.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </article>
            </div>

            <div className="col-md-4 col-lg-3">
              <aside className="rk-blog-sidebar">
                <div className="rk-widget rk-widget-latest">
                  <h4>Latest Articles</h4>
                  <ul>
                    {latest.map((item) => (
                      <li key={item.id}>
                        <Link href={`/blog/${getSlug(item)}`} className="rk-blog-card-img">
                          <img src={resolveMediaUrl(item.hero_image)} alt={getTitle(item)} />
                        </Link>
                        <div>
                          <span>{formatDate(item.created_at)}</span>
                          <Link href={`/blog/${getSlug(item)}`}>{getTitle(item)}</Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rk-widget rk-widget-cta">
                  <h4>Build Your Resume</h4>
                  <p>Create an ATS-optimized resume in minutes, 100% free.</p>
                  <Link href="/resume" className="rk-cta-btn">
                    <i className="bi bi-plus-lg"></i> Create Resume
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
