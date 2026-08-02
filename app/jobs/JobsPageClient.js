"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getContentCacheUrl, resolveApiMediaUrl } from '../lib/apiConfig';
import './jobs.css';

const IconBlog = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const DEFAULT_IMAGE = '/front-assets/images/og/job-og.png';
const PAGE_SIZE = 12;
const SUGGESTION_LIMIT = 6;

function resolveMediaUrl(url) {
  return resolveApiMediaUrl(url, DEFAULT_IMAGE);
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
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
    timeZone: 'UTC',
  });
}

function getApplicationDates(item) {
  return {
    begin: item.application_begin || item.applicationStart || item.start_date || '',
    lastDate: item.last_date_for_apply || item.lastDateForApply || item.apply_until || '',
  };
}

// ðŸ‘‡ NAYA: expiry timestamp nikalne ke liye helper
function getExpiryTimestamp(item) {
  const { lastDate } = getApplicationDates(item);
  if (!lastDate) return null;
  const d = new Date(lastDate);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

// ðŸ‘‡ NAYA: jaldi khatam hone wali jobs pehle, expired jobs sabse last me
function sortJobsByExpiry(items) {
  const now = Date.now();
  return items.slice().sort((a, b) => {
    const aTime = getExpiryTimestamp(a);
    const bTime = getExpiryTimestamp(b);
    const aExpired = aTime !== null && aTime < now;
    const bExpired = bTime !== null && bTime < now;

    if (aExpired !== bExpired) return aExpired ? 1 : -1;

    if (aExpired && bExpired) {
      if (aTime === null) return 1;
      if (bTime === null) return -1;
      return bTime - aTime;
    }

    if (aTime === null && bTime === null) return 0;
    if (aTime === null) return 1;
    if (bTime === null) return -1;
    return aTime - bTime;
  });
}

/* -------------------- Search dropdown (shared by sidebar + offcanvas) -------------------- */
function SearchDropdown({
  value,
  onChange,
  onSubmit,
  suggestions,
  showSuggestions,
  onFocus,
  onSelect,
  wrapRef,
  variant = 'sidebar',
}) {
  return (
    <div className={`rk-search-wrap rk-search-wrap--${variant}`} ref={wrapRef}>
      <form onSubmit={onSubmit} className="rk-search-form" autoComplete="off">
        
<svg className='rk-search-icon' width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.0002 21.0002L16.6572 16.6572M16.6572 16.6572C17.4001 15.9143 17.9894 15.0324 18.3914 14.0618C18.7935 13.0911 19.0004 12.0508 19.0004 11.0002C19.0004 9.9496 18.7935 8.90929 18.3914 7.93866C17.9894 6.96803 17.4001 6.08609 16.6572 5.34321C15.9143 4.60032 15.0324 4.01103 14.0618 3.60898C13.0911 3.20693 12.0508 3 11.0002 3C9.9496 3 8.90929 3.20693 7.93866 3.60898C6.96803 4.01103 6.08609 4.60032 5.34321 5.34321C3.84288 6.84354 3 8.87842 3 11.0002C3 13.122 3.84288 15.1569 5.34321 16.6572C6.84354 18.1575 8.87842 19.0004 11.0002 19.0004C13.122 19.0004 15.1569 18.1575 16.6572 16.6572Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder="Search jobs..."
          aria-label="Search jobs"
        />
        <button className="rk-search-button d-none" type="submit" aria-label="Submit Search">
          <i className="bi bi-arrow-right"></i>
        </button>
      </form>

      {showSuggestions && (
        <ul className="rk-search-dropdown">
          {suggestions.length === 0 ? (
            <li className="rk-search-dropdown-empty">No matching jobs</li>
          ) : (
            suggestions.map((item) => (
              <li key={item.id}>
                <Link prefetch={false} href={`/jobs/${getSlug(item)}`} onClick={() => onSelect(item)}>
                  <img src={resolveMediaUrl(item.hero_image)} alt={getTitle(item)} width={56} height={56} className="rk-blog-thumb" loading="eager" decoding="async" />
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

/* -------------------- Category slider (horizontal, used at top of offcanvas) -------------------- */
function CategorySlider({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="rk-cat-slider">
      <div className="rk-cat-slider-track">
        <button
          type="button"
          className={`rk-cat-chip ${!selectedCategory ? 'active' : ''}`}
          aria-label="All categories"
          onClick={() => onSelectCategory(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`rk-cat-chip ${selectedCategory === cat.id ? 'active' : ''}`}
            aria-label={`Filter by category: ${cat.course_name || cat.article_name || cat.name || cat.title}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.course_name || cat.article_name || cat.name || cat.title}
          </button>
        ))}
      </div>
    </div>
  );
}

function BlogCard({ article }) {
  const articleSlug = getSlug(article);
  const companyName = getCompanyName(article);
  const location = getLocation(article);
  const employmentType = getEmploymentType(article);
  const { begin, lastDate } = getApplicationDates(article);

  return (
    <div className="col-sm-6 col-lg-4">
      <article className="rk-blog-card">
        <Link prefetch={false} href={`/jobs/${articleSlug}`} className="rk-blog-card-img">
          <img src={resolveMediaUrl(article.hero_image || article.image)} alt={getTitle(article)} width={640} height={380} className="rk-blog-card-img" loading="eager" decoding="async" />
          <span className="rk-blog-cat">{getCategoryLabel(article)}</span>
        </Link>
        <div className="rk-blog-card-body">
          <span className="rk-blog-date d-none">
            <svg width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1_844)">
                <path d="M5.673 0C5.85865 0 6.0367 0.0737498 6.16797 0.205025C6.29925 0.336301 6.373 0.514348 6.373 0.7V2.009H13.89V0.709C13.89 0.523348 13.9637 0.345301 14.095 0.214025C14.2263 0.0827498 14.4043 0.009 14.59 0.009C14.7757 0.009 14.9537 0.0827498 15.085 0.214025C15.2162 0.345301 15.29 0.523348 15.29 0.709V2.009H18C18.5303 2.009 19.0388 2.21958 19.4139 2.59443C19.7889 2.96929 19.9997 3.47774 20 4.008V18.001C19.9997 18.5313 19.7889 19.0397 19.4139 19.4146C19.0388 19.7894 18.5303 20 18 20H2C1.46974 20 0.961184 19.7894 0.58614 19.4146C0.211096 19.0397 0.00026513 18.5313 0 18.001L0 4.008C0.00026513 3.47774 0.211096 2.96929 0.58614 2.59443C0.961184 2.21958 1.46974 2.009 2 2.009H4.973V0.699C4.97327 0.513522 5.04713 0.335731 5.17838 0.204672C5.30963 0.0736123 5.48752 -1.89263e-07 5.673 0ZM1.4 7.742V18.001C1.4 18.0798 1.41552 18.1578 1.44567 18.2306C1.47583 18.3034 1.52002 18.3695 1.57574 18.4253C1.63145 18.481 1.69759 18.5252 1.77039 18.5553C1.84319 18.5855 1.92121 18.601 2 18.601H18C18.0788 18.601 18.1568 18.5855 18.2296 18.5553C18.3024 18.5252 18.3685 18.481 18.4243 18.4253C18.48 18.3695 18.5242 18.3034 18.5543 18.2306C18.5845 18.1578 18.6 18.0798 18.6 18.001V7.756L1.4 7.742ZM6.667 14.619V16.285H5V14.619H6.667ZM10.833 14.619V16.285H9.167V14.619H10.833ZM15 14.619V16.285H13.333V14.619H15ZM6.667 10.642V12.308H5V10.642H6.667ZM10.833 10.642V12.308H9.167V10.642H10.833ZM15 10.642V12.308H13.333V10.642H15ZM4.973 3.408H2C1.92121 3.408 1.84319 3.42352 1.77039 3.45367C1.69759 3.48382 1.63145 3.52802 1.57574 3.58374C1.52002 3.63945 1.47583 3.70559 1.44567 3.77839C1.41552 3.85119 1.4 3.92921 1.4 4.008V6.343L18.6 6.357V4.008C18.6 3.92921 18.5845 3.85119 18.5543 3.77839C18.5242 3.70559 18.48 3.63945 18.4243 3.58374C18.3685 3.52802 18.3024 3.48382 18.2296 3.45367C18.1568 3.42352 18.0788 3.408 18 3.408H15.29V4.337C15.29 4.52265 15.2162 4.7007 15.085 4.83197C14.9537 4.96325 14.7757 5.037 14.59 5.037C14.4043 5.037 14.2263 4.96325 14.095 4.83197C13.9637 4.7007 13.89 4.52265 13.89 4.337V3.408H6.373V4.328C6.373 4.51365 6.29925 4.6917 6.16797 4.82297C6.0367 4.95425 5.85865 5.028 5.673 5.028C5.48735 5.028 5.3093 4.95425 5.17803 4.82297C5.04675 4.6917 4.973 4.51365 4.973 4.328V3.408Z" fill="#6B7280"/>
              </g>
              <defs>
                <clipPath id="clip0_1_844">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            {formatDate(article.created_at)}
          </span>
          <h3>
            <Link prefetch={false} href={`/jobs/${articleSlug}`}>{getTitle(article)}</Link>
          </h3>
          {companyName ? <p className="rk-job-company">{companyName}</p> : null}
          <p>{getDescription(article)}</p>
          <div className="rk-job-meta-row">
            {location ? <span className="rk-job-pill">{location}</span> : null}
            {employmentType ? <span className="rk-job-pill">{employmentType}</span> : null}
          </div>
          {(begin || lastDate) ? (
            <div className="rk-job-meta-row mt-2 d-none">
              {begin ? <span className="rk-job-pill">Apply From: {formatApplicationDate(begin)}</span> : null}
              {lastDate ? <span className="rk-job-pill">Last Date: {formatApplicationDate(lastDate)}</span> : null}
            </div>
          ) : null}
          <Link prefetch={false} href={`/jobs/${articleSlug}`} className="rk-blog-readmore">
            View Job
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 18L20 12L14 6M20 12H9.5M4 12H6.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </article>
    </div>
  );
}

function Sidebar({
  latest,
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearch,
  onSubmit,
}) {
  return (
    <aside className="rk-blog-sidebar">
      <div className="rk-widget rk-widget-search">
        <h4>Search</h4>
        <form onSubmit={onSubmit} className="rk-search-form">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search jobs..."
            aria-label="Search jobs"
          />
          <button className="rk-search-button d-none" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>

      <div className="rk-widget rk-widget-latest">
        <h4>Latest Jobs</h4>
        <ul>
          {latest.map((item) => (
            <li key={item.id}>
              <Link prefetch={false} href={`/jobs/${getSlug(item)}`} className="rk-blog-card-img">
                <img src={resolveMediaUrl(item.hero_image)} alt={getTitle(item)} width={56} height={56} className="rk-blog-thumb" loading="eager" decoding="async" />
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
  );
}

function Pagination({ currentPage, hasMore, onPageChange }) {
  const maxKnownPage = hasMore ? currentPage + 1 : currentPage;
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(maxKnownPage, currentPage + 2);

  if (start > 1) pages.push(1);
  if (start > 2) pages.push('...');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < maxKnownPage - 1) pages.push('...');
  if (end < maxKnownPage) pages.push(maxKnownPage);

  if (maxKnownPage <= 1) return null;

  return (
    <nav className="rk-pagination" aria-label="Blog pagination">
      <button
        type="button"
        className="rk-page-arrow"
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        onClick={() => onPageChange(currentPage - 1)}
      >
        <i className="bi bi-chevron-left"></i> Prev
      </button>

      <ul>
        {pages.map((p, idx) =>
          p === '...' ? (
            <li key={`dots-${idx}`} className="rk-page-dots">â€¦</li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className={p === currentPage ? 'active' : ''}
                aria-label={`Go to page ${p}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            </li>
          )
        )}
      </ul>

      <button
        type="button"
        className="rk-page-arrow"
        disabled={!hasMore}
        aria-label="Go to next page"
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next <i className="bi bi-chevron-right"></i>
      </button>
    </nav>
  );
}

function BlogPageContent({ initialArticles = [], initialCategories = [] }) {
  // ðŸ‘‡ SSR se aaye hue initial data se state seed karo â€” is-tarah pehla
  // render (jo Googlebot dekhta hai) already jobs se bhara hoga, khaali nahi.
  const [articles, setArticles] = useState(initialArticles.slice(0, PAGE_SIZE));
  const [latest, setLatest] = useState(() =>
    initialArticles.slice(0, 3)
  );
  const [categories, setCategories] = useState(initialCategories);
  // ðŸ‘‡ NAYA: static export (no Node server) me useSearchParams() use nahi karte â€”
  // wo hook Suspense boundary maangta hai aur build ke time uska fallback hi
  // static HTML me bake ho jaata hai (Googlebot ko sirf "Loading..." dikhta hai).
  // Iski jagah plain window.location.search read karte hain, sirf client-side,
  // jisse main content kabhi kisi fallback ke peeche block nahi hota.
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search') || params.get('q') || '';
    if (q) {
      setSearch(q);
      setSearchInput(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [categoryId, setCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialArticles.length > PAGE_SIZE);
  const [loading, setLoading] = useState(initialArticles.length === 0);
  const searchDebounce = useRef(null);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  // Search-suggestion dropdown state (offcanvas search only)
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestDebounce = useRef(null);
  const offcanvasSearchWrapRef = useRef(null);
  const offcanvasCloseRef = useRef(null);

  // ðŸ‘‡ In dono ref ka kaam: pehle mount pe agar SSR data already sahi hai
  // (default view â€” koi search/category nahi), to client-side fetch skip
  // karo. Isse Googlebot ke liye SSR data kabhi overwrite/empty nahi hoga
  // agar API robots.txt se blocked ho.
  const skippedInitialArticlesFetch = useRef(false);
  const skippedInitialSidebarFetch = useRef(false);

  const selectedCategory = categoryId;

  const fetchArticles = async (targetPage = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${getContentCacheUrl('jobs.json')}?v=${Date.now()}`, { cache: 'no-store' });
      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.items || data.results || []);

      const normalizedSearch = search.trim().toLowerCase();
      const filteredItems = items.filter((item) => {
        const haystack = [
          getTitle(item),
          getDescription(item),
          getCategoryLabel(item),
          getCompanyName(item),
          getLocation(item),
          getEmploymentType(item),
        ].join(' ').toLowerCase();

        const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch);
        const selectedCategory = categoryId ? Number(categoryId) : null;
        const matchesCategory = !selectedCategory || Number(item.course_type || item.category_id || item.category?.id || item.course_category?.id) === selectedCategory;

        return matchesSearch && matchesCategory;
      });

      const sortedItems = sortJobsByExpiry(filteredItems); // ðŸ‘ˆ NAYA: jaldi expire hone wali jobs pehle, expired last me

      const total = sortedItems.length;
      const pagedItems = sortedItems.slice((targetPage - 1) * PAGE_SIZE, targetPage * PAGE_SIZE);

      setArticles(pagedItems);
      setPage(targetPage);
      setHasMore(targetPage * PAGE_SIZE < total);
    } catch (error) {
      console.error(error);
      // ðŸ‘‡ Sirf tab khaali karo jab humare paas already koi achha
      // SSR data na ho â€” warna network fail hone par (jaise robots.txt
      // block ki wajah se Googlebot ke liye) good content overwrite ho jaayega.
      if (initialArticles.length === 0) {
        setArticles([]);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSidebar = async () => {
    try {
      const [jobsRes, categoriesRes] = await Promise.all([
        fetch(`${getContentCacheUrl('jobs.json')}?v=${Date.now()}`, { cache: 'no-store' }),
        fetch(`${getContentCacheUrl('job-categories.json')}?v=${Date.now()}`, { cache: 'no-store' }),
      ]);
      const jobsData = await jobsRes.json();
      const categoriesData = await categoriesRes.json();
      const jobs = Array.isArray(jobsData) ? jobsData : (jobsData.items || jobsData.results || []);
      const latestItems = jobs
        .slice()
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .slice(0, 3);
      setLatest(latestItems);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error(error);
      // ðŸ‘‡ SSR se already latest/categories hain to khaali mat karo
      if (initialArticles.length === 0) setLatest([]);
      if (initialCategories.length === 0) setCategories([]);
    }
  };

  useEffect(() => {
    if (!skippedInitialSidebarFetch.current) {
      skippedInitialSidebarFetch.current = true;
      // Initial JSON sirf first paint ke liye hai; live data API se refresh hota hai.
    }
    fetchSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (previousPathname.current === '/jobs' && pathname !== '/jobs') {
      setSearch('');
      setSearchInput('');
      setCategoryId(null);
      setSuggestions([]);
      setShowSuggestions(false);
    }
    previousPathname.current = pathname;
  }, [pathname]);

  // Accessibility fix for touch target size
  useEffect(() => {
    const styleId = 'dynamic-touch-target-styles';
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      /* Increase size and spacing for Owl Carousel dots */
      .owl-dots .owl-dot {
        width: 24px !important;
        height: 24px !important;
        margin: 5px 7px !important;
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
      }

      /* Increase size and spacing for custom rk-dot buttons */
      .rk-dot {
        min-width: 24px;
        min-height: 24px;
        padding: 4px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // Accessibility fix for dynamically added buttons (e.g., Owl Carousel dots)
  useEffect(() => {
    const applyDotLabels = () => {
      const dotButtons = document.querySelectorAll('.owl-dot');
      dotButtons.forEach((button, index) => {
        const label = `Go to slide ${index + 1}`;
        button.setAttribute('aria-label', label);
        button.setAttribute('title', label);
        button.setAttribute('type', 'button');

        if (!button.querySelector('.rk-sr-only')) {
          const srOnly = document.createElement('span');
          srOnly.className = 'rk-sr-only';
          srOnly.textContent = label;
          button.appendChild(srOnly);
        }
      });
    };

    applyDotLabels();

    const observer = new MutationObserver((mutations) => {
      const hasNewNodes = mutations.some((m) => m.addedNodes.length > 0);
      if (hasNewNodes) {
        applyDotLabels();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!skippedInitialArticlesFetch.current) {
      skippedInitialArticlesFetch.current = true;
      // Initial JSON sirf first paint ke liye hai; live data API se refresh hota hai.
    }
    fetchArticles(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryId]);

  useEffect(() => {
    if (searchDebounce.current) {
      clearTimeout(searchDebounce.current);
    }
    searchDebounce.current = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 400);
    return () => {
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
    };
  }, [searchInput]);

  // Live suggestion dropdown - separate from the debounced main-list search above
  useEffect(() => {
    if (suggestDebounce.current) clearTimeout(suggestDebounce.current);

    const term = searchInput.trim();
    if (term.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    suggestDebounce.current = setTimeout(async () => {
      try {
        const response = await fetch(`${getContentCacheUrl('jobs.json')}?v=${Date.now()}`, { cache: 'no-store' });
        const data = await response.json();
        const items = Array.isArray(data) ? data : (data.items || data.results || []);
        const filteredSuggestions = items.filter((item) => {
          const haystack = [getTitle(item), getDescription(item), getCategoryLabel(item), getCompanyName(item), getLocation(item)].join(' ').toLowerCase();
          return haystack.includes(term.toLowerCase());
        });
        setSuggestions(filteredSuggestions.slice(0, SUGGESTION_LIMIT));
        setShowSuggestions(true);
      } catch (error) {
        console.error(error);
        setSuggestions([]);
      }
    }, 300);

    return () => {
      if (suggestDebounce.current) clearTimeout(suggestDebounce.current);
    };
  }, [searchInput]);

  // Close suggestion dropdown on outside click
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

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = () => {
    setShowSuggestions(false);
    closeOffcanvas();
  };

  const handlePageChange = (nextPage) => {
    fetchArticles(nextPage);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const closeOffcanvas = () => {
    if (offcanvasCloseRef.current) {
      offcanvasCloseRef.current.click();
    }
  };

  // Selecting a category chip filters the list AND closes the offcanvas
  const handleCategoryClick = (id) => {
    setCategoryId(id);
    closeOffcanvas();
  };

  return (
    <>

      <div className="rk-blog-scope">
      <section className="container-fluid custom-container small-hero-area">
        <div className='left-part'>
          <div>
            <label className="tl-eyebrow">
              <IconBlog />Jobs
            </label>
            <h1 className="fs-mob-22">Find your next opportunity</h1>
          </div>
          <p className='fs-mob-16'>Browse the latest job openings, explore company details, and discover roles that match your career goals.</p>
        </div>
        <div className='right-part'>
          <img
            src="/front-assets/images/job-hero.webp"
            className='img-fluid'
            width={500}
            height={360}
            alt="ResumeSathi latest job openings and career opportunities"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </section>

      <CategorySlider
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryClick}
      />
      <section className="rk-blog-page">
        <div className="container-fluid custom-container pb-120">
          <div className="row g-4">
            <div className="col-md-8 col-lg-9">
              {loading ? (
                <div className="rk-loading">
                  <div className="rk-spinner"></div>
                  Loading jobs...
                </div>
              ) : articles.length === 0 ? (
                <div className="rk-empty">
                  <i className="bi bi-inboxes"></i>
                  <p>No jobs found for these filters.</p>
                </div>
              ) : (
                <>
                  <div className="row g-3">
                    {articles.map((article) => (
                      <BlogCard key={article.id} article={article} />
                    ))}
                  </div>
                  <Pagination currentPage={page} hasMore={hasMore} onPageChange={handlePageChange} />
                </>
              )}
            </div>

            <div className="col-md-4 col-lg-3 d-none d-md-block">
              <Sidebar
                latest={latest}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setCategoryId}
                searchQuery={searchInput}
                onSearch={setSearchInput}
                onSubmit={handleSearchSubmit}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="offcanvas offcanvas-start rk-blog-offcanvas" data-bs-scroll="true" data-bs-backdrop="true" tabIndex="-1" id="BlogsOffcanvas" aria-labelledby="commonOffcanvasLabel">
        <div className='offcanvas-tools-sidebar'>
          <div className="header">
            <div className='left-side'>
             <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.5 2.51563H10.925C10.1578 2.51563 9.40781 2.73594 8.7625 3.15156L8 3.64063L7.2375 3.15156C6.59283 2.73602 5.84199 2.51522 5.075 2.51563H1.5C1.22344 2.51563 1 2.73906 1 3.01563V11.8906C1 12.1672 1.22344 12.3906 1.5 12.3906H5.075C5.84219 12.3906 6.59219 12.6109 7.2375 13.0266L7.93125 13.4734C7.95156 13.4859 7.975 13.4938 7.99844 13.4938C8.02187 13.4938 8.04531 13.4875 8.06563 13.4734L8.75937 13.0266C9.40625 12.6109 10.1578 12.3906 10.925 12.3906H14.5C14.7766 12.3906 15 12.1672 15 11.8906V3.01563C15 2.73906 14.7766 2.51563 14.5 2.51563ZM5.075 11.2656H2.125V3.64063H5.075C5.62812 3.64063 6.16562 3.79844 6.62969 4.09688L7.39219 4.58594L7.5 4.65625V11.875C6.75625 11.475 5.925 11.2656 5.075 11.2656ZM13.875 11.2656H10.925C10.075 11.2656 9.24375 11.475 8.5 11.875V4.65625L8.60781 4.58594L9.37031 4.09688C9.83438 3.79844 10.3719 3.64063 10.925 3.64063H13.875V11.2656ZM6.20156 5.64063H3.29844C3.2375 5.64063 3.1875 5.69375 3.1875 5.75781V6.46094C3.1875 6.525 3.2375 6.57813 3.29844 6.57813H6.2C6.26094 6.57813 6.31094 6.525 6.31094 6.46094V5.75781C6.3125 5.69375 6.2625 5.64063 6.20156 5.64063ZM9.6875 5.75781V6.46094C9.6875 6.525 9.7375 6.57813 9.79844 6.57813H12.7C12.7609 6.57813 12.8109 6.525 12.8109 6.46094V5.75781C12.8109 5.69375 12.7609 5.64063 12.7 5.64063H9.79844C9.7375 5.64063 9.6875 5.69375 9.6875 5.75781ZM6.20156 7.82813H3.29844C3.2375 7.82813 3.1875 7.88125 3.1875 7.94531V8.64844C3.1875 8.7125 3.2375 8.76563 3.29844 8.76563H6.2C6.26094 8.76563 6.31094 8.7125 6.31094 8.64844V7.94531C6.3125 7.88125 6.2625 7.82813 6.20156 7.82813ZM12.7016 7.82813H9.79844C9.7375 7.82813 9.6875 7.88125 9.6875 7.94531V8.64844C9.6875 8.7125 9.7375 8.76563 9.79844 8.76563H12.7C12.7609 8.76563 12.8109 8.7125 12.8109 8.64844V7.94531C12.8125 7.88125 12.7625 7.82813 12.7016 7.82813Z" fill="#fff"/>
</svg>

              <p>Jobs</p>
            </div>

            <button ref={offcanvasCloseRef} type="button" className='right-side-btn' data-bs-dismiss="offcanvas" aria-label="Close">
          <img src="/front-assets/images/icons/close-cross.svg" alt="Close" />
            </button>
          </div>

          {/* Category slider - pinned at the top, horizontally scrollable */}
          <CategorySlider
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryClick}
          />

          <div className="scroll-div pb-mob-100">

            {/* Search - always visible, dropdown suggestions */}
            <div className="rk-offcanvas-section">
              <SearchDropdown
                value={searchInput}
                onChange={setSearchInput}
                onSubmit={handleSearchSubmit}
                suggestions={suggestions}
                showSuggestions={showSuggestions}
                onFocus={() => searchInput.trim().length >= 2 && setShowSuggestions(true)}
                onSelect={handleSelectSuggestion}
                wrapRef={offcanvasSearchWrapRef}
                variant="offcanvas"
              />
            </div>

            {/* Latest Articles - always visible */}
            <div className="rk-offcanvas-section">
              <h4><i className="bi bi-clock-history"></i> Latest Jobs</h4>
              <div className="rk-offcanvas-latest-list">
                {latest.map((item) => (
                  <Link prefetch={false}
                    key={item.id}
                    href={`/jobs/${getSlug(item)}`}
                    className="rk-latest-sub-item"
                    onClick={closeOffcanvas}
                  >
                    <img src={resolveMediaUrl(item.hero_image)} width={40} height={40} alt={getTitle(item)} className="rk-blog-thumb" loading="eager" decoding="async" />
                    <div>
                      <span className="rk-latest-sub-title">{getTitle(item)}</span>
                      <span className="rk-latest-sub-date">{formatDate(item.created_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Build Your Resume */}
          <div className="rk-offcanvas-cta">
            <Link prefetch={false} href="/resume" className="rk-cta-btn" onClick={closeOffcanvas}>
              <i className="bi bi-plus-lg"></i> Build Your Resume
            </Link>
          </div>
        </div>
      </div>
      </div>

    </>
  );
}

export default function JobsPageClient({ initialArticles = [], initialCategories = [] }) {
  return (
    <BlogPageContent initialArticles={initialArticles} initialCategories={initialCategories} />
  );
}


