import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

const BACKEND_URL = 'http://localhost:3001';

const useStore = create(
    persist(
        (set, get) => ({
            // State
            feeds: [], // { id, url, tags }[]
            articles: [],
            loading: false,
            error: null,
            activeTag: null,

            // AI State
            summary: null,
            isSummarizing: false,
            summaryError: null,

            // Article Tag State (Persisted)
            articleTags: {}, // { [articleUrl]: string[] }

            // Actions
            setActiveTag: (tag) => set({ activeTag: tag }),

            addFeed: async (url, tags = []) => {
                const { feeds, fetchFeeds } = get();
                if (feeds.some(f => f.url === url)) return;

                const newFeed = {
                    id: generateId(),
                    url,
                    tags
                };

                set({ feeds: [...feeds, newFeed] });
                await fetchFeeds();
            },

            removeFeed: (id) => {
                const { feeds, articles } = get();
                // Remove feed and associated articles
                const newFeeds = feeds.filter((f) => f.id !== id);
                const newArticles = articles.filter((article) => article.feedId !== id);
                set({ feeds: newFeeds, articles: newArticles });
            },

            updateFeedTags: (id, tags) => {
                const { feeds } = get();
                const newFeeds = feeds.map(f => f.id === id ? { ...f, tags } : f);
                set({ feeds: newFeeds });
            },

            // Article Tag Actions
            addArticleTag: (articleUrl, tag) => {
                const { articleTags } = get();
                const currentTags = articleTags[articleUrl] || [];
                if (!currentTags.includes(tag)) {
                    set({
                        articleTags: {
                            ...articleTags,
                            [articleUrl]: [...currentTags, tag]
                        }
                    });
                }
            },

            removeArticleTag: (articleUrl, tag) => {
                const { articleTags } = get();
                const currentTags = articleTags[articleUrl] || [];
                set({
                    articleTags: {
                        ...articleTags,
                        [articleUrl]: currentTags.filter(t => t !== tag)
                    }
                });
            },

            fetchFeeds: async () => {
                const { feeds } = get();
                if (feeds.length === 0) {
                    set({ articles: [], loading: false });
                    return;
                }

                set({ loading: true, error: null });

                try {
                    const promises = feeds.map(async (feed) => {
                        try {
                            const res = await fetch(`${BACKEND_URL}/parse-feed?url=${encodeURIComponent(feed.url)}`);
                            if (!res.ok) throw new Error('Failed to fetch');
                            const data = await res.json();

                            return data.items.map((item) => ({
                                ...item,
                                source: data.title,
                                feedUrl: feed.url,
                                feedId: feed.id,
                                feedTags: feed.tags
                            }));
                        } catch (err) {
                            console.error(`Error fetching ${feed.url}:`, err);
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

                    set({ articles: allArticles, loading: false });
                } catch (err) {
                    console.error(err);
                    set({ error: 'Failed to refresh feeds.', loading: false });
                }
            },

            generateSummary: async () => {
                const { articles, activeTag, articleTags } = get();

                // Filter logic duplicated for summary context (keep consistent with App.jsx)
                const visibleArticles = activeTag
                    ? articles.filter(a => {
                        const aTags = articleTags[a.link] || [];
                        return (a.feedTags && a.feedTags.includes(activeTag)) || aTags.includes(activeTag);
                    })
                    : articles;

                if (visibleArticles.length === 0) return;

                set({ isSummarizing: true, summaryError: null, summary: null });

                try {
                    const res = await fetch(`${BACKEND_URL}/summarize`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ articles: visibleArticles })
                    });

                    if (!res.ok) throw new Error('Failed to generate summary');

                    const data = await res.json();
                    set({ summary: data.summary, isSummarizing: false });
                } catch (err) {
                    console.error(err);
                    set({ summaryError: 'Failed to generate summary. Ensure Ollama is running.', isSummarizing: false });
                }
            },

            clearSummary: () => set({ summary: null, summaryError: null })
        }),
        {
            name: 'rss_feeds_store',
            partialize: (state) => ({
                feeds: state.feeds,
                articleTags: state.articleTags
            }),
        }
    )
);

// Migration helper
export const migrateData = () => {
    // Ensure articleTags exists in state if migrating from older version
    const state = JSON.parse(localStorage.getItem('rss_feeds_store') || '{}');
    if (state.state && !state.state.articleTags) {
        useStore.setState({ articleTags: {} });
    }

    // Previous migrations...
    const rawData = localStorage.getItem('rss_feeds');
    if (rawData && !rawData.includes('"state":')) {
        try {
            const urls = JSON.parse(rawData);
            if (Array.isArray(urls) && typeof urls[0] === 'string') {
                const newFeeds = urls.map(url => ({
                    id: generateId(),
                    url,
                    tags: []
                }));
                useStore.setState({ feeds: newFeeds });
            }
        } catch (e) { }
    }

    const currentState = useStore.getState();
    if (currentState.feeds.length > 0 && typeof currentState.feeds[0] === 'string') {
        const newFeeds = currentState.feeds.map(url => ({
            id: generateId(),
            url,
            tags: []
        }));
        useStore.setState({ feeds: newFeeds });
    }
}

export default useStore;
