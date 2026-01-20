import React from 'react';

const ArticleCard = ({ article }) => {
    // Extract simple image if present in content (very basic regex for MVP)
    const imgMatch = article.content?.match(/<img[^>]+src="([^">]+)"/);
    const image = imgMatch ? imgMatch[1] : null;

    const dateStr = new Date(article.isoDate || article.pubDate).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="article-card"
            style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'transform 0.3s var(--ease-spring), box-shadow 0.3s var(--ease-spring)',
                height: '100%'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'var(--text-muted)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
        >
            {image && (
                <div style={{ height: '180px', overflow: 'hidden' }}>
                    <img
                        src={image}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            )}

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent-secondary)',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    {article.source || 'RSS Feed'}
                </div>

                <h3 style={{
                    margin: '0 0 0.75rem 0',
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-heading)',
                    lineHeight: 1.3
                }}>
                    {article.title}
                </h3>

                <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {article.contentSnippet?.replace(/<[^>]+>/g, '') /* Basic strip HTML */}
                </p>

                <div style={{ marginTop: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {dateStr}
                </div>
            </div>
        </a>
    );
};

export default ArticleCard;
