export async function getWikiImage(keyword: string): Promise<string | null> {
  try {
    // Wikipedia search API to find the best matching page
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(keyword)}&prop=pageimages&format=json&pithumbsize=300&origin=*`
    );
    const searchData = await searchRes.json();
    const pages = searchData?.query?.pages;
    
    if (pages) {
      const pageId = Object.keys(pages)[0];
      const thumbnail = pages[pageId]?.thumbnail?.source;
      if (thumbnail) return thumbnail;
    }
    
    // Fallback search
    const fallbackRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(keyword)}&gsrlimit=1&prop=pageimages&format=json&pithumbsize=300&origin=*`
    );
    const fallbackData = await fallbackRes.json();
    const fallbackPages = fallbackData?.query?.pages;
    
    if (fallbackPages) {
      const pageId = Object.keys(fallbackPages)[0];
      return fallbackPages[pageId]?.thumbnail?.source || null;
    }
    
    return null;
  } catch (error) {
    console.error('Wiki image error:', error);
    return null;
  }
}
