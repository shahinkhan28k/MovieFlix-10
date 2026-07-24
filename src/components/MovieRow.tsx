import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import { Movie } from "../types";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  favorites: string[];
}

export default function MovieRow({ title, movies, onPlay, onToggleFavorite, favorites }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      
      rowRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="space-y-3 relative group select-none px-4 md:px-12">
      {/* Row Header */}
      <h3 className="text-base sm:text-lg md:text-xl font-black text-white hover:text-red-500 cursor-pointer transition-colors inline-block">
        {title}
      </h3>

      {/* Row Container Frame */}
      <div className="relative">
        {/* Left Scroll Trigger Button */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-10 md:w-12 bg-black/60 hover:bg-black/85 text-neutral-400 hover:text-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 z-40"
          aria-label="Scroll Left"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Smooth Horizontal Scrolling Movie Ribbon */}
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto scrollbar-none py-4 scroll-smooth px-2"
        >
          {Array.from(new Map(movies.map((m) => [m.id, m])).values()).map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlay={onPlay}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.includes(movie.id)}
            />
          ))}
        </div>

        {/* Right Scroll Trigger Button */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-10 md:w-12 bg-black/60 hover:bg-black/85 text-neutral-400 hover:text-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 z-40"
          aria-label="Scroll Right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
