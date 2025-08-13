(async () => {
  // Config: run duration and scrolling aggressiveness
  const RUN_MS = 2 * 60 * 1000; // 2 minutes
  const STEP = 700;             // pixels per small scroll
  const DWELL_MS = 350;         // wait between small scrolls
  const IDLE_MS = 1200;         // wait for network idle between rounds
  const SMALL_ROUNDS = 16;      // small scrolls per round

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

  // Collect links from anchors commonly used by Instagram
  const collectLinks = () => {
    const anchors = [...document.querySelectorAll('a[href]')];
    const candidates = anchors
      .map(a => a.href)
      .filter(Boolean)
      .map(normalize)
      .filter(postLike)
      .filter(h => h.startsWith(location.origin));
    // Also probe likely containers defensively
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

  // Track unique links
  const unique = new Set();

  // Simple network idle heuristic using performance entries
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

  // Main loop until deadline
  while (performance.now() < deadline) {
    // Incremental downward scrolls to trigger lazy loading
    for (let i = 0; i < SMALL_ROUNDS && performance.now() < deadline; i++) {
      document.documentElement.scrollBy(0, STEP);
      await sleep(DWELL_MS);
    }

    // Nudge up to retrigger observers on virtualized grids
    document.documentElement.scrollBy(0, -Math.floor(STEP / 2));
    await sleep(DWELL_MS);

    // Wait for network idle so new items can populate the DOM
    await waitForNetworkIdle();

    // Collect and merge links
    const batch = collectLinks();
    for (const href of batch) unique.add(href);

    // Optional visibility nudge to keep the tab active
    // (Browsers throttle background tabs)
  }

  const result = Array.from(unique);
  console.log(`Collected ${result.length} unique post links in 2 minutes:`, result);

  // Copy to clipboard
  try {
    await navigator.clipboard.writeText(result.join('\n'));
    console.log('All links copied to clipboard.');
  } catch (e) {
    console.warn('Clipboard copy failed; permission likely blocked. Links are logged above.');
  }
})();
