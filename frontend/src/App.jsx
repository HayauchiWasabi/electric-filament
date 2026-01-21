import React, { useEffect } from 'react';
import ArticleCard from './components/ArticleCard';
import AddFeed from './components/AddFeed';
import useStore, { migrateFromLegacy } from './store/useStore';

// Constants
// const BACKEND_URL = 'http://localhost:3001'; // Moved to store

function App() {
  const {
    feeds,
    articles,
    loading,
    error,
    addFeed,
    removeFeed,
    fetchFeeds
  } = useStore();

  useEffect(() => {
    // Attempt migration on mount (one-time check)
    migrateFromLegacy();

    // Initial fetch if feeds exist
    fetchFeeds();
  }, [fetchFeeds]);

  // Use store actions directly
  const handleAddFeed = (url) => addFeed(url);
  const handleRemoveFeed = (url) => removeFeed(url);

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
