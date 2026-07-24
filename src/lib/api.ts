// CodeSpecters & TMDB API Service Module
export const TMDB_KEY = "2f7af29f7b3212357b2cabc9e79f0f9f";
export const TMDB_KEY_ALT = "90f67e516bce299e8adf6c603a59bc0e";
export const EMBED_API_KEY = "nx_8d7e08dae69a5cdf088d0095c57be900";
export const EMBED_BASE = "https://api.codespecters.com";
export const IMG_BASE = "https://image.tmdb.org/t/p/w300";
export const IMG_BASE_LG = "https://image.tmdb.org/t/p/w780";
export const OMDB_API_KEY = "5a8f6331";

// RapidAPI Configurations
const RAPID_KEY = (import.meta as any).env.VITE_RAPIDAPI_KEY || "8b1758872fmsh7f1643ac807820dp1d52a3jsn85ab31e30f7d";
const RAPID_HOST_IMDB = (import.meta as any).env.VITE_RAPIDAPI_HOST_IMDB || "imdb236.p.rapidapi.com";

// TasteDive & Watchmode Keys
export const TASTEDIVE_KEY = (import.meta as any).env.VITE_TASTEDIVE_KEY || "1075775-MovieFli-F3815FD5";
export const WATCHMODE_KEY = (import.meta as any).env.VITE_WATCHMODE_KEY || "OzxNG5t7IfYguhF8v7zdBrzFpI1rwZyxoSQfOhTo";

export async function rapidGenericFetch(host: string, endpoint: string) {
  const url = endpoint.startsWith("http") ? endpoint : `https://${host}${endpoint}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": RAPID_KEY,
      "x-rapidapi-host": host
    }
  };

  const res = await fetch(url, options);
  if (!res.ok) {
    const error: any = new Error(`RapidAPI Error (${host}): ${res.status}`);
    error.status = res.status;
    error.host = host;
    throw error;
  }
  return res.json();
}

export async function rapidImdbFetch(endpoint: string) {
  return rapidGenericFetch(RAPID_HOST_IMDB, endpoint);
}

export async function getCastTitles(nmId: string) {
  return rapidImdbFetch(`/api/imdb/cast/${nmId}/titles`);
}

export async function fetchNetflixRapid(name = "robot", page = 1) {
  const host = (import.meta as any).env.VITE_RAPIDAPI_HOST_NETFLIX || "netflix-movies-and-tv-shows-api-by-apirobots.p.rapidapi.com";
  return rapidGenericFetch(host, `/v1/netflix?name=${encodeURIComponent(name)}&page=${page}`);
}

export async function fetchDisneyRapid() {
  const host = (import.meta as any).env.VITE_RAPIDAPI_HOST_DISNEY || "disney-plus-top-movies-and-tv-shows-api-by-apirobots.p.rapidapi.com";
  return rapidGenericFetch(host, `/v1/disney-plus-top/random`);
}

export async function fetchAmazonRapid(page = 1) {
  const host = (import.meta as any).env.VITE_RAPIDAPI_HOST_AMAZON || "amazon-prime-movies-and-tv-shows-api-by-apirobots.p.rapidapi.com";
  return rapidGenericFetch(host, `/v1/amazon-prime?page=${page}`);
}

export async function fetchBollywoodRapid(year = 2024, genre = "Action") {
  const host = (import.meta as any).env.VITE_RAPIDAPI_HOST_BOLLYWOOD || "abir82-bollywood-recommendations.p.rapidapi.com";
  return rapidGenericFetch(host, `/?year=${year}&genre=${encodeURIComponent(genre)}`);
}

export async function fetchMoviesDbRapid(id: string | number) {
  const host = (import.meta as any).env.VITE_RAPIDAPI_HOST_MOVIESDB || "movies-db-api1.p.rapidapi.com";
  return rapidGenericFetch(host, `/movies/lookup/${id}`);
}

export async function fetchHollywoodRapid() {
  const host = (import.meta as any).env.VITE_RAPIDAPI_HOST_MOVIESERIES || "movieseries.p.rapidapi.com";
  return rapidGenericFetch(host, `/hollywood`);
}

export async function fetchTasteDiveSimilar(query: string, type = "movies") {
  const res = await fetch(`/api/proxy/tastedive?q=${encodeURIComponent(query)}&type=${type}`);
  if (!res.ok) throw new Error(`TasteDive Proxy Error: ${res.status}`);
  return res.json();
}

export async function fetchWatchmodeSearch(title: string) {
  const res = await fetch(`/api/proxy/watchmode/search?search_value=${encodeURIComponent(title)}`);
  if (!res.ok) throw new Error(`Watchmode Proxy Search Error: ${res.status}`);
  return res.json();
}

export async function fetchWatchmodeDetails(id: string | number) {
  const res = await fetch(`/api/proxy/watchmode/details/${id}`);
  if (!res.ok) throw new Error(`Watchmode Proxy Detail Error: ${res.status}`);
  return res.json();
}

export async function fetchWatchmodeSources(id: string | number) {
  const res = await fetch(`/api/proxy/watchmode/sources/${id}`);
  if (!res.ok) throw new Error(`Watchmode Proxy Sources Error: ${res.status}`);
  return res.json();
}

export async function tmdbFindById(externalId: string, source = "imdb_id") {
  return tmdbFetch(`/find/${externalId}?external_source=${source}`);
}

export async function tmdbGetMovie(id: number | string) {
  return tmdbFetch(`/movie/${id}`);
}

export async function tmdbGetTv(id: number | string) {
  return tmdbFetch(`/tv/${id}`);
}

export async function tmdbFetch(path: string) {
  const sep = path.includes("?") ? "&" : "?";
  let keyToUse = TMDB_KEY;
  let res = await fetch(`https://api.themoviedb.org/3${path}${sep}api_key=${keyToUse}`);
  if (!res.ok) {
    keyToUse = TMDB_KEY_ALT;
    res = await fetch(`https://api.themoviedb.org/3${path}${sep}api_key=${keyToUse}`);
  }
  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status}`);
  }
  return res.json();
}

export function movieEmbedUrl(tmdbId: number | string) {
  return `${EMBED_BASE}/embed/movie/${tmdbId}?apikey=${EMBED_API_KEY}`;
}

export function tvEmbedUrl(tmdbId: number | string, season = 1, episode = 1) {
  return `${EMBED_BASE}/embed/tv/${tmdbId}/${season}/${episode}?apikey=${EMBED_API_KEY}`;
}

export function posterUrl(path: string | null | undefined, large = false) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return (large ? IMG_BASE_LG : IMG_BASE) + path;
}

export function formatRating(rating: number | null | undefined) {
  if (!rating) return "7.5/10";
  return `${rating.toFixed(1)}/10`;
}

export const api = {
  trendingMovies: (page = 1) => tmdbFetch(`/trending/movie/week?page=${page}`),
  trendingTV: (page = 1) => tmdbFetch(`/trending/tv/week?page=${page}`),
  popularMovies: (page = 1) => tmdbFetch(`/movie/popular?page=${page}`),
  popularTV: (page = 1) => tmdbFetch(`/tv/popular?page=${page}`),
  topRatedMovies: (page = 1) => tmdbFetch(`/movie/top_rated?page=${page}`),
  topRatedTV: (page = 1) => tmdbFetch(`/tv/top_rated?page=${page}`),
  nowPlayingMovies: (page = 1) => tmdbFetch(`/movie/now_playing?page=${page}`),
  searchMovies: (q: string, page = 1) => tmdbFetch(`/search/movie?query=${encodeURIComponent(q)}&page=${page}`),
  searchTV: (q: string, page = 1) => tmdbFetch(`/search/tv?query=${encodeURIComponent(q)}&page=${page}`),
  movieDetails: (id: number | string) => tmdbFetch(`/movie/${id}`),
  tvDetails: (id: number | string) => tmdbFetch(`/tv/${id}`),
  seasonDetails: (id: number | string, season: number) => tmdbFetch(`/tv/${id}/season/${season}`),
  discoverMovies: (params = "") => tmdbFetch(`/discover/movie?${params}`),
  discoverTV: (params = "") => tmdbFetch(`/discover/tv?${params}`)
};

export async function omdbFetch(query: string, type?: string, page = 1) {
  const typeParam = type && type !== "all" ? `&type=${type}` : "";
  const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}${typeParam}&page=${page}`);
  if (!res.ok) throw new Error(`OMDb error: ${res.status}`);
  return res.json();
}

export async function omdbGetDetail(imdbId: string) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(imdbId)}&plot=full`);
  if (!res.ok) throw new Error(`OMDb detail error: ${res.status}`);
  return res.json();
}

// Convert TMDB object to full site Movie document format
export function mapTmdbToMovieDoc(item: any, isTV = false, customCategory?: string) {
  const isTVDetected = isTV || item.media_type === "tv" || !!item.first_air_date;
  const title = item.title || item.name || item.original_title || item.original_name || "Untitled";
  const tmdbId = item.id;
  const year = item.release_date
    ? parseInt(item.release_date.split("-")[0])
    : item.first_air_date
    ? parseInt(item.first_air_date.split("-")[0])
    : new Date().getFullYear();

  const rawRating = item.vote_average && item.vote_average > 0 ? item.vote_average : (Math.random() * 1.5 + 7.5);
  const ratingVal = rawRating.toFixed(1);
  const poster = posterUrl(item.poster_path, true) || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80";
  const backdrop = posterUrl(item.backdrop_path, true) || poster;

  const embedPlayer = isTVDetected ? tvEmbedUrl(tmdbId, 1, 1) : movieEmbedUrl(tmdbId);
  const docId = `tmdb-${isTVDetected ? "tv" : "movie"}-${tmdbId}`;

  let genreCategory = customCategory;
  if (!genreCategory || genreCategory === "auto") {
    const genreIds = item.genre_ids || [];
    if (isTVDetected) {
      genreCategory = "Web Series";
    } else {
      if (genreIds.includes(28)) genreCategory = "Action";
      else if (genreIds.includes(12)) genreCategory = "Adventure";
      else if (genreIds.includes(16)) genreCategory = "Animation";
      else if (genreIds.includes(35)) genreCategory = "Comedy";
      else if (genreIds.includes(80)) genreCategory = "Crime";
      else if (genreIds.includes(18)) genreCategory = "Drama";
      else if (genreIds.includes(27)) genreCategory = "Horror";
      else if (genreIds.includes(10749)) genreCategory = "Romance";
      else if (genreIds.includes(878)) genreCategory = "Sci-Fi";
      else genreCategory = "Hollywood";
    }
  }

  return {
    id: docId,
    title,
    description: item.overview || `Watch ${title} (${year}) full ${isTVDetected ? "TV Series" : "movie"} in HD 1080p. High-quality streaming available with multiple server options.`,
    thumbnail: poster,
    bannerUrl: backdrop,
    videoUrl: embedPlayer,
    embedUrl: embedPlayer,
    downloadUrl: `https://api.codespecters.com/embed/${isTVDetected ? "tv" : "movie"}/${tmdbId}`,
    category: genreCategory,
    subCategory: isTVDetected ? "Web Series" : "HD Movies",
    language: item.original_language ? item.original_language.toUpperCase() : "English",
    year,
    duration: isTVDetected ? "Season 1" : "2h 05m",
    rating: `${ratingVal}/10`,
    featured: (item.vote_average || 0) > 7.0,
    views: Math.floor(Math.random() * 25000) + 12000,
    likes: Math.floor(Math.random() * 5000) + 2100,
    tmdbId,
    isTV: isTVDetected,
    createdAt: new Date().toISOString()
  };
}
