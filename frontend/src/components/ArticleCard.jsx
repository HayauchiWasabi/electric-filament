import React, { useState } from 'react';
import useStore from '../store/useStore';

const ArticleCard = ({ article }) => {
    const { articleTags, addArticleTag, removeArticleTag } = useStore();
    const [isHovered, setIsHovered] = useState(false);
    const [showTagInput, setShowTagInput] = useState(false);
    const [tagInput, setTagInput] = useState('');

    // Get specific tags for this article
    const myTags = articleTags[article.link] || [];

    // Combine feed tags and article tags for display
    const allTags = [...(article.feedTags || []), ...myTags];

    // Dedup tags for display
    const uniqueTags = [...new Set(allTags)];

    const handleAddTag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (tagInput.trim()) {
            addArticleTag(article.link, tagInput.trim());
            setTagInput('');
            setShowTagInput(false);
        }
    };

    const handleRemoveTag = (e, tag) => {
        e.preventDefault();
        e.stopPropagation();
        // Only remove manually added article tags
        if (myTags.includes(tag)) {
            removeArticleTag(article.link, tag);
        }
    };

    return (
        <div
            className="card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => window.open(article.link, '_blank')}
            style={{
                cursor: 'pointer',
                border: '1px solid var(--border-subtle)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                transform: isHovered ? 'translateY(-4px)' : 'none',
                boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.2)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative'
            }}
        >
            {/* Tag Overlay/Actions */}
            <div style={{ padding: '0 1.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {uniqueTags.map(tag => (
                    <span key={tag} style={{
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: myTags.includes(tag) ? 'var(--accent-glow)' : 'rgba(255,255,255,0.1)',
                        color: myTags.includes(tag) ? 'var(--accent-secondary)' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        #{tag}
                        {myTags.includes(tag) && (
                            <span
                                onClick={(e) => handleRemoveTag(e, tag)}
                                style={{ cursor: 'pointer', fontWeight: 'bold' }}
                            >&times;</span>
                        )}
                    </span>
                ))}

                {/* Add Tag Button */}
                {showTagInput ? (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                            placeholder="Tag..."
                            autoFocus
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--accent-primary)',
                                borderRadius: '4px',
                                color: 'var(--text-primary)',
                                fontSize: '0.75rem',
                                padding: '2px 4px',
                                width: '60px'
                            }}
                        />
                        <button
                            onClick={() => setShowTagInput(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            &times;
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowTagInput(true); }}
                        style={{
                            background: 'none',
                            border: '1px dashed var(--text-muted)',
                            borderRadius: '50%',
                            color: 'var(--text-muted)',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.2s'
                        }}
                        title="Add Tag"
                    >
                        +
                    </button>
                )}
            </div>

            {article.enclosure && article.enclosure.url && (
                <div style={{ height: '160px', overflow: 'hidden' }}>
                    <img
                        src={article.enclosure.url}
                        alt={article.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            )}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    {article.source || 'Unknown Source'} • {new Date(article.isoDate || article.pubDate).toLocaleDateString()}
                </div>
                <h3 className="card-title" style={{ marginTop: 0, marginBottom: '0.75rem' }}>
                    {article.title}
                </h3>
                <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    flexGrow: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {article.contentSnippet || article.content}
                </p>
            </div>
        </div>
    );
};

export default ArticleCard;
