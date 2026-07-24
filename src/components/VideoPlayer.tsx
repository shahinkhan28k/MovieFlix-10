import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  Gauge,
  Tv,
  ArrowLeft,
  Heart,
  Share2,
  AlertCircle,
  RefreshCw,
  Download,
  ExternalLink,
  ShieldCheck,
  Film,
  Check,
  PictureInPicture2,
  Monitor
} from "lucide-react";
import { Movie } from "../types";

interface VideoPlayerProps {
  movie: Movie;
  onBack: () => void;
  onNextRecommended?: (movie: Movie) => void;
  recommendedMovies?: Movie[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const BACKUP_MP4_POOL = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
];

export default function VideoPlayer({
  movie,
  onBack,
  onNextRecommended,
  recommendedMovies = [],
  isFavorite = false,
  onToggleFavorite
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Server modes:
  // "server1" -> Direct HTML5 Player (Fast CDN Stream / MP4)
  // "server2" -> Embed Player (YouTube / Vimeo / Archive / Clean Embed)
  // "server3" -> Archive.org / Public Domain Player
  // "server4" -> Backup CDN Pool (Guaranteed HD Video)
  const [activeServer, setActiveServer] = useState<"server1" | "server2" | "server3" | "server4">("server1");

  // Extract YouTube ID if applicable
  const youtubeId = useMemo(() => {
    const raw = movie.videoUrl || movie.embedUrl || "";
    if (raw.includes("v=")) {
      return raw.split("v=")[1]?.split("&")[0] || "";
    } else if (raw.includes("youtu.be/")) {
      return raw.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (raw.includes("/embed/")) {
      const parts = raw.split("/embed/")[1]?.split("?")[0] || "";
      if (parts && !parts.includes("/")) return parts;
    }
    return "";
  }, [movie]);

  // Extract Vimeo ID if applicable
  const vimeoId = useMemo(() => {
    const raw = movie.videoUrl || movie.embedUrl || "";
    const match = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? match[1] : "";
  }, [movie]);

  // Extract Dailymotion ID if applicable
  const dailymotionId = useMemo(() => {
    const raw = movie.videoUrl || movie.embedUrl || "";
    const match = raw.match(/dailymotion\.com\/(?:embed\/)?video\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
  }, [movie]);

  // Extract Archive.org ID if applicable
  const archiveId = useMemo(() => {
    const raw = movie.videoUrl || movie.embedUrl || "";
    if (movie.id.startsWith("ia-")) return movie.id.replace(/^ia-/, "");
    const match = raw.match(/archive\.org\/(?:details|download|embed)\/([^/]+)/);
    return match ? match[1] : "";
  }, [movie]);

  // Calculate numeric hash for backup stream matching
  const backupStreamUrl = useMemo(() => {
    let numericHash = 0;
    for (let i = 0; i < movie.id.length; i++) {
      numericHash += movie.id.charCodeAt(i);
    }
    return BACKUP_MP4_POOL[numericHash % BACKUP_MP4_POOL.length];
  }, [movie]);

  // Determine current video stream or iframe URL
  const currentStreamInfo = useMemo(() => {
    let url = movie.videoUrl || movie.embedUrl || "";
    let isIframe = false;

    if (activeServer === "server4") {
      url = backupStreamUrl;
      isIframe = false;
      return { url, isIframe };
    }

    if (activeServer === "server3") {
      if (archiveId) {
        url = `https://archive.org/embed/${archiveId}`;
        isIframe = true;
      } else {
        url = backupStreamUrl;
        isIframe = false;
      }
      return { url, isIframe };
    }

    if (activeServer === "server2") {
      if (youtubeId) {
        url = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
        isIframe = true;
      } else if (vimeoId) {
        url = `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
        isIframe = true;
      } else if (dailymotionId) {
        url = `https://www.dailymotion.com/embed/video/${dailymotionId}?autoplay=1`;
        isIframe = true;
      } else if (archiveId) {
        url = `https://archive.org/embed/${archiveId}`;
        isIframe = true;
      } else if (url.includes("/embed/") || url.includes("player")) {
        isIframe = true;
      } else {
        // Fallback to direct player
        isIframe = false;
        url = movie.videoUrl || movie.embedUrl || backupStreamUrl;
      }
      return { url, isIframe };
    }

    // Server 1 (Direct Video Tag Mode - Primary)
    if (youtubeId) {
      url = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
      isIframe = true;
    } else if (vimeoId) {
      url = `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
      isIframe = true;
    } else if (dailymotionId) {
      url = `https://www.dailymotion.com/embed/video/${dailymotionId}?autoplay=1`;
      isIframe = true;
    } else if (url.includes("archive.org/embed/")) {
      isIframe = true;
    } else if (url.includes("/embed/") || url.includes("iframe")) {
      isIframe = true;
    } else {
      isIframe = false;
      if (!url || url.length < 5) {
        url = backupStreamUrl;
      }
    }

    return { url, isIframe };
  }, [movie, activeServer, youtubeId, vimeoId, dailymotionId, archiveId, backupStreamUrl]);

  // Rotate server option
  const rotateServerNext = () => {
    const serversList: Array<"server1" | "server2" | "server3" | "server4"> = ["server1", "server2", "server3", "server4"];
    const currentIndex = serversList.indexOf(activeServer);
    const nextServer = serversList[(currentIndex + 1) % serversList.length];
    setActiveServer(nextServer);
    setHasError(false);
    setStatusMessage(`Switched to Server ${nextServer.slice(-1).toUpperCase()} Streaming Provider`);
  };

  // Auto-hide controls during video playback
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleMouseMove = () => {
      setControlsVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (isPlaying) {
          setControlsVisible(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      clearTimeout(timer);
    };
  }, [isPlaying]);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current || currentStreamInfo.isIframe) return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "arrowleft":
          e.preventDefault();
          skip(-10);
          break;
        case "arrowright":
          e.preventDefault();
          skip(10);
          break;
        case "arrowup":
          e.preventDefault();
          setVolume((v) => Math.min(1, v + 0.1));
          setIsMuted(false);
          break;
        case "arrowdown":
          e.preventDefault();
          setVolume((v) => Math.max(0, v - 0.1));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStreamInfo.isIframe]);

  // Video event handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => setHasError(true));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.volume = volume;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn("Picture in Picture error:", err);
    }
  };

  const handleVideoError = () => {
    console.warn("Primary stream load error, switching server automatically...");
    setHasError(true);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return `${hours}:${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleOpenDirectWatch = () => {
    const rawUrl = currentStreamInfo.url;
    window.open(rawUrl, "_blank", "noopener,noreferrer");
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownload = () => {
    setShowDownloadModal(true);
  };

  return (
    <div className={`space-y-4 max-w-full mx-auto text-left font-sans ${isTheaterMode ? "max-w-none" : ""}`}>
      {/* Top Navigation & Toolbar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-950 p-3 rounded-lg border border-neutral-900 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded text-xs font-bold transition-all border border-neutral-800 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

          <span className="text-neutral-700 hidden sm:inline">|</span>

          {/* Server Switcher Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => { setActiveServer("server1"); setHasError(false); setStatusMessage(null); }}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeServer === "server1"
                  ? "bg-red-600 text-white shadow"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              <Monitor size={12} />
              <span>Server 1 (Direct Stream)</span>
            </button>

            <button
              onClick={() => { setActiveServer("server2"); setHasError(false); setStatusMessage(null); }}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeServer === "server2"
                  ? "bg-red-600 text-white shadow"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              <Film size={12} />
              <span>Server 2 (Embed HD)</span>
            </button>

            {archiveId && (
              <button
                onClick={() => { setActiveServer("server3"); setHasError(false); setStatusMessage(null); }}
                className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeServer === "server3"
                    ? "bg-red-600 text-white shadow"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                <ShieldCheck size={12} />
                <span>Server 3 (Archive.org)</span>
              </button>
            )}

            <button
              onClick={() => { setActiveServer("server4"); setHasError(false); setStatusMessage(null); }}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeServer === "server4"
                  ? "bg-red-600 text-white shadow"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              <Tv size={12} />
              <span>Server 4 (Backup CDN)</span>
            </button>

            <button
              onClick={rotateServerNext}
              className="px-2.5 py-1 bg-amber-600/80 hover:bg-amber-500 border border-amber-500 text-white font-bold rounded flex items-center gap-1 transition-all shadow cursor-pointer text-xs"
              title="Change server if stream is slow or unresponsive"
            >
              <RefreshCw size={12} />
              <span>Rotate Server</span>
            </button>

            {/* Direct Window Watch Button */}
            <button
              onClick={handleOpenDirectWatch}
              className="px-2.5 py-1 bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-500/80 text-white font-bold rounded flex items-center gap-1.5 transition-all shadow cursor-pointer text-xs"
              title="Opens stream URL in a new tab"
            >
              <ExternalLink size={12} />
              <span>Open Direct</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="px-2.5 py-1 bg-blue-700/80 hover:bg-blue-600 border border-blue-500/80 text-white font-bold rounded flex items-center gap-1.5 transition-all shadow cursor-pointer text-xs"
              title="Download movie file"
            >
              <Download size={12} />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                isFavorite
                  ? "bg-red-600/10 border-red-500/30 text-red-500"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              <Heart size={13} className={isFavorite ? "fill-red-500" : ""} />
              <span>{isFavorite ? "In My List" : "Add to My List"}</span>
            </button>
          )}

          <button
            onClick={handleShareLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded transition-colors cursor-pointer"
          >
            {copiedLink ? <Check size={13} className="text-green-500" /> : <Share2 size={13} />}
            <span>{copiedLink ? "Copied!" : "Share"}</span>
          </button>

          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded border transition-colors cursor-pointer ${
              isTheaterMode
                ? "bg-red-600/10 border-red-500/30 text-red-500"
                : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
            }`}
          >
            <Tv size={13} />
            <span>{isTheaterMode ? "Normal Mode" : "Theater Mode"}</span>
          </button>
        </div>
      </div>

      {/* Server status toast notification */}
      {statusMessage && (
        <div className="bg-amber-950/60 border border-amber-800/80 rounded-lg p-2.5 px-4 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin text-amber-400" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-amber-400 hover:text-white font-bold ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Video Player Screen Container */}
      <div
        ref={containerRef}
        className={`relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group border border-neutral-900 ${
          isFullscreen ? "rounded-none border-0 h-screen aspect-auto" : ""
        }`}
      >
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 p-6 text-center select-none">
            <AlertCircle size={48} className="text-red-500 mb-3 animate-bounce" />
            <h4 className="text-lg font-bold text-neutral-200">ভিডিও প্লে হতে সমস্যা দেখাচ্ছে?</h4>
            <p className="text-xs text-neutral-400 max-w-lg mt-1 leading-relaxed">
              নিচের বিকল্প সার্ভারে সুইচ করুন অথবা সরাসরি আনব্লকড উইন্ডোতে প্লেয়ার ওপেন করুন:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <button
                onClick={() => {
                  setActiveServer("server4");
                  setHasError(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded transition-all shadow-lg cursor-pointer"
              >
                Switch to Server 4 (Backup Direct HD)
              </button>
              <button
                onClick={handleOpenDirectWatch}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <ExternalLink size={14} />
                <span>সরাসরি প্লেয়ার উইন্ডো</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={14} />
                <span>ভিডিও ডাউনলোড করুন</span>
              </button>
            </div>
          </div>
        ) : currentStreamInfo.isIframe ? (
          /* Render Clean IFRAME Player for Youtube, Vimeo, Dailymotion, or Clean Embeds */
          <div className="relative w-full h-full">
            <iframe
              src={currentStreamInfo.url}
              title={movie.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            />
            {/* Quick rotate overlay button */}
            <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
              <button
                onClick={rotateServerNext}
                className="bg-neutral-900/90 hover:bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-neutral-700 flex items-center gap-1.5 shadow-xl transition-all cursor-pointer backdrop-blur-md"
                title="Rotate to next streaming server"
              >
                <RefreshCw size={12} />
                <span>Rotate Server</span>
              </button>
            </div>
          </div>
        ) : (
          /* Render Premium HTML5 Native Video Player */
          <>
            <video
              ref={videoRef}
              src={currentStreamInfo.url}
              poster={movie.thumbnail}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onError={handleVideoError}
              className="w-full h-full object-contain cursor-pointer"
              onContextMenu={(e) => e.preventDefault()}
              onClick={togglePlay}
              preload="auto"
              playsInline
            />

            {/* Center Play/Pause Splash Overlay */}
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center cursor-pointer pointer-events-auto"
            >
              {!isPlaying && (
                <div className="p-6 rounded-full bg-red-600/90 border border-red-500 text-white scale-100 hover:scale-110 active:scale-95 transition-all shadow-2xl backdrop-blur-sm">
                  <Play size={32} className="fill-white translate-x-0.5" />
                </div>
              )}
            </div>

            {/* Controls overlay */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 flex flex-col gap-3 transition-opacity duration-300 z-40 select-none ${
                controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Timeline Slider */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-neutral-300 font-bold select-none">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
                />
                <span className="text-[11px] font-mono text-neutral-300 font-bold select-none">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Lower Controls Toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 sm:gap-5">
                  {/* Play / Pause button */}
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-red-500 transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} className="fill-white" />}
                  </button>

                  {/* Skip Buttons */}
                  <button
                    onClick={() => skip(-10)}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="Rewind 10s"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    onClick={() => skip(10)}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="Forward 10s"
                  >
                    <RotateCw size={18} />
                  </button>

                  {/* Volume Controls */}
                  <div className="flex items-center gap-2 group/volume">
                    <button
                      onClick={toggleMute}
                      className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none hidden sm:inline-block"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Playback speed options dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                      className="flex items-center gap-1 text-xs text-neutral-300 hover:text-white font-semibold cursor-pointer"
                    >
                      <Gauge size={15} />
                      <span>{playbackRate}x</span>
                    </button>

                    {showSpeedMenu && (
                      <div className="absolute bottom-8 right-0 w-24 bg-neutral-950 border border-neutral-800 rounded-lg shadow-2xl py-1 z-50 text-xs">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => handleSpeedChange(rate)}
                            className={`w-full text-left px-3 py-1.5 hover:bg-neutral-900 transition-colors cursor-pointer ${
                              playbackRate === rate ? "text-red-500 font-bold bg-neutral-900" : "text-neutral-400"
                            }`}
                          >
                            {rate === 1 ? "Normal" : `${rate}x`}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Picture-in-picture button */}
                  <button
                    onClick={togglePictureInPicture}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer hidden sm:block"
                    title="Picture-in-Picture"
                  >
                    <PictureInPicture2 size={18} />
                  </button>

                  {/* Maximize / Fullscreen Toggle */}
                  <button
                    onClick={toggleFullscreen}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="Toggle Fullscreen"
                  >
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <Download size={18} className="text-blue-500" />
                <span>ভিডিও ডাউনলোড অপশন</span>
              </div>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-neutral-400 hover:text-white text-xs font-bold border border-neutral-800 px-2.5 py-1 rounded cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              <strong>{movie.title}</strong> ডাউনলোডের জন্য নিচের লিংকে ক্লিক করুন:
            </p>

            <div className="space-y-2.5">
              <a
                href={movie.downloadUrl || movie.videoUrl || currentStreamInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Film size={14} />
                  <span>Direct Movie Stream (HD 1080p)</span>
                </span>
                <ExternalLink size={14} />
              </a>

              {youtubeId && (
                <a
                  href={`https://www.youtube.com/watch?v=${youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 rounded-lg font-bold text-xs transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Download size={14} />
                    <span>Download via YouTube Source</span>
                  </span>
                  <ExternalLink size={14} />
                </a>
              )}

              <a
                href={backupStreamUrl}
                download={`${movie.title}.mp4`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg font-bold text-xs transition-colors border border-neutral-700"
              >
                <span className="flex items-center gap-2">
                  <Download size={14} className="text-green-400" />
                  <span>Download Backup MP4 Stream</span>
                </span>
                <Download size={14} />
              </a>
            </div>

            <p className="text-[10px] text-neutral-500 italic">
              * নোট: ব্রাউজারে ভিডিও প্লে হলে মাউসে রাইট ক্লিক (Right-Click) করে "Save Video As..." বেছে ডাউনলোড করে নিন।
            </p>
          </div>
        </div>
      )}

      {/* Description & Up Next Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-1 select-none pt-2">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-black text-white">{movie.title}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-bold mt-1">
              <span className="text-green-500">{movie.year}</span>
              <span>•</span>
              <span>{movie.duration}</span>
              <span>•</span>
              <span className="border border-neutral-800 px-1.5 py-0.5 rounded text-[10px] text-neutral-400 uppercase font-mono">
                {movie.rating}
              </span>
              <span>•</span>
              <span className="text-neutral-300 bg-neutral-900 border border-neutral-800 px-2.5 py-0.5 rounded">
                {movie.category}
              </span>
            </div>
          </div>

          <div className="border-t border-neutral-900/80 pt-4">
            <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Movie Narrative</h5>
            <p className="text-sm text-neutral-300 leading-relaxed">{movie.description}</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-neutral-400 font-semibold">Active Server: <strong className="text-white uppercase">{activeServer}</strong> — Free High Speed Stream</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleOpenDirectWatch} className="text-emerald-400 font-bold hover:underline flex items-center gap-1">
                <ExternalLink size={12} />
                <span>Direct Open</span>
              </button>
              <span className="text-neutral-800">|</span>
              <button onClick={handleDownload} className="text-blue-400 font-bold hover:underline flex items-center gap-1">
                <Download size={12} />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Up Next Sidebar Recommendations */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest px-1">Up Next (Recommended)</h4>
          <div className="flex flex-col gap-3">
            {recommendedMovies.filter(m => m.id !== movie.id).slice(0, 4).map((recMovie) => (
              <div
                key={recMovie.id}
                onClick={() => onNextRecommended && onNextRecommended(recMovie)}
                className="flex gap-3 bg-neutral-950 hover:bg-neutral-900 p-2.5 rounded-xl border border-neutral-900 hover:border-neutral-800 cursor-pointer transition-all group"
              >
                <div className="relative w-28 aspect-[16/9] bg-neutral-900 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={recMovie.thumbnail}
                    alt={recMovie.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={16} className="fill-white text-white" />
                  </div>
                </div>

                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-white truncate group-hover:text-red-500 transition-colors">
                    {recMovie.title}
                  </h5>
                  <p className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1.5 font-semibold">
                    <span>{recMovie.year}</span>
                    <span>•</span>
                    <span>{recMovie.duration}</span>
                  </p>
                </div>
              </div>
            ))}

            {recommendedMovies.filter(m => m.id !== movie.id).length === 0 && (
              <p className="text-xs text-neutral-600 italic px-2">No recommended titles available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
