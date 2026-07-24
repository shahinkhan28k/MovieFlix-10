import React from "react";
import VideoPlayer from "../components/VideoPlayer";
import AdSensePlaceholder from "../components/AdSensePlaceholder";
import { Movie } from "../types";

interface WatchProps {
  movie: Movie;
  onBack: () => void;
  onPlay: (movie: Movie) => void;
  movies: Movie[];
  favorites: string[];
  onToggleFavorite: (movie: Movie) => void;
}

export default function Watch({
  movie,
  onBack,
  onPlay,
  movies,
  favorites,
  onToggleFavorite
}: WatchProps) {
  
  // Recommend movies in the same category, excluding the active playing movie (deduplicated by ID)
  const categoryMatches = movies.filter((m) => m.category === movie.category && m.id !== movie.id);
  const otherMatches = movies.filter((m) => m.category !== movie.category && m.id !== movie.id);
  const recommendedMovies = Array.from(
    new Map([...categoryMatches, ...otherMatches].map((m) => [m.id, m])).values()
  ).slice(0, 6);

  return (
    <div className="bg-neutral-950 min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Main interactive player stream column */}
        <div className="xl:col-span-3 space-y-8">
          <VideoPlayer
            movie={movie}
            onBack={onBack}
            onNextRecommended={onPlay}
            recommendedMovies={recommendedMovies}
            isFavorite={favorites.includes(movie.id)}
            onToggleFavorite={() => onToggleFavorite(movie)}
          />

          {/* In-Article Contextual Ad Unit */}
          <div className="py-4">
            <AdSensePlaceholder type="in-article" />
          </div>
        </div>

        {/* Sidebar advertisement & information stats column */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
            <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-3">Live Streaming Telemetry</h4>
            <div className="space-y-3.5 text-xs text-neutral-300 font-semibold leading-relaxed">
              <div className="flex justify-between border-b border-neutral-800/60 pb-2">
                <span className="text-neutral-500">Video Server:</span>
                <span className="text-green-500">Cloud Run CDN</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800/60 pb-2">
                <span className="text-neutral-500">Resolution:</span>
                <span>Auto (1080p UHD)</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800/60 pb-2">
                <span className="text-neutral-500">Codec:</span>
                <span>H.264 / AAC Baseline</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-neutral-500">Audio Channels:</span>
                <span>Dolby Digital Stereo</span>
              </div>
            </div>
          </div>

          {/* AdSense Sidebar slot */}
          <AdSensePlaceholder type="sidebar" />
        </div>

      </div>
    </div>
  );
}
