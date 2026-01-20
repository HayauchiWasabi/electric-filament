import React, { useState, useEffect } from 'react';
import ArticleCard from './components/ArticleCard';
import AddFeed from './components/AddFeed';

// Constants
const BACKEND_URL = 'http://localhost:3001';

function App() {
  const [feeds, setFeeds] = useState(() => {
    const saved = localStorage.getItem('rss_feeds');
    return saved ? JSON.parse(saved) : [];
  });

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Save feeds whenever they change
    localStorage.setItem('rss_feeds', JSON.stringify(feeds));
  }, [feeds]);

  useEffect(() => {
    // Initial fetch
    if (feeds.length > 0) {
      refreshFeeds();
    }
  }, [feeds]); // Refetch when feeds list changes

  const refreshFeeds = async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = feeds.map(async (url) => {
        try {
          const res = await fetch(`${BACKEND_URL}/parse-feed?url=${encodeURIComponent(url)}`);
          if (!res.ok) throw new Error('Failed to fetch');
          const data = await res.json();
          // tag items with source title
          return data.items.map(item => ({ ...item, source: data.title, feedUrl: url }));
        } catch (err) {
          console.error(`Error fetching ${url}:`, err);
          return [];
        }
      });

      const results = await Promise.all(promises);
      const allArticles = results.flat();

      // Sort by date (newest first)
      allArticles.sort((a, b) => {
        const dateA = new Date(a.isoDate || a.pubDate);
        const dateB = new Date(b.isoDate || b.pubDate);
        return dateB - dateA;
      });

      setArticles(allArticles);
    } catch (err) {
      setError('Failed to refresh feeds.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeed = (url) => {
    if (!feeds.includes(url)) {
      setFeeds(prev => [...prev, url]);
    }
  };

  const handleRemoveFeed = (urlToRemove) => {
    setFeeds(prev => prev.filter(url => url !== urlToRemove));
  };

  return (
    <div className="container">
      <header style={{
        textAlign: 'center',
        marginBottom: '4rem',
        paddingTop: '2rem'
      }}>
        <h1 className="heading title-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Pulse Reader
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Your personalized news ecosystem
        </p>
      </header>

      <AddFeed onAdd={handleAddFeed} loading={loading} />

      {error && (
        <div style={{ textAlign: 'center', color: '#ef4444', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {/* Subscription List (Mini) */}
      {feeds.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '3rem'
        }}>
          {feeds.map(url => (
            <span key={url} style={{
              background: 'var(--bg-card)',
              padding: '0.4rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)'
            }}>
              {url.replace(/https?:\/\/(www\.)?/, '').split('/')[0]}
              <button
                onClick={() => handleRemoveFeed(url)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {loading && articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading your universe...
        </div>
      ) : (
        <div className="masonry-grid">
          {articles.map((article, idx) => (
            <ArticleCard key={`${article.link}-${idx}`} article={article} />
          ))}
        </div>
      )}

      {!loading && articles.length === 0 && feeds.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          Subscribe to a feed to get started. <br />
          (Try <code>https://hnrss.org/frontpage</code>)
        </div>
      )}
    </div>
  );
}

export default App;
