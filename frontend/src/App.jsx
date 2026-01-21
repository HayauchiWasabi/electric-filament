import React, { useEffect } from 'react';
import ArticleCard from './components/ArticleCard';
import AddFeed from './components/AddFeed';
import FilterBar from './components/FilterBar';
import DailyBriefing from './components/DailyBriefing';
import useStore, { migrateData } from './store/useStore';

function App() {
  const {
    feeds,
    articles,
    loading,
    error,
    addFeed,
    removeFeed,
    fetchFeeds,
    activeTag,
    articleTags, // Needed for filtering
    generateSummary,
    isSummarizing
  } = useStore();

  useEffect(() => {
    // Attempt migration (handling both v0->v1 and v1->v2)
    migrateData();

    // Initial fetch if feeds exist
    fetchFeeds();
  }, [fetchFeeds]);

  // Update handler to accept tags
  const handleAddFeed = (url, tags) => addFeed(url, tags);
  const handleRemoveFeed = (id) => removeFeed(id);

  // Filter articles based on activeTag (Combined Logic)
  const visibleArticles = activeTag
    ? articles.filter(article => {
      // Check Feed Level Tags
      const hasFeedTag = article.feedTags && article.feedTags.includes(activeTag);

      // Check Article Level Tags
      const myTags = articleTags[article.link] || [];
      const hasArticleTag = myTags.includes(activeTag);

      return hasFeedTag || hasArticleTag;
    })
    : articles;

  return (
    <div className="container">
      <header style={{
        textAlign: 'center',
        marginBottom: '3rem',
        paddingTop: '2rem'
      }}>
        <h1 className="heading title-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Pulse Reader
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Your personalized news ecosystem
        </p>

        {/* AI Action Button */}
        {articles.length > 0 && (
          <button
            onClick={generateSummary}
            disabled={isSummarizing}
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              border: 'none'
            }}
          >
            {isSummarizing ? 'Generating Report...' : '✨ Generate Daily Briefing'}
          </button>
        )}
      </header>

      <DailyBriefing />

      <AddFeed onAdd={handleAddFeed} loading={loading} />

      <FilterBar />

      {error && (
        <div style={{ textAlign: 'center', color: '#ef4444', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {/* Subscription List (Mini) - Updated for Object Structure */}
      {feeds.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.8rem',
          flexWrap: 'wrap',
          marginBottom: '3rem'
        }}>
          {feeds.map(feed => (
            <div key={feed.id} style={{
              background: 'var(--bg-card)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {feed.url.replace(/https?:\/\/(www\.)?/, '').split('/')[0]}
                </span>
                <button
                  onClick={() => handleRemoveFeed(feed.id)}
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
              </div>
              {/* Show Tags */}
              {feed.tags && feed.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  {feed.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: '0.7rem',
                      background: 'var(--accent-glow)',
                      color: 'var(--accent-secondary)', // Cyan for text
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {loading && articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading your universe...
        </div>
      ) : (
        <div className="masonry-grid">
          {visibleArticles.map((article, idx) => (
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
