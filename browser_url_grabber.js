(async () => {
  const RUN_MS = 2 * 60 * 1000; // 2 minutes
  const STEP = 700;
  const DWELL_MS = 350;
  const IDLE_MS = 1200;
  const SMALL_ROUNDS = 16;

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const deadline = performance.now() + RUN_MS;

  const postLike = href => href.includes('/p/') || href.includes('/reel/') || href.includes('/tv/');
  const normalize = url => {
    try {
      const u = new URL(url, location.href);
      u.search = '';
      u.hash = '';
      return u.toString();
    } catch { return url; }
  };

  const collectLinks = () => {
    const anchors = [...document.querySelectorAll('a[href]')];
    const candidates = anchors
      .map(a => a.href)
      .filter(Boolean)
      .map(normalize)
      .filter(postLike)
      .filter(h => h.startsWith(location.origin));
    const extra = [
      ...document.querySelectorAll(
        'article a[href*="/p/"], article a[href*="/reel/"], article a[href*="/tv/"], ' +
        'main a[href*="/p/"], main a[href*="/reel/"], main a[href*="/tv/"]'
      )
    ]
      .map(n => n.href)
      .filter(Boolean)
      .map(normalize)
      .filter(postLike)
      .filter(h => h.startsWith(location.origin));
    return [...candidates, ...extra];
  };

  const unique = new Set();

  const waitForNetworkIdle = async (idleMs = IDLE_MS, maxWaitMs = 15000) => {
    const start = performance.now();
    let lastEnd = performance.now();
    while (performance.now() - start < maxWaitMs && performance.now() < deadline) {
      const entries = performance.getEntriesByType('resource');
      const latest = entries.length ? Math.max(...entries.map(e => e.responseEnd || 0)) : 0;
      if (latest > lastEnd) lastEnd = latest;
      if (performance.now() - lastEnd >= idleMs) break;
      await sleep(250);
    }
  };

  while (performance.now() < deadline) {
    for (let i = 0; i < SMALL_ROUNDS && performance.now() < deadline; i++) {
      document.documentElement.scrollBy(0, STEP);
      await sleep(DWELL_MS);
    }
    document.documentElement.scrollBy(0, -Math.floor(STEP / 2));
    await sleep(DWELL_MS);
    await waitForNetworkIdle();
    collectLinks().forEach(href => unique.add(href));
  }

  const result = Array.from(unique);
  console.log(`Collected ${result.length} unique post links in 2 minutes.`);

  // ---- Download as txt ----
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `instagram_links_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('✅ File download triggered.');
})();
