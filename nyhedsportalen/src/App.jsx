import React, { useEffect, useState } from "react";
import { fetchRSS } from "./fetchRSS.js";

export default function App() {
  const SOURCES = [
    {
      id: "dr",
      name: "DR Nyheder",
      color: "from-blue-700 to-blue-500",
      feed: "https://www.dr.dk/nyheder/service/feeds/allenyheder",
    },
    {
      id: "tv2",
      name: "TV 2 Nyheder",
      color: "from-orange-600 to-orange-400",
      manualLinks: [
        { title: "TV 2 Nyheder – forside", url: "https://nyheder.tv2.dk/" },
        { title: "TV 2 Politik", url: "https://nyheder.tv2.dk/politik" },
        { title: "TV 2 Udland", url: "https://nyheder.tv2.dk/udland" },
        { title: "TV 2 Sport", url: "https://sport.tv2.dk/" },
      ],
    },
    {
      id: "eb",
      name: "Ekstra Bladet",
      color: "from-red-700 to-red-500",
      feed: "https://ekstrabladet.dk/rssfeed/nyheder",
    },
    {
      id: "politiken",
      name: "Politiken",
      color: "from-green-700 to-green-500",
      feed: "https://politiken.dk/rss/feed/indland/",
    },
    {
      id: "berlingske",
      name: "Berlingske",
      color: "from-indigo-700 to-indigo-500",
      feed: "https://www.berlingske.dk/rssfeed/section/nyheder",
    },
    {
      id: "jp",
      name: "Jyllands-Posten",
      color: "from-cyan-700 to-cyan-500",
      feed: "https://jyllands-posten.dk/?service=rssfeed",
    },
    {
      id: "borsen",
      name: "Børsen",
      color: "from-pink-700 to-pink-500",
      feed: "https://borsen.dk/rssfeed",
    },
    {
      id: "altinget",
      name: "Altinget",
      color: "from-fuchsia-700 to-fuchsia-500",
      feed: "https://www.altinget.dk/rss",
    },
  ];

  const [articles, setArticles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      const results = {};
      for (const s of SOURCES) {
        if (s.manualLinks) {
          results[s.id] = s.manualLinks;
        } else if (s.feed) {
          const rss = await fetchRSS(s.feed);
          results[s.id] = rss;
        }
      }
      setArticles(results);
      setLoading(false);
    }
    loadAll();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="sticky top-0 z-20 backdrop-blur bg-slate-900/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400" />
            <div>
              <h1 className="text-xl font-bold">Nyhedsportalen</h1>
              <p className="text-xs text-slate-400">
                Automatisk opdaterede danske nyheder
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-center text-slate-400">
            Henter seneste nyheder...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOURCES.map((source) => (
              <SourceCard
                key={source.id}
                source={source}
                articles={articles[source.id] || []}
              />
            ))}
          </div>
        )}

        <p className="text-center text-xs text-slate-500 mt-8">
          RSS-data leveres via lokal proxy — Automatisk opdatering af danske
          nyheder.
        </p>
      </main>
    </div>
  );
}

function SourceCard({ source, articles }) {
  return (
    <section className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-slate-950/40">
      <header
        className={`px-4 py-3 bg-gradient-to-br ${source.color} text-white font-semibold`}
      >
        {source.name}
      </header>

      <div className="divide-y divide-white/5">
        {articles.length ? (
          <ul className="p-3 space-y-2">
            {articles.map((item, i) => (
              <li key={i}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2 hover:bg-slate-800/60 rounded-lg px-2 py-1 group"
                >
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-slate-400 group-hover:bg-white" />
                  <span className="leading-snug group-hover:underline">
                    {item.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-slate-400">
            Ingen artikler kunne hentes.
          </div>
        )}
      </div>
    </section>
  );
}
