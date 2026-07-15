"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import '../jobs.css';

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE || 'https://api.resumesathi.com';
const API_BASE = `${BACKEND_BASE}/api`;
const DEFAULT_IMAGE = '/front-assets/images/job-hero.webp';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://www.resumesathi.com';

function getArticleSeo(article, slug) {
  const title = article?.meta_title || article?.og_title || getTitle(article) || 'Job Opening';
  const description = article?.meta_description || article?.og_description || article?.description || 'Explore this job opportunity and apply today.';
  const keywords = article?.meta_keywords || article?.keywords || [
    article?.category?.course_name || article?.course_category?.course_name || article?.category?.article_name || article?.category?.name || article?.category?.title || 'jobs',
    'career opportunities',
    'hiring',
  ].join(', ');
  const image = resolveMediaUrl(article?.og_image || article?.meta_image || article?.hero_image || article?.image);
  const canonical = `${SITE_URL}/jobs/${slug || getSlug(article) || ''}`;

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
  return item.title || item.article_title || item.meta_title || item.topic_name || item.name || 'Untitled job';
}

function getDescription(item) {
  if (!item) return '';
  return item.description || item.meta_description || item.short_description || '';
}

function getCategoryLabel(item) {
  return item.category?.course_name || item.course_category?.course_name || item.category?.article_name || item.category?.name || item.category?.title || 'General';
}

function getCompanyName(item) {
  return item.company || item.company_name || item.organization || '';
}

function getLocation(item) {
  return item.location || item.city || item.place || '';
}

function getEmploymentType(item) {
  return item.employment_type || item.job_type || '';
}

function formatApplicationDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getApplicationDates(item) {
  return {
    begin: item.application_begin || item.applicationStart || item.start_date || '',
    lastDate: item.last_date_for_apply || item.lastDateForApply || item.apply_until || '',
  };
}

function applyDocumentMeta(meta) {
  if (typeof document === 'undefined') return;

  document.title = meta.title || 'Job Opening';

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

function SearchDropdown({
  value,
  onChange,
  onSubmit,
  suggestions,
  showSuggestions,
  onFocus,
  onSelect,
  wrapRef,
  placeholder = 'Search jobs...',
  ariaLabel = 'Search jobs',
}) {
  return (
    <div className="rk-search-wrap rk-search-wrap--offcanvas" ref={wrapRef}>
      <form onSubmit={onSubmit} className="rk-search-form" autoComplete="off">
        <svg className="rk-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.0002 21.0002L16.6572 16.6572M16.6572 16.6572C17.4001 15.9143 17.9894 15.0324 18.3914 14.0618C18.7935 13.0911 19.0004 12.0508 19.0004 11.0002C19.0004 9.9496 18.7935 8.90929 18.3914 7.93866C17.9894 6.96803 17.4001 6.08609 16.6572 5.34321C15.9143 4.60032 15.0324 4.01103 14.0618 3.60898C13.0911 3.20693 12.0508 3 11.0002 3C9.9496 3 8.90929 3.20693 7.93866 3.60898C6.96803 4.01103 6.08609 4.60032 5.34321 5.34321C3.84288 6.84354 3 8.87842 3 11.0002C3 13.122 3.84288 15.1569 5.34321 16.6572C6.84354 18.1575 8.87842 19.0004 11.0002 19.0004C13.122 19.0004 15.1569 18.1575 16.6572 16.6572Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          aria-label={ariaLabel}
        />
      </form>

      {showSuggestions && (
        <ul className="rk-search-dropdown">
          {suggestions.length === 0 ? (
            <li className="rk-search-dropdown-empty">No matching jobs</li>
          ) : (
            suggestions.map((item) => (
              <li key={item.id}>
                <Link prefetch={false} href={`/jobs/${getSlug(item)}`} onClick={() => onSelect(item)}>
                  <img src={resolveMediaUrl(item.hero_image || item.image)} alt={getTitle(item)} />
                  <div>
                    <span className="rk-search-dropdown-title">{getTitle(item)}</span>
                    <span className="rk-search-dropdown-cat">{getCategoryLabel(item)}</span>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

function CategorySlider({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="rk-cat-slider">
      <div className="rk-cat-slider-track">
        <button
          type="button"
          className={`rk-cat-chip ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`rk-cat-chip ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.course_name || cat.article_name || cat.name || cat.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ArticleDetailPageClient({ article: initialArticle, slug: initialSlug }) {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug || initialSlug;
  const [article, setArticle] = useState(initialArticle || null);
  const [latest, setLatest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offcanvasSearch, setOffcanvasSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestDebounce = useRef(null);
  const offcanvasSearchWrapRef = useRef(null);
  const [loading, setLoading] = useState(!initialArticle);

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
      const response = await fetch(`${API_BASE}/courses`);
      const data = await response.json();
      const jobs = Array.isArray(data) ? data : (data.items || data.results || []);
      const matchedJob = jobs.find((item) => {
        const slugValue = item.slug || item.url_name || item.canonical_tag || '';
        return slugValue === slug || slugValue === decodeURIComponent(slug);
      });
      setArticle(matchedJob || null);
    } catch (err) {
      console.error(err);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatest = async () => {
    try {
      const response = await fetch(`${API_BASE}/courses`);
      const data = await response.json();
      const jobs = Array.isArray(data) ? data : (data.items || data.results || []);
      setLatest(jobs.slice(0, 5));
    } catch (err) {
      console.error(err);
      setLatest([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/course-categories`);
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setCategories([]);
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
    fetchCategories();
  }, [slug]);

  const closeOffcanvas = () => {
    if (typeof window === 'undefined') return;

    const canvas = document.getElementById('BlogsOffcanvas');
    const instance = window.bootstrap?.Offcanvas?.getInstance(canvas) || window.bootstrap?.Offcanvas?.getOrCreateInstance?.(canvas);
    instance?.hide();

    document.body.classList.remove('offcanvas-open');
    document.body.style.overflow = '';

    const backdrop = document.querySelector('.offcanvas-backdrop');
    if (backdrop) backdrop.remove();
  };

  useEffect(() => {
    if (suggestDebounce.current) clearTimeout(suggestDebounce.current);

    const term = offcanvasSearch.trim();
    if (term.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    suggestDebounce.current = setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE}/courses`);
        const data = await response.json();
        const jobs = Array.isArray(data) ? data : (data.items || data.results || []);
        const filteredSuggestions = jobs.filter((item) => {
          const haystack = [getTitle(item), getDescription(item), getCategoryLabel(item), getCompanyName(item), getLocation(item)].join(' ').toLowerCase();
          return haystack.includes(term.toLowerCase());
        });
        setSuggestions(filteredSuggestions.slice(0, 6));
        setShowSuggestions(true);
      } catch (error) {
        console.error(error);
        setSuggestions([]);
      }
    }, 250);

    return () => {
      if (suggestDebounce.current) clearTimeout(suggestDebounce.current);
    };
  }, [offcanvasSearch]);

  useEffect(() => {
    function handleClickOutside(event) {
      const insideOffcanvas = offcanvasSearchWrapRef.current && offcanvasSearchWrapRef.current.contains(event.target);
      if (!insideOffcanvas) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOffcanvasSearchSubmit = (event) => {
    event.preventDefault();
    closeOffcanvas();
    const trimmed = offcanvasSearch.trim();
    const query = new URLSearchParams();
    if (trimmed) query.set('search', trimmed);
    router.push(`/jobs${query.toString() ? `?${query.toString()}` : ''}`);
    setShowSuggestions(false);
  };

  const handleSuggestionSelect = (item) => {
    setOffcanvasSearch(getTitle(item));
    setShowSuggestions(false);
    closeOffcanvas();
    router.push(`/jobs/${getSlug(item)}`);
  };

  const handleCategoryClick = (categoryId) => {
    closeOffcanvas();
    const query = new URLSearchParams();
    if (categoryId) query.set('category_id', String(categoryId));
    router.push(`/jobs${query.toString() ? `?${query.toString()}` : ''}`);
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
        <p>Job not found.</p>
      </div>
    );
  }

  const categoryLabel = article.category?.course_name || article.course_category?.course_name || article.category?.article_name || article.category?.name || article.category?.title || 'General';
  const selectedCategoryId = article.category?.id || article.course_category?.id || article.category_id || null;
  const companyName = getCompanyName(article);
  const location = getLocation(article);
  const employmentType = getEmploymentType(article);
  const { begin, lastDate } = getApplicationDates(article);

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
            <h1 className="fs-mob-22">{getTitle(article)}</h1>
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
              <span>{companyName || 'Company'}</span>
            </span>
            {location ? <span>{location}</span> : null}
            {employmentType ? <span>{employmentType}</span> : null}
          </div>
          {(begin || lastDate) ? (
            <div className="rk-article-meta mt-2">
              {begin ? <span>Apply From: {formatApplicationDate(begin)}</span> : null}
              {lastDate ? <span>Last Date: {formatApplicationDate(lastDate)}</span> : null}
            </div>
          ) : null}
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
              </article>
            </div>

            <div className="col-md-4 col-lg-3">
              <aside className="rk-blog-sidebar">
                <div className="rk-widget rk-widget-latest">
                  <h4>Latest Jobs</h4>
                  <ul>
                    {latest.map((item) => (
                      <li key={item.id}>
                        <Link prefetch={false} href={`/jobs/${getSlug(item)}`} className="rk-blog-card-img">
                          <img src={resolveMediaUrl(item.hero_image)} alt={getTitle(item)} />
                        </Link>
                        <div>
                          <span>{formatDate(item.created_at)}</span>
                          <Link prefetch={false} href={`/jobs/${getSlug(item)}`}>{getTitle(item)}</Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rk-widget rk-widget-cta">
                  <h4>Build Your Resume</h4>
                  <p>Create an ATS-optimized resume in minutes, 100% free.</p>
                  <Link prefetch={false} href="/resume" className="rk-cta-btn">
                    <i className="bi bi-plus-lg"></i> Create Resume
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <div className="offcanvas offcanvas-start rk-blog-offcanvas" data-bs-scroll="true" data-bs-backdrop="true" tabIndex="-1" id="BlogsOffcanvas" aria-labelledby="commonOffcanvasLabel">
        <div className="offcanvas-tools-sidebar">
          <div className="header">
            <div className="left-side">
              <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.5 2.51563H10.925C10.1578 2.51563 9.40781 2.73594 8.7625 3.15156L8 3.64063L7.2375 3.15156C6.59283 2.73602 5.84199 2.51522 5.075 2.51563H1.5C1.22344 2.51563 1 2.73906 1 3.01563V11.8906C1 12.1672 1.22344 12.3906 1.5 12.3906H5.075C5.84219 12.3906 6.59219 12.6109 7.2375 13.0266L7.93125 13.4734C7.95156 13.4859 7.975 13.4938 7.99844 13.4938C8.02187 13.4938 8.04531 13.4875 8.06563 13.4734L8.75937 13.0266C9.40625 12.6109 10.1578 12.3906 10.925 12.3906H14.5C14.7766 12.3906 15 12.1672 15 11.8906V3.01563C15 2.73906 14.7766 2.51563 14.5 2.51563ZM5.075 11.2656H2.125V3.64063H5.075C5.62812 3.64063 6.16562 3.79844 6.62969 4.09688L7.39219 4.58594L7.5 4.65625V11.875C6.75625 11.475 5.925 11.2656 5.075 11.2656ZM13.875 11.2656H10.925C10.075 11.2656 9.24375 11.475 8.5 11.875V4.65625L8.60781 4.58594L9.37031 4.09688C9.83438 3.79844 10.3719 3.64063 10.925 3.64063H13.875V11.2656ZM6.20156 5.64063H3.29844C3.2375 5.64063 3.1875 5.69375 3.1875 5.75781V6.46094C3.1875 6.525 3.2375 6.57813 3.29844 6.57813H6.2C6.26094 6.57813 6.31094 6.525 6.31094 6.46094V5.75781C6.3125 5.69375 6.2625 5.64063 6.20156 5.64063ZM9.6875 5.75781V6.46094C9.6875 6.525 9.7375 6.57813 9.79844 6.57813H12.7C12.7609 6.57813 12.8109 6.525 12.8109 6.46094V5.75781C12.8109 5.69375 12.7609 5.64063 12.7 5.64063H9.79844C9.7375 5.64063 9.6875 5.69375 9.6875 5.75781ZM6.20156 7.82813H3.29844C3.2375 7.82813 3.1875 7.88125 3.1875 7.94531V8.64844C3.1875 8.7125 3.2375 8.76563 3.29844 8.76563H6.2C6.26094 8.76563 6.31094 8.7125 6.31094 8.64844V7.94531C6.3125 7.88125 6.2625 7.82813 6.20156 7.82813ZM12.7016 7.82813H9.79844C9.7375 7.82813 9.6875 7.88125 9.6875 7.94531V8.64844C9.6875 8.7125 9.7375 8.76563 9.79844 8.76563H12.7C12.7609 8.76563 12.8109 8.7125 12.8109 8.64844V7.94531C12.8125 7.88125 12.7625 7.82813 12.7016 7.82813Z" fill="#fff"/>
              </svg>
              <p>Jobs</p>
            </div>
            <button type="button" className="right-side-btn" onClick={closeOffcanvas} data-bs-dismiss="offcanvas" aria-label="Close">
              <img src="/front-assets/images/icons/close-cross.svg" alt="Close" />
            </button>
          </div>

          <CategorySlider
            categories={categories}
            selectedCategory={selectedCategoryId}
            onSelectCategory={handleCategoryClick}
          />

          <div className="scroll-div pb-mob-100">
            <div className="rk-offcanvas-section">
              <SearchDropdown
                value={offcanvasSearch}
                onChange={setOffcanvasSearch}
                onSubmit={handleOffcanvasSearchSubmit}
                suggestions={suggestions}
                showSuggestions={showSuggestions}
                onFocus={() => offcanvasSearch.trim().length >= 2 && setShowSuggestions(true)}
                onSelect={handleSuggestionSelect}
                wrapRef={offcanvasSearchWrapRef}
                placeholder="Search jobs..."
                ariaLabel="Search jobs"
              />
            </div>

            <div className="rk-offcanvas-section">
              <h4><i className="bi bi-clock-history"></i> Latest Jobs</h4>
              <div className="rk-offcanvas-latest-list">
                {latest.map((item) => (
                  <Link prefetch={false} key={item.id} href={`/jobs/${getSlug(item)}`} className="rk-latest-sub-item" onClick={closeOffcanvas}>
                    <img src={resolveMediaUrl(item.hero_image || item.image)} width={40} height={40} alt={getTitle(item)} />
                    <div>
                      <span className="rk-latest-sub-title">{getTitle(item)}</span>
                      <span className="rk-latest-sub-date">{formatDate(item.created_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="rk-offcanvas-cta">
            <Link prefetch={false} href="/resume" className="rk-cta-btn" onClick={closeOffcanvas}>
              <i className="bi bi-plus-lg"></i> Build Your Resume
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
