import React from "react";
import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import AdSensePlaceholder from "../components/AdSensePlaceholder";
import { Movie, WatchHistoryItem } from "../types";
import { CATEGORIES } from "../data/mockMovies";

interface HomeProps {
  movies: Movie[];
  featuredMovie: Movie | null;
  onPlay: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  favorites: string[];
  watchHistory: WatchHistoryItem[];
}

export default function Home({
  movies,
  featuredMovie,
  onPlay,
  onToggleFavorite,
  favorites,
  watchHistory
}: HomeProps) {
  
  // Group movies by category or sub-category with strict deduplication
  const getMoviesByCategory = (category: string) => {
    const matched = movies.filter(
      (m) =>
        m.category.toLowerCase() === category.toLowerCase() ||
        (m.subCategory && m.subCategory.toLowerCase() === category.toLowerCase())
    );

    const seenKeys = new Set<string>();
    const uniqueMovies: Movie[] = [];

    for (const m of matched) {
      const titleKey = m.title.toLowerCase().trim();
      const streamKey = (m.videoUrl || m.embedUrl || m.id).toLowerCase().trim();
      const compositeKey = `${titleKey}|${streamKey}`;

      if (!seenKeys.has(m.id) && !seenKeys.has(compositeKey)) {
        seenKeys.add(m.id);
        seenKeys.add(compositeKey);
        uniqueMovies.push(m);
      }
    }

    return uniqueMovies;
  };

  // Build list of recently watched movies matching watch history IDs (deduplicated by ID)
  const watchHistoryMovies = Array.from(
    new Map(
      watchHistory
        .map((item) => movies.find((m) => m.id === item.movieId))
        .filter((m): m is Movie => !!m)
        .map((m) => [m.id, m])
    ).values()
  );

  // Build list of user favorite movies
  const favoriteMovies = movies.filter((m) => favorites.includes(m.id));

  // Determine all dynamic active categories present in database
  const allDynamicCategories = React.useMemo(() => {
    const catsSet = new Set<string>(CATEGORIES);
    movies.forEach((m) => {
      if (m.category) catsSet.add(m.category);
      if (m.subCategory) catsSet.add(m.subCategory);
    });
    return Array.from(catsSet).filter(Boolean);
  }, [movies]);

  const activeCategories = allDynamicCategories.filter(cat => getMoviesByCategory(cat).length > 0);

  return (
    <div className="bg-neutral-950 pb-20 space-y-10 select-none">
      {/* Immersive cinematic spotlight hero */}
      <Hero
        movie={featuredMovie}
        onPlay={onPlay}
        onToggleFavorite={onToggleFavorite}
        isFavorite={featuredMovie ? favorites.includes(featuredMovie.id) : false}
      />

      {/* Rows & ads Layout */}
      <div className="space-y-12 -mt-12 sm:-mt-24 md:-mt-36 relative z-30">
        {/* Watch History row (if exists) */}
        {watchHistoryMovies.length > 0 && (
          <MovieRow
            title="Continue Watching"
            movies={watchHistoryMovies}
            onPlay={onPlay}
            onToggleFavorite={onToggleFavorite}
            favorites={favorites}
          />
        )}

        {/* My List / Favorites row (if exists) */}
        {favoriteMovies.length > 0 && (
          <MovieRow
            title="My Watch List"
            movies={favoriteMovies}
            onPlay={onPlay}
            onToggleFavorite={onToggleFavorite}
            favorites={favorites}
          />
        )}

        {/* Home Page AdSense Banner 1 */}
        <div className="px-4 md:px-12">
          <AdSensePlaceholder type="banner" />
        </div>

        {/* Dynamic Category Rows based on all active categories in the database */}
        {activeCategories.map((cat, index) => {
          const categoryMovies = getMoviesByCategory(cat);
          
          // Custom titles for known categories, default for others
          let rowTitle = `${cat} Streams`;
          if (cat === "Sci-Fi") rowTitle = "Trending Sci-Fi Thrillers";
          else if (cat === "Action") rowTitle = "Blockbuster Action & Adventure";
          else if (cat === "Comedy") rowTitle = "Top Rated Comedies";
          else if (cat === "Adventure") rowTitle = "Immersive Adventures & Nature";
          else if (cat === "Drama") rowTitle = "Captivating Drama & True Stories";
          else if (cat === "Thriller") rowTitle = "Suspense & Psychological Thrillers";
          else if (cat === "Horror") rowTitle = "Midnight Horror & Thrills";

          return (
            <React.Fragment key={cat}>
              <MovieRow
                title={rowTitle}
                movies={categoryMovies}
                onPlay={onPlay}
                onToggleFavorite={onToggleFavorite}
                favorites={favorites}
              />

              {/* Inject Inter-row AdSense slot after the second category row */}
              {index === 1 && (
                <div className="px-4 md:px-12 py-2">
                  <AdSensePlaceholder type="in-article" />
                </div>
              )}
            </React.Fragment>
          );
        })}

        {/* If no categories are currently populated */}
        {activeCategories.length === 0 && (
          <div className="px-4 md:px-12 py-10 text-center">
            <p className="text-neutral-500 text-sm">No streaming categories are currently populated.</p>
          </div>
        )}

        {/* Bottom AdSense footer slot */}
        <div className="px-4 md:px-12 pt-4">
          <AdSensePlaceholder type="footer" />
        </div>
      </div>
    </div>
  );
}
