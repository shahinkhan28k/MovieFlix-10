import React, { useState } from "react";
import { Play, Plus, Check, Star, Clock, Calendar, Film } from "lucide-react";
import { Movie } from "../types";

interface MovieCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  isFavorite: boolean;
  key?: string;
}

export default function MovieCard({ movie, onPlay, onToggleFavorite, isFavorite }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex-shrink-0 w-40 sm:w-48 md:w-56 aspect-[16/9] bg-neutral-900 rounded overflow-hidden cursor-pointer select-none transition-all duration-300 transform hover:scale-110 hover:z-30 shadow-md hover:shadow-2xl"
    >
      {/* Movie Thumbnail Image */}
      <img
        src={movie.thumbnail}
        alt={movie.title}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transform transition-transform duration-500 hover:brightness-[0.8]"
      />

      {/* Floating Category Tag */}
      <span className="absolute top-1.5 left-1.5 bg-black/70 border border-neutral-800/60 px-1.5 py-0.5 rounded text-[9px] font-bold text-neutral-300 uppercase tracking-wide">
        {movie.category}
      </span>

      {/* Hover Overlay Panel with complete Quick Play and Quick Details actions */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30 flex flex-col justify-end p-2.5 sm:p-3 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-1 sm:gap-1.5">
          {/* Movie Title */}
          <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-1">
            {movie.title}
          </h4>

          {/* Technical Info Row */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-neutral-300 font-semibold">
            <span className="text-green-500 font-extrabold">95% Match</span>
            <span className="border border-neutral-700 px-1 rounded text-[8px] uppercase text-neutral-400 font-bold">
              {movie.rating}
            </span>
            <span>{movie.duration}</span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between mt-1 sm:mt-1.5 pt-1.5 border-t border-neutral-800/60">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(movie);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-neutral-200 text-black text-[10px] font-extrabold rounded transition-colors"
            >
              <Play size={10} className="fill-black" />
              <span>Play</span>
            </button>

            <div className="flex items-center gap-1">
              {/* Toggle Favorites */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(movie);
                }}
                className={`p-1.5 rounded-full border transition-colors ${
                  isFavorite
                    ? "bg-red-600/10 border-red-500/50 text-red-500"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
                title={isFavorite ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                {isFavorite ? <Check size={12} /> : <Plus size={12} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
