import React from 'react';
import useStore from '../store/useStore';

const FilterBar = () => {
    const { feeds, activeTag, setActiveTag } = useStore();

    // Extract all unique tags
    const allTags = Array.from(new Set(feeds.flatMap(f => f.tags || []))).sort();

    if (allTags.length === 0) return null;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.8rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
        }}>
            <button
                onClick={() => setActiveTag(null)}
                style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    border: '1px solid var(--border-subtle)',
                    background: activeTag === null ? 'var(--accent-primary)' : 'var(--bg-card)',
                    color: activeTag === null ? 'white' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: 600
                }}
            >
                All
            </button>
            {allTags.map(tag => (
                <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: '1px solid var(--border-subtle)',
                        background: activeTag === tag ? 'var(--accent-secondary)' : 'var(--bg-card)',
                        color: activeTag === tag ? 'black' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: 600
                    }}
                >
                    #{tag}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;
