/**
 * lib/newsCache.js
 *
 * Fetches NZ politics articles from NewsAPI.org, caches them in Supabase
 * (news_articles table), and falls back to RNZ RSS if the API key is missing
 * or the request fails.
 *
 * Cache TTL: 30 minutes.
 */

import * as cheerio from 'cheerio';
import { getDataClient } from '@/lib/supabase/data';

const CACHE_TTL_MS = 30 * 60 * 1000;

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

// ── RNZ RSS fallback ───────────────────────────────────────────────────────

async function fetchFromRNZRSS() {
  const res = await fetch('https://www.rnz.co.nz/rss/political.xml', {
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`RNZ RSS ${res.status}`);

  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  const articles = [];
  $('item').each((_, el) => {
    const title = $(el).find('title').text().trim();
    const url = $(el).find('link').text().trim() || $(el).find('guid').text().trim();
    const summary = $(el).find('description').text().replace(/<[^>]+>/g, '').trim();
    const pubDateRaw = $(el).find('pubDate').text().trim();
    const published_date = pubDateRaw ? new Date(pubDateRaw).toISOString() : new Date().toISOString();
    const image_url =
      $(el).find('media\\:content, media\\:thumbnail').attr('url') ||
      $(el).find('enclosure').attr('url') ||
      null;

    if (title && url) {
      articles.push({
        title,
        source: 'RNZ',
        url,
        summary,
        published_date,
        category: 'politics',
        image_url,
        api_source_id: Buffer.from(url).toString('base64').slice(0, 64),
        feed_source: 'rss',
      });
    }
  });

  return articles;
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
  const supabase = getDataClient();
  await supabase
    .from('news_articles')
    .upsert(articles, { onConflict: 'api_source_id', ignoreDuplicates: true });
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function getNZNews({ limit = 20, forceRefresh = false } = {}) {
  const age = await getNewestArticleAge();
  const isStale = forceRefresh || age > CACHE_TTL_MS;

  if (isStale) {
    try {
      const articles = await fetchFromNewsAPI({ pageSize: 30 });
      await upsertArticles(articles);
    } catch (err) {
      console.warn('[newsCache] NewsAPI failed, trying RNZ RSS:', err.message);
      try {
        const rssArticles = await fetchFromRNZRSS();
        await upsertArticles(rssArticles);
      } catch (rssErr) {
        console.error('[newsCache] RNZ RSS also failed:', rssErr.message);
      }
    }
  }

  const supabase = getDataClient();
  const { data: articles } = await supabase
    .from('news_articles')
    .select('*')
    .order('published_date', { ascending: false })
    .limit(limit);

  return articles || [];
}

export async function refreshNZNews() {
  return getNZNews({ forceRefresh: true });
}
