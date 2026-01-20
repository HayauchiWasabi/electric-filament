import React, { useState } from 'react';

const AddFeed = ({ onAdd, loading }) => {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onAdd(url.trim());
            setUrl('');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            background: 'var(--bg-card)',
            padding: '1rem',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            maxWidth: '600px',
            margin: '0 auto 3rem auto'
        }}>
            <input
                type="url"
                placeholder="Paste RSS Feed URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    outline: 'none',
                    fontFamily: 'var(--font-body)'
                }}
            />
            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
            >
                {loading ? 'Adding...' : 'Subscribe'}
            </button>
        </form>
    );
};

export default AddFeed;
