import React from 'react';
import ReactMarkdown from 'react-markdown';
import useStore from '../store/useStore';

const DailyBriefing = () => {
    const { summary, isSummarizing, summaryError, clearSummary } = useStore();

    if (!summary && !isSummarizing && !summaryError) return null;

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--accent-primary)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '3rem',
            position: 'relative',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.5s ease'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '1rem'
            }}>
                <h2 className="heading title-gradient" style={{ fontSize: '1.5rem', margin: 0 }}>
                    ✨ Daily Briefing
                </h2>
                <button
                    onClick={clearSummary}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                    }}
                >
                    &times;
                </button>
            </div>

            {isSummarizing && (
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic'
                }}>
                    Analyzing your news feed with AI... <br />
                    <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>(Connecting to local Ollama)</span>
                </div>
            )}

            {summaryError && (
                <div style={{ color: '#ef4444', textAlign: 'center', padding: '1rem' }}>
                    {summaryError}
                </div>
            )}

            {summary && (
                <div className="markdown-content" style={{ lineHeight: '1.7', color: 'var(--text-primary)' }}>
                    <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default DailyBriefing;
