import { Movie } from "../types";

const LOCAL_STORAGE_KEY = "movieflix_local_imported_movies";

export function getLocalStorageMovies(): Movie[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Error reading local movies catalog:", e);
    return [];
  }
}

export function saveMoviesToLocalStorage(moviesToSave: Movie | Movie[]): Movie[] {
  try {
    const current = getLocalStorageMovies();
    const newItems = Array.isArray(moviesToSave) ? moviesToSave : [moviesToSave];
    
    const movieMap = new Map<string, Movie>();
    current.forEach((m) => {
      if (m && m.id) movieMap.set(m.id, m);
    });
    
    newItems.forEach((m) => {
      if (m && m.id) {
        movieMap.set(m.id, m);
      }
    });

    const updatedList = Array.from(movieMap.values());
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    return updatedList;
  } catch (e) {
    console.warn("Error saving movies to local storage:", e);
    return [];
  }
}

export function removeMovieFromLocalStorage(movieId: string): Movie[] {
  try {
    const current = getLocalStorageMovies();
    const updated = current.filter((m) => m.id !== movieId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Error removing movie from local storage:", e);
    return [];
  }
}

export function clearAllLocalMovies(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (e) {
    console.warn("Error clearing local movies storage:", e);
  }
}

export function mergeMovieCatalogs(...catalogs: Movie[][]): Movie[] {
  const movieMap = new Map<string, Movie>();
  catalogs.forEach((cat) => {
    if (Array.isArray(cat)) {
      cat.forEach((m) => {
        if (m && m.id) {
          movieMap.set(m.id, m);
        }
      });
    }
  });
  return Array.from(movieMap.values());
}
