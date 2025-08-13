async function downloadReel(reelUrl) {
  // Extract shortcode from URL (e.g., 'ABC123' from https://www.instagram.com/reel/ABC123/)
  const match = reelUrl.match(/\/reel\/([^\/?]+)/);
  if (!match) {
    console.error('Invalid Reel URL. It should look like https://www.instagram.com/reel/SHORTCODE/');
    return;
  }
  const shortcode = match[1];

  // Instagram GraphQL endpoint and query hash for Reel media
  const queryHash = 'b3055c01b4b222b8a47dc12b090e4e64';
  const variables = JSON.stringify({
    shortcode: shortcode,
    child_comment_count: 3,
    fetch_comment_count: 40,
    parent_comment_count: 24,
    has_threaded_comments: true
  });

  // Fetch Reel data using your logged-in session
  const response = await fetch(`https://www.instagram.com/graphql/query/?query_hash=${queryHash}&variables=${variables}`, {
    method: 'GET',
    credentials: 'include'  // Includes cookies for logged-in access
  });

  if (!response.ok) {
    console.error('Failed to fetch Reel data. Status:', response.status);
    return;
  }

  const data = await response.json();
  const videoUrl = data?.data?.shortcode_media?.video_url;

  if (!videoUrl) {
    console.error('Video URL not found. Ensure the Reel is public or try again.');
    return;
  }

  // Trigger download by creating a temporary link
  const link = document.createElement('a');
  link.href = videoUrl;
  link.download = `${shortcode}.mp4`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log('Download started for Reel:', shortcode);
}
