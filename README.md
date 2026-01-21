# Pulse Reader ⚡️

A modern, card-based RSS Reader web application built with a focus on aesthetics, personal organization, and AI integration.

![Tag System Verification](/Users/kaiikeda/.gemini/antigravity/brain/2501b810-75b1-4260-8266-bfbf9bbd71dc/tag_system_reverification_1768987609415.webp)

## ✨ Features

*   **📰 Smart Aggregation**: Subscribe to any RSS feed and see articles merged into a single, chronological timeline.
*   **🎨 Premium Dark Mode**: A sleek, glassmorphic UI with vibrant accents and smooth hover effects.
*   **🏷️ Tag System**:
    *   **Feed Tags**: Organize subscriptions by category (e.g., "Tech", "Design").
    *   **Article Custom Tags**: Tag individual articles (e.g., "MustRead") for later reference.
    *   **Filter Bar**: Instantly filter your view by any tag.
*   **🤖 AI Daily Briefing**:
    *   Integrates with local **Ollama** LLMs.
    *   Generates a concise markdown summary of your top headlines with one click.
    *   *Privacy-first*: No data leaves your machine.
*   **💾 Local Persistence**: All your subscriptions, tags, and settings are saved automatically in your browser (using Zustand + LocalStorage).

## 🛠️ Tech Stack

*   **Frontend**: React (Vite)
*   **State Management**: Zustand (Persist Middleware)
*   **Styling**: Vanilla CSS (Variables, Grid, Flexbox)
*   **Backend**: Node.js + Express (Proxy server to handle RSS fetching & AI requests)
*   **AI**: Ollama (Local LLM)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18+ recommended)
*   [Ollama](https://ollama.com/) (Optional, for AI features)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/pulse-reader.git
    cd pulse-reader
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    # Start the proxy server
    node server.js
    ```
    *Server runs on `http://localhost:3001`*

3.  **Setup Frontend** (Open a new terminal)
    ```bash
    cd frontend
    npm install
    # Start the development server
    npm run dev
    ```
    *App runs on `http://localhost:5173`*

### 🤖 Setting up AI (Optional)

1.  Install and run [Ollama](https://ollama.com/).
2.  Pull a model (e.g., Llama 3):
    ```bash
    ollama pull llama3
    ```
3.  Click the **"✨ Generate Daily Briefing"** button in the app header!

## 🛣️ Roadmap

- [x] Basic RSS Aggregation
- [x] Tagging System (Feeds & Articles)
- [x] Local AI Integration
- [ ] Mobile PWA Support
- [ ] OPML Import/Export
- [ ] "Chat with your Feed" (RAG integration)

## 📄 License

MIT
