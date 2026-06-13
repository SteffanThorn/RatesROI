import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url).searchParams.get('url');
  if (!url) return NextResponse.json({ image: null });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FairSayNZ/1.0; +https://fair-say.vercel.app)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    if (!res.ok) return NextResponse.json({ image: null });

    const html = await res.text();

    // Extract og:image / twitter:image with a regex — avoids loading cheerio in edge runtime
    const patterns = [
      /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
      /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
      /name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
      /content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
    ];

    let raw = null;
    for (const re of patterns) {
      const m = html.match(re);
      if (m?.[1]) { raw = m[1]; break; }
    }

    if (!raw) return NextResponse.json({ image: null });

    // Resolve relative URLs
    let image = null;
    try { image = new URL(raw, url).href; } catch { /* invalid URL */ }

    return NextResponse.json({ image }, {
      headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600' },
    });
  } catch {
    return NextResponse.json({ image: null });
  } finally {
    clearTimeout(timer);
  }
}
