import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy for TasteDive
  app.get("/api/proxy/tastedive", async (req, res) => {
    const { q, type, k, info } = req.query;
    try {
      const url = `https://tastedive.com/api/similar?q=${encodeURIComponent(q as string)}&type=${type || "movies"}&k=${k || process.env.VITE_TASTEDIVE_KEY}&info=${info || 1}`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Proxy for Watchmode Search
  app.get("/api/proxy/watchmode/search", async (req, res) => {
    const { search_value, search_field, search_mode } = req.query;
    try {
      const apiKey = process.env.VITE_WATCHMODE_KEY;
      const url = `https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=${search_field || "name"}&search_value=${encodeURIComponent(search_value as string)}&search_mode=${search_mode || 1}`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Proxy for Watchmode Details
  app.get("/api/proxy/watchmode/details/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const apiKey = process.env.VITE_WATCHMODE_KEY;
      const url = `https://api.watchmode.com/v1/title/${id}/details/?apiKey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Proxy for Watchmode Sources
  app.get("/api/proxy/watchmode/sources/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const apiKey = process.env.VITE_WATCHMODE_KEY;
      const url = `https://api.watchmode.com/v1/title/${id}/sources/?apiKey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
