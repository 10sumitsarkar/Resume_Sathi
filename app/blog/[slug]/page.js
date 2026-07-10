"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import '../blog.css';

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE || 'http://localhost:8000';
const API_BASE = `${BACKEND_BASE}/api`;
const DEFAULT_IMAGE = '/front-assets/images/resume-hero.webp';

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

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const [article, setArticle] = useState(null);
  const [latest, setLatest] = useState([]);
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    fetchArticle();
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

  if (loading) {
    return <div className="rk-loading">Loading article...</div>;
  }

  if (!article) {
    return <div className="rk-empty">Article not found.</div>;
  }

  return (
    <section className="rk-article-page container">
      <div className="rk-article-layout">
        <article className="rk-article-content">
          <div className="rk-article-top">
            <span className="rk-article-cat">{article.category?.article_name || article.category?.name || article.category?.title || 'General'}</span>
            <h1>{article.article_title || article.title}</h1>
            <div className="rk-article-meta">
              <span>Published: {formatDate(article.created_at)}</span>
              <span>By: {article.user?.name || 'Admin'}</span>
            </div>
          </div>

          <div className="rk-article-hero">
            <img src={resolveMediaUrl(article.hero_image)} alt={article.article_title || article.title} />
          </div>

          <div className="rk-article-text">
            {article.description || article.meta_description ? (
              <p>{article.description || article.meta_description}</p>
            ) : (
              <p>No article content available.</p>
            )}
            {article.contents?.length > 0 && article.contents.map((contentItem) => (
              <div
                key={contentItem.id}
                className="rk-article-section"
                dangerouslySetInnerHTML={{ __html: normalizeHtmlContent(contentItem.content) }}
              />
            ))}
          </div>

          <div className="rk-article-comments">
            <h2>Comments</h2>
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
                <button type="submit" disabled={posting}>
                  {posting ? 'Posting...' : 'Post Comment'}
                </button>
                {error && <p className="rk-form-error">{error}</p>}
                {success && <p className="rk-form-success">{success}</p>}
              </form>
            </div>

            <div className="rk-comments-list">
              {comments.length === 0 ? (
                <p>No comments yet. Be the first to comment.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="rk-comment-item">
                    <div className="rk-comment-header">
                      <strong>{comment.name}</strong>
                      <span>{formatDate(comment.created_at)}</span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </article>

        <aside className="rk-article-sidebar">
          <div className="rk-widget rk-widget-latest">
            <h4>Latest Articles</h4>
            <ul>
              {latest.map((item) => {
                const itemSlug = item.slug || item.url_name || item.canonical_tag;
                return (
                  <li key={item.id}>
                    <Link href={`/blog/${itemSlug}`}>{item.article_title || item.title}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
