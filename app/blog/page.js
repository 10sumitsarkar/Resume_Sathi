"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import './blog.css';

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE || 'http://localhost:8000';
const API_BASE = `${BACKEND_BASE}/api`;
const DEFAULT_IMAGE = '/front-assets/images/resume-hero.webp';
const PAGE_SIZE = 10;

function resolveMediaUrl(url) {
  if (!url) return DEFAULT_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url;
  }
  return `${BACKEND_BASE}/${url.replace(/^\/+/, '')}`;
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function BlogCard({ article }) {
  const articleSlug = article.slug || article.url_name || article.canonical_tag;
  return (
    <article className="rk-blog-card">
      <Link href={`/blog/${articleSlug}`} className="rk-blog-card-img">
        <img src={resolveMediaUrl(article.hero_image)} alt={article.article_title || article.title} />
      </Link>
      <div className="rk-blog-card-body">
        <span className="rk-blog-cat">{article.category?.article_name || article.category?.name || article.category?.title || 'General'}</span>
        <h3>
          <Link href={`/blog/${articleSlug}`}>{article.article_title || article.title}</Link>
        </h3>
        <p>{article.description || article.meta_description || article.article_title}</p>
        <div className="rk-blog-meta">
          <span>{formatDate(article.created_at)}</span>
          <Link href={`/blog/${articleSlug}`} className="rk-blog-readmore">Read More</Link>
        </div>
      </div>
    </article>
  );
}

function Sidebar({ latest, categories, selectedCategory, onSelectCategory, searchQuery, onSearch, onSubmit }) {
  return (
    <aside className="rk-blog-sidebar">
      <div className="rk-widget rk-widget-search">
        <h4>Search</h4>
        <form onSubmit={onSubmit}>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search articles..."
            aria-label="Search articles"
          />
          <button className="rk-search-button" type="submit">Search</button>
        </form>
      </div>

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

      <div className="rk-widget rk-widget-categories">
        <h4>Categories</h4>
        <ul>
          <li className={!selectedCategory ? 'active' : ''}>
            <button type="button" onClick={() => onSelectCategory(null)}>
              All Categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id} className={selectedCategory === cat.id ? 'active' : ''}>
              <button type="button" onClick={() => onSelectCategory(cat.id)}>
                {cat.article_name || cat.name || cat.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default function BlogPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || searchParams?.get('q') || '';

  const [articles, setArticles] = useState([]);
  const [latest, setLatest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);
  const searchDebounce = useRef(null);

  const fetchArticles = async (nextPage = 1, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categoryId) params.set('category_id', String(categoryId));
      params.set('limit', String(PAGE_SIZE));
      params.set('page', String(nextPage));

      const response = await fetch(`${API_BASE}/articles?${params.toString()}`);
      const data = await response.json();
      const items = Array.isArray(data) ? data : [];

      if (reset) {
        setArticles(items);
      } else {
        setArticles((prev) => [...prev, ...items]);
      }

      setPage(nextPage);
      setHasMore(items.length === PAGE_SIZE);
    } catch (error) {
      console.error(error);
      if (reset) {
        setArticles([]);
      }
      setHasMore(false);
    } finally {
      if (reset) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const fetchSidebar = async () => {
    try {
      const [latestRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE}/articles/latest?limit=5`),
        fetch(`${API_BASE}/article-categories`),
      ]);
      const latestData = await latestRes.json();
      const categoriesData = await categoriesRes.json();
      setLatest(Array.isArray(latestData) ? latestData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error(error);
      setLatest([]);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchSidebar();
  }, []);

  useEffect(() => {
    setHasMore(true);
    fetchArticles(1, true);
  }, [search, categoryId]);

  useEffect(() => {
    if (!sentinelRef.current || loading || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingMore && !loading && hasMore) {
          fetchArticles(page + 1, false);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [page, loading, loadingMore, hasMore]);

  useEffect(() => {
    if (searchDebounce.current) {
      clearTimeout(searchDebounce.current);
    }

    searchDebounce.current = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 400);

    return () => {
      if (searchDebounce.current) {
        clearTimeout(searchDebounce.current);
      }
    };
  }, [searchInput]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  return (
    <section className="rk-blog-page container">
      <div className="rk-blog-grid-layout">
        <div className="rk-blog-main">
          <div className="rk-blog-header">
            <h1>All Articles</h1>
            <p>Browse the latest articles, learn new tips, and explore career insights.</p>
          </div>

          {loading ? (
            <div className="rk-loading">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="rk-empty">No articles found for these filters.</div>
          ) : (
            <>
              <div className="rk-blog-list">
                {articles.map((article) => (
                  <BlogCard key={article.id} article={article} />
                ))}
              </div>
              <div ref={sentinelRef} className="rk-load-more-sentinel">
                {loadingMore ? 'Loading more articles...' : hasMore ? 'Scroll to load more articles' : 'No more articles.'}
              </div>
            </>
          )}
        </div>

        <Sidebar
          latest={latest}
          categories={categories}
          selectedCategory={categoryId}
          onSelectCategory={setCategoryId}
          searchQuery={searchInput}
          onSearch={setSearchInput}
          onSubmit={handleSearchSubmit}
        />
      </div>
    </section>
  );
}
