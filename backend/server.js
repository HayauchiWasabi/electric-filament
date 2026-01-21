const express = require('express');
const Parser = require('rss-parser');
const cors = require('cors');

const app = express();
const parser = new Parser();
const PORT = 3001;

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

app.get('/parse-feed', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing "url" query parameter' });
  }

  try {
    console.log(`Fetching feed: ${url}`);
    const feed = await parser.parseURL(url);
    res.json(feed);
  } catch (error) {
    console.error('Error parsing feed:', error);
    res.status(500).json({ error: 'Failed to parse feed', details: error.message });
  }
});

// Endpoint to summarize articles using Ollama
app.post('/summarize', async (req, res) => {
  const { articles, model } = req.body;

  if (!articles || !Array.isArray(articles)) {
    return res.status(400).json({ error: 'Invalid articles data' });
  }

  // Limit to top 20 articles to avoid context limit issues
  const texts = articles.slice(0, 20).map(a => `- ${a.title} (${a.source}): ${a.contentSnippet || a.content || ''}`).join('\n');

  const prompt = `
    You are a helpful news assistant. Please generate a concise "Daily Briefing" based on the following news headlines and snippets.
    Group the news by topic if possible. Use Markdown formatting.
    
    News Items:
    ${texts}
    
    Daily Briefing:
    `;

  try {
    console.log('Sending request to Ollama...');
    const fetch = (await import('node-fetch')).default; // Dynamic import for node-fetch if needed, or native fetch in Node 18+

    // Using native fetch (Node 18+)
    const response = await globalThis.fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || 'llama3', // Default to llama3, user can override
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json({ summary: data.response });

  } catch (error) {
    console.error('Error communicating with Ollama:', error);
    res.status(500).json({ error: 'Failed to generate summary', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
