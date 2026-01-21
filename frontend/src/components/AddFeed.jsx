import React, { useState } from 'react';

const AddFeed = ({ onAdd, loading }) => {
    const [url, setUrl] = useState('');
    const [tagInput, setTagInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            // Split tags by comma, trim whitespace, filter empty
            const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
            onAdd(url.trim(), tags);
            setUrl('');
            setTagInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2rem',
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            maxWidth: '600px',
            margin: '0 auto 3rem auto'
        }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                    type="url"
                    placeholder="Paste RSS Feed URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    style={{
                        flex: 2,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '0.8rem',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        outline: 'none',
                        fontFamily: 'var(--font-body)'
                    }}
                />
                <input
                    type="text"
                    placeholder="Tags (e.g. Tech, News)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        padding: '0.8rem',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        outline: 'none',
                        fontFamily: 'var(--font-body)'
                    }}
                />
            </div>
            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1, alignSelf: 'flex-end', width: '100%' }}
            >
                {loading ? 'Adding...' : 'Subscribe'}
            </button>
        </form>
    );
};

export default AddFeed;
