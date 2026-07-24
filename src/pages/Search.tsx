import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import AdSensePlaceholder from "../components/AdSensePlaceholder";
import { Movie } from "../types";
import { Search as SearchIcon, Clock, Trash2, X } from "lucide-react";

interface SearchProps {
  query: string;
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  favorites: string[];
  onSelectSearchQuery?: (q: string) => void;
}

export default function Search({ query, movies, onPlay, onToggleFavorite, favorites, onSelectSearchQuery }: SearchProps) {
  
  // Local state for search history
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("movieflix_search_history");
      return saved ? JSON.parse(saved) : ["Bad Boys", "Action", "Classic Movies", "Bangla Natok"];
    } catch {
      return ["Bad Boys", "Action", "Classic Movies", "Bangla Natok"];
    }
  });

  const clearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem("movieflix_search_history");
    } catch (e) {}
  };

  const removeItem = (term: string) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((t) => t !== term);
      try {
        localStorage.setItem("movieflix_search_history", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Real-time keyword filter across titles, categories, sub-categories, languages and descriptions (deduplicated)
  const rawFiltered = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.category.toLowerCase().includes(query.toLowerCase()) ||
      (movie.subCategory && movie.subCategory.toLowerCase().includes(query.toLowerCase())) ||
      (movie.language && movie.language.toLowerCase().includes(query.toLowerCase())) ||
      movie.description.toLowerCase().includes(query.toLowerCase())
  );

  // Strict deduplication by movie ID and by normalized title + video stream URL
  const seenMovieKeys = new Set<string>();
  const filteredMovies: Movie[] = [];

  for (const movie of rawFiltered) {
    const titleKey = movie.title.toLowerCase().trim();
    const streamKey = (movie.videoUrl || movie.embedUrl || movie.id).toLowerCase().trim();
    const compositeKey = `${titleKey}|${streamKey}`;

    if (!seenMovieKeys.has(movie.id) && !seenMovieKeys.has(compositeKey)) {
      seenMovieKeys.add(movie.id);
      seenMovieKeys.add(compositeKey);
      filteredMovies.push(movie);
    }
  }

  return (
    <div className="bg-neutral-950 min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Search Header */}
        <div className="border-b border-neutral-900 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <SearchIcon className="text-red-600 h-5 w-5" />
                {query ? (
                  <span>
                    Search results for: <strong className="text-red-500">"{query}"</strong>
                  </span>
                ) : (
                  <span>Explore Stream Catalog</span>
                )}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Found {filteredMovies.length} matching entries in Cloud Firestore.
              </p>
            </div>

            {query && onSelectSearchQuery && (
              <button
                onClick={() => onSelectSearchQuery("")}
                className="self-start sm:self-auto text-xs bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <X size={14} />
                <span>Clear Search Filter</span>
              </button>
            )}
          </div>

          {/* Search History Tags Section */}
          {searchHistory.length > 0 && (
            <div className="mt-4 pt-3 border-t border-neutral-900/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-neutral-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock size={13} className="text-red-500" />
                  <span>Recent Searches (সম্প্রতি খোঁজা হয়েছে)</span>
                </span>
                <button
                  onClick={clearHistory}
                  className="text-[11px] text-neutral-500 hover:text-red-400 font-medium transition-colors flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  <span>Clear History</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                      query.toLowerCase() === term.toLowerCase()
                        ? "bg-red-600 border-red-500 text-white font-bold shadow-md shadow-red-600/20"
                        : "bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300 hover:text-white"
                    }`}
                    onClick={() => onSelectSearchQuery && onSelectSearchQuery(term)}
                  >
                    <Clock size={11} className={query.toLowerCase() === term.toLowerCase() ? "text-white" : "text-neutral-500"} />
                    <span>{term}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(term);
                      }}
                      className="text-neutral-500 hover:text-red-400 ml-1 p-0.5 rounded-full"
                      title="Remove search term"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results grid layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="flex justify-center">
              <MovieCard
                movie={movie}
                onPlay={onPlay}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.includes(movie.id)}
              />
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-20 bg-neutral-950 rounded-lg border border-neutral-900/60 max-w-xl mx-auto">
            <SearchIcon size={40} className="text-neutral-700 mx-auto mb-4" />
            <h4 className="text-sm font-bold text-neutral-300">No Streaming Matches Found</h4>
            <p className="text-xs text-neutral-600 max-w-xs mx-auto mt-1 leading-relaxed">
              We couldn't locate any movies, animations or trailers matching that specific phrase. Try other categories like Action, Sci-Fi, or Comedy.
            </p>
          </div>
        )}

        {/* Banner Ad Placement */}
        <div className="pt-8">
          <AdSensePlaceholder type="banner" />
        </div>

      </div>
    </div>
  );
}
