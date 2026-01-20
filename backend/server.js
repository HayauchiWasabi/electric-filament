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

// Future endpoint placeholder for Ollama integration
// app.post('/summarize', ...)

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
