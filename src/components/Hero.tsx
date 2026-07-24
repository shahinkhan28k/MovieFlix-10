import React, { useState } from "react";
import { Play, Info, Volume2, VolumeX, ThumbsUp, Calendar, Clock, Star } from "lucide-react";
import { Movie } from "../types";

interface HeroProps {
  movie: Movie | null;
  onPlay: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  isFavorite: boolean;
}

export default function Hero({ movie, onPlay, onToggleFavorite, isFavorite }: HeroProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!movie) {
    return (
      <div className="relative h-[56.25vw] min-h-[350px] max-h-[750px] w-full bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-neutral-400 text-xs font-bold tracking-widest uppercase">Initializing Stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[75vw] sm:h-[56.25vw] min-h-[420px] max-h-[820px] w-full overflow-hidden bg-neutral-950 select-none">
      {/* Background Image / Banner */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-neutral-900 transition-opacity duration-1000 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />
        <img
          src={movie.bannerUrl || movie.thumbnail}
          alt={movie.title}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center transform scale-105 transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'} brightness-[0.7] contrast-[1.05]`}
        />
        {/* Ambient Gradients to blend with Netflix layout */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent" />
      </div>

      {/* Main Spotlight Metadata */}
      <div className="absolute bottom-[15%] left-[4%] md:left-[6%] right-[4%] md:max-w-2xl z-20 flex flex-col gap-3 md:gap-5">
        {/* Brow pill */}
        <div className="flex items-center gap-2">
          <span className="bg-red-600 text-white font-black text-[10px] tracking-widest px-2 py-0.5 uppercase rounded shadow-sm">
            Spotlight Film
          </span>
          <span className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-800">
            <Star size={12} className="fill-amber-500" />
            <span>4.9 Rating</span>
          </span>
        </div>

        {/* Cinematic Title */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md leading-none"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {movie.title}
        </h1>

        {/* Dynamic Movie Info Row */}
        <div className="flex flex-wrap items-center gap-3.5 text-xs sm:text-sm text-neutral-300 font-medium">
          <span className="text-green-500 font-bold">98% Match</span>
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {movie.year}
          </span>
          <span className="border border-neutral-600 px-1.5 py-0.2 rounded text-[10px] uppercase font-bold text-neutral-400">
            {movie.rating}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {movie.duration}
          </span>
          <span className="text-neutral-400 bg-neutral-900/60 px-2 py-0.5 rounded text-xs border border-neutral-800/50">
            {movie.category}
          </span>
        </div>

        {/* Narrative Description */}
        <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed drop-shadow max-w-xl line-clamp-3">
          {movie.description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-2 sm:mt-4">
          <button
            onClick={() => onPlay(movie)}
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm sm:text-base rounded-md transition-all active:scale-95 shadow-lg cursor-pointer hover:shadow-white/10"
          >
            <Play size={18} className="fill-black" />
            <span>Play Now</span>
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-neutral-800/90 hover:bg-neutral-700/90 text-white font-bold text-sm sm:text-base rounded-md transition-all active:scale-95 border border-neutral-700/50 cursor-pointer"
          >
            <Info size={18} />
            <span>More Info</span>
          </button>

          <button
            onClick={() => onToggleFavorite(movie)}
            className={`p-2.5 sm:p-3 rounded-full border transition-all active:scale-95 cursor-pointer ${
              isFavorite
                ? "bg-red-600/20 border-red-500 text-red-500"
                : "bg-neutral-900/60 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800/80"
            }`}
            title={isFavorite ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            <ThumbsUp size={16} className={isFavorite ? "fill-red-500" : ""} />
          </button>
        </div>
      </div>

      {/* Floating Action Controls (Mute/Volume and Rating badge) */}
      <div className="absolute right-[4%] bottom-[15%] z-20 flex items-center gap-3">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 bg-neutral-950/80 hover:bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white rounded-full transition-all"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <div className="border-l-4 border-neutral-600 bg-neutral-950/60 px-4 py-1.5 text-xs text-neutral-400 font-bold select-none pr-6">
          {movie.rating}
        </div>
      </div>

      {/* Slide-out/Toggleable Additional Movie Information Dialog */}
      {showInfo && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-lg w-full p-6 relative shadow-2xl animate-scale-up">
            <h3 className="text-xl font-black text-white mb-2">{movie.title}</h3>
            <div className="flex gap-3 text-xs text-neutral-400 mb-4 font-bold">
              <span className="text-green-500">{movie.year}</span>
              <span>•</span>
              <span>{movie.duration}</span>
              <span>•</span>
              <span className="text-amber-500 uppercase">{movie.rating}</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
              {movie.description}
            </p>
            <div className="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-4 text-xs text-neutral-400">
              <div>
                <span className="block font-semibold text-neutral-500">Category / Genre</span>
                <span className="text-neutral-200">{movie.category}</span>
              </div>
              <div>
                <span className="block font-semibold text-neutral-500">Global Audience Views</span>
                <span className="text-neutral-200">{movie.views.toLocaleString()} views</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowInfo(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold rounded"
              >
                Close details
              </button>
              <button
                onClick={() => {
                  setShowInfo(false);
                  onPlay(movie);
                }}
                className="px-5 py-2 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-extrabold rounded flex items-center gap-1.5"
              >
                <Play size={12} className="fill-black" />
                <span>Play Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
