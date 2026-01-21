import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const BACKEND_URL = 'http://localhost:3001';

const useStore = create(
    persist(
        (set, get) => ({
            // State
            feeds: [],
            articles: [],
            loading: false,
            error: null,

            // Actions
            addFeed: async (url) => {
                const { feeds, fetchFeeds } = get();
                if (feeds.includes(url)) return;

                set({ feeds: [...feeds, url] });
                // Immediately fetch to update articles
                await fetchFeeds();
            },

            removeFeed: (urlToRemove) => {
                const { feeds, articles } = get();
                const newFeeds = feeds.filter((url) => url !== urlToRemove);
                const newArticles = articles.filter((article) => article.feedUrl !== urlToRemove);
                set({ feeds: newFeeds, articles: newArticles });
            },

            fetchFeeds: async () => {
                const { feeds } = get();
                if (feeds.length === 0) {
                    set({ articles: [], loading: false });
                    return;
                }

                set({ loading: true, error: null });

                try {
                    const promises = feeds.map(async (url) => {
                        try {
                            const res = await fetch(`${BACKEND_URL}/parse-feed?url=${encodeURIComponent(url)}`);
                            if (!res.ok) throw new Error('Failed to fetch');
                            const data = await res.json();
                            // Tag items with source title and original feed URL for filtering/reference
                            return data.items.map((item) => ({
                                ...item,
                                source: data.title,
                                feedUrl: url,
                            }));
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

                    set({ articles: allArticles, loading: false });
                } catch (err) {
                    console.error(err);
                    set({ error: 'Failed to refresh feeds.', loading: false });
                }
            },
        }),
        {
            name: 'rss_feeds_store', // Unique name for local storage
            // We only persist 'feeds', we can re-fetch articles on load to ensure freshness
            // or persist articles too if offline support is desired. 
            // For now, persisting just feeds is safer to avoid stale data issues.
            partialize: (state) => ({ feeds: state.feeds }),

            // Optional: Migration from old "rss_feeds" key
            // The user used 'rss_feeds' which was just a raw JSON array.
            // Zustand's persist writes an object { state: { feeds: [...] }, version: 0 }
            // We can check for old data manually on init if we really wanted, 
            // but 'name' needs to be different to avoid conflict or we use a custom storage wrapper.
            // For simplicity, let's keep it separate for a moment, or migration logic can be:
            onRehydrateStorage: () => (state) => {
                if (!state.feeds || state.feeds.length === 0) {
                    const oldData = localStorage.getItem('rss_feeds');
                    if (oldData) {
                        try {
                            const parsed = JSON.parse(oldData);
                            if (Array.isArray(parsed)) {
                                // Determine if we need to set state. 
                                // Since this runs after rehydration, we might need to manually set it.
                                // However, doing this inside the store definition is cleaner.
                                // Let's rely on standard zustand behavior for now.
                            }
                        } catch (e) { }
                    }
                }
            }
        }
    )
);

// Manual migration helper (to be called in App.jsx or main.jsx once)
export const migrateFromLegacy = () => {
    const oldData = localStorage.getItem('rss_feeds');
    // Check if it's the old format (raw array) vs new format (object with state)
    // Old: ["url1", "url2"]
    // New: {"state":{"feeds":["url1"]},"version":0}
    if (oldData && !oldData.includes('"state":')) {
        try {
            const feeds = JSON.parse(oldData);
            if (Array.isArray(feeds)) {
                useStore.setState({ feeds });
                // Clean up old key if we want, or keep it as backup. 
                // Since I used a new key 'rss_feeds_store', it won't conflict.
            }
        } catch (e) {
            console.error("Migration failed", e);
        }
    }
}

export default useStore;
