import * as cheerio from 'cheerio';
import { getDataClient } from '@/lib/supabase/data';
import { RSS_SOURCES } from '@/lib/rss-sources';

const CACHE_TTL_MS = 0;

// ── NewsAPI ────────────────────────────────────────────────────────────────

async function fetchFromNewsAPI({ pageSize = 20 } = {}) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) throw new Error('NEWS_API_KEY not set');

  const params = new URLSearchParams({
    q: '"New Zealand" (politics OR parliament OR government OR election OR "general election")',
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: String(pageSize),
    apiKey,
  });

  const res = await fetch(`https://newsapi.org/v2/everything?${params}`, {
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NewsAPI ${res.status}: ${text}`);
  }

  const data = await res.json();

  return (data.articles || [])
    .filter((a) => a.url && a.title && a.title !== '[Removed]')
    .map((a) => ({
      title: a.title,
      source: a.source?.name || 'Unknown',
      url: a.url,
      summary: a.description || '',
      published_date: new Date(a.publishedAt).toISOString(),
      category: 'politics',
      image_url: a.urlToImage || null,
      api_source_id: Buffer.from(a.url).toString('base64').slice(0, 64),
      feed_source: 'newsapi',
    }));
}

// ── Generic RSS/Atom fetch ─────────────────────────────────────────────────

async function fetchFromRSS(source) {
  const res = await fetch(source.rssUrl, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`RSS ${res.status}`);

  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  // Atom uses <entry> + <link href="…">, RSS uses <item> + <link> text
  const isAtom = $('feed').length > 0;
  const selector = isAtom ? 'entry' : 'item';

  const articles = [];
  $(selector).each((_, el) => {
    const title = $(el).find('title').first().text().trim();

    const url = isAtom
      ? ($(el).find('link[rel="alternate"]').attr('href') ||
         $(el).find('link:not([rel])').first().attr('href') ||
         $(el).find('link').first().attr('href') ||
         $(el).find('id').first().text().trim())
      : ($(el).find('link').first().text().trim() ||
         $(el).find('guid').first().text().trim());

    const rawSummary = isAtom
      ? ($(el).find('summary').first().text() || $(el).find('content').first().text())
      : $(el).find('description').first().text();
    const summary = rawSummary.replace(/<[^>]+>/g, '').trim().slice(0, 600);

    const pubDateRaw = isAtom
      ? ($(el).find('published').first().text().trim() || $(el).find('updated').first().text().trim())
      : $(el).find('pubDate').first().text().trim();
    const published_date = pubDateRaw ? new Date(pubDateRaw).toISOString() : new Date().toISOString();

    const image_url =
      $(el).find('media\\:content, media\\:thumbnail').attr('url') ||
      $(el).find('enclosure[type^="image"]').attr('url') ||
      null;

    if (title && url) {
      articles.push({
        title,
        source: source.displayName,
        url,
        summary,
        published_date,
        category: 'politics',
        image_url,
        api_source_id: Buffer.from(url).toString('base64').slice(0, 64),
        feed_source: source.key,
      });
    }
  });

  // Fill missing images from each article's og:image tag
  return enrichImagesFromOg(articles);
}

// ── OG image fetcher ──────────────────────────────────────────────────────
// Fetches the og:image / twitter:image from an article page.
// Hard 2.5 s timeout so a slow publisher never blocks the refresh.
async function fetchOgImage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'FairSayNZ/1.0 (+https://fairsaynz.co.nz)' },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    const raw =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="og:image:url"]').attr('content') ||
      null;
    if (!raw) return null;
    // Resolve relative paths (e.g. /images/photo.jpg → https://site.com/images/photo.jpg)
    try { return new URL(raw, url).href; } catch { return null; }
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Enrich articles that have no image by fetching OG tags, 5 at a time.
async function enrichImagesFromOg(articles) {
  const CONCURRENCY = 5;
  const out = [...articles];
  for (let i = 0; i < out.length; i += CONCURRENCY) {
    await Promise.all(
      out.slice(i, i + CONCURRENCY).map(async (_, j) => {
        const a = out[i + j];
        if (!a.image_url) {
          out[i + j] = { ...a, image_url: await fetchOgImage(a.url) };
        }
      })
    );
  }
  return out;
}

// ── Cache helpers ──────────────────────────────────────────────────────────

async function getNewestArticleAge() {
  const supabase = getDataClient();
  const { data } = await supabase
    .from('news_articles')
    .select('created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!data) return Infinity;
  return Date.now() - new Date(data.created_at).getTime();
}

async function upsertArticles(articles) {
  if (!articles.length) return;
  // Deduplicate by api_source_id — Postgres rejects a batch if the same row is targeted twice
  const seen = new Set();
  const unique = articles.filter((a) => {
    if (seen.has(a.api_source_id)) return false;
    seen.add(a.api_source_id);
    return true;
  });
  const supabase = getDataClient();
  // Batch in chunks of 50
  for (let i = 0; i < unique.length; i += 50) {
    const chunk = unique.slice(i, i + 50);
    const { error } = await supabase
      .from('news_articles')
      .upsert(chunk, { onConflict: 'api_source_id' });
    if (error) console.error(`[newsCache] upsert chunk ${i}-${i + chunk.length} failed:`, error.message);
  }
}

// Delete articles older than 3 days to stop old RNZ content crowding out other sources
async function pruneOldArticles() {
  const cutoff = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const supabase = getDataClient();
  await supabase.from('news_articles').delete().lt('published_date', cutoff);
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function getNZNews({ limit = 20, forceRefresh = false } = {}) {
  const age = await getNewestArticleAge();
  const isStale = forceRefresh || age > CACHE_TTL_MS;

  if (isStale) {
    let newsApiOk = false;
    try {
      const articles = await fetchFromNewsAPI({ pageSize: 30 });
      await upsertArticles(articles);
      newsApiOk = true;
    } catch (err) {
      console.warn('[newsCache] NewsAPI failed, trying RSS sources:', err.message);
    }

    if (!newsApiOk) {
      const results = await Promise.allSettled(RSS_SOURCES.map((s) => fetchFromRSS(s)));
      const allArticles = results.flatMap((r, i) => {
        if (r.status === 'fulfilled') {
          console.log(`[newsCache] ${RSS_SOURCES[i].key}: ${r.value.length} articles`);
          return r.value;
        }
        console.warn(`[newsCache] RSS failed for ${RSS_SOURCES[i].key}:`, r.reason?.message);
        return [];
      });
      console.log(`[newsCache] total fetched: ${allArticles.length}`);
      if (allArticles.length > 0) {
        await upsertArticles(allArticles);
        await pruneOldArticles();
      }
    }
  }

  const supabase = getDataClient();
  // Fetch a large pool then balance: take up to 10 per source so all sources get representation
  const { data: pool } = await supabase
    .from('news_articles')
    .select('*')
    .order('published_date', { ascending: false })
    .limit(300);

  const perSourceCount = {};
  const PER_SOURCE_MAX = 10;
  const balanced = [];
  for (const a of pool || []) {
    const key = a.source || 'unknown';
    perSourceCount[key] = (perSourceCount[key] || 0) + 1;
    if (perSourceCount[key] <= PER_SOURCE_MAX) balanced.push(a);
    if (balanced.length >= limit) break;
  }

  return balanced;
}

export async function refreshNZNews() {
  return getNZNews({ forceRefresh: true });
}
