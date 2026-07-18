/** HD artist portraits — same URL for hero wallpaper and artist cards. */
export const ARTIST_IMAGE_URLS: Record<string, string> = {
  "one-direction": "/images/artists/one-direction.png",
  "bruno-mars": "/images/artists/bruno-mars.png",
  "shawn-mendes": "/images/artists/shawn-mendes.png",
  "maroon-5": "/images/artists/maroon-5.png",
  oneokrock: "/images/artists/oneokrock.png",
  blackpink: "/images/artists/blackpink.png",
  bts: "/images/artists/bts.png",
  newjeans: "/images/artists/newjeans.png",
  eminem: "/images/artists/eminem.png",
  "the-chainsmokers": "/images/artists/the-chainsmokers.png",
  coldplay: "/images/artists/coldplay.png",
  "arijit-singh": "/images/artists/arijit-singh.png",
  "the-weeknd": "/images/artists/the-weeknd.png",
  "charlie-puth": "/images/artists/charlie-puth.png",
  "justin-bieber": "/images/artists/justin-bieber.png",
  twice: "/images/artists/twice.png",
};

export function artistImageUrl(slug: string): string | undefined {
  return ARTIST_IMAGE_URLS[slug];
}
