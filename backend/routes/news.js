const router = require("express").Router();

let cache = { data: null, timestamp: 0 };
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutos

router.get("/", async (req, res) => {
  try {
    const now = Date.now();
    if (cache.data && now - cache.timestamp < CACHE_DURATION) {
      return res.json(cache.data);
    }

    const url = `https://gnews.io/api/v4/top-headlines?category=technology&lang=pt&max=6&apikey=${process.env.GNEWS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.articles) {
      return res.status(500).json({ error: "Erro ao obter notícias" });
    }

    const articles = data.articles.map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      image: a.image,
      source: a.source?.name,
      publishedAt: a.publishedAt,
    }));

    cache = { data: articles, timestamp: now };
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;