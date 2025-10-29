import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/rss", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("No URL provided");

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "application/rss+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok)
      throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);

    const text = await response.text();
    res.set("Content-Type", "application/xml; charset=utf-8");
    res.send(text);
  } catch (error) {
    console.error("❌ Fejl ved hentning af RSS:", error.message);
    res.status(500).send("Fejl ved hentning af RSS-feed");
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`✅ Proxyserver kører på http://localhost:${PORT}`)
);
