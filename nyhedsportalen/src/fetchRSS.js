// src/fetchRSS.js
export async function fetchRSS(url) {
  try {
    const res = await fetch(`http://localhost:3001/rss?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xmlText = await res.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");
    const nodes = Array.from(xml.querySelectorAll("item, entry"));

    const toHttp = (s) => {
      if (!s) return "";
      const t = s.replace("<![CDATA[", "").replace("]]>", "").trim();
      if (/^https?:\/\//i.test(t)) return t;
      if (/^\/\//.test(t)) return "https:" + t;
      if (t && !/^\w+:\/\//.test(t)) return "https://" + t;
      return t;
    };

    const items = nodes.map((n) => {
      // title
      const title =
        n.querySelector("title")?.textContent?.replace("<![CDATA[", "").replace("]]>", "").trim() ||
        "Ukendt titel";

      // candidates for link
      const cands = [];

      // RSS 2.0
      const linkNode = n.querySelector("link");
      if (linkNode) {
        const textLink = linkNode.textContent?.trim();
        const hrefLink = linkNode.getAttribute?.("href");
        if (textLink) cands.push(textLink);
        if (hrefLink) cands.push(hrefLink);
      }

      // Atom alt link
      const alt = n.querySelector('link[rel="alternate"]');
      if (alt?.getAttribute("href")) cands.push(alt.getAttribute("href"));

      // guid permalink
      const guid = n.querySelector('guid[ispermalink="true"], guid[isPermaLink="true"]');
      if (guid?.textContent) cands.push(guid.textContent);

      // fallback: first anchor in description/content
      const tmp = document.createElement("div");
      tmp.innerHTML =
        n.querySelector("description")?.textContent ||
        n.querySelector("content")?.textContent ||
        "";
      const a = tmp.querySelector("a[href]");
      if (a?.getAttribute("href")) cands.push(a.getAttribute("href"));

      const link = toHttp(cands.find(Boolean) || "#");

      const pubDate =
        n.querySelector("pubDate")?.textContent ||
        n.querySelector("updated")?.textContent ||
        n.querySelector("dc\\:date, date")?.textContent ||
        "";

      return { title, link, pubDate };
    });

    // de-dupe by link and keep the first 8
    const unique = Array.from(new Map(items.map(i => [i.link, i])).values());
    return unique.slice(0, 8);
  } catch (e) {
    console.error("Fejl ved hentning/parsing af RSS:", e);
    return [];
  }
}
