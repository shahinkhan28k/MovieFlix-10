import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, getDocs, doc, getDoc, setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, query, limit } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { auth, db } from "./firebase";
import { Movie, WatchHistoryItem, UserProfile, ThemeSettings, DEFAULT_THEME_SETTINGS, UserRole } from "./types";
import { INITIAL_MOVIES } from "./data/mockMovies";
import { getLocalStorageMovies, mergeMovieCatalogs } from "./lib/movieStorage";

// Component imports
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdSensePlaceholder from "./components/AdSensePlaceholder";
import MovieCard from "./components/MovieCard";

// Icon imports
import { Heart, Clock, Film } from "lucide-react";

export default function App() {
  // Navigation & Router Views
  const [currentView, setCurrentView] = useState<string>("home"); // home, watch, search, category, favorites, history, admin
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Firebase auth & Catalog states
  const [user, setUser] = useState<UserProfile | null>(null);
  const [movies, setMovies] = useState<Movie[]>(() => {
    const local = getLocalStorageMovies();
    return mergeMovieCatalogs(INITIAL_MOVIES, local);
  });
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(() => {
    const local = getLocalStorageMovies();
    const merged = mergeMovieCatalogs(INITIAL_MOVIES, local);
    return merged.find(m => m.featured) || merged[0] || null;
  });
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // False by default because we initialize with local data

  // Global Theme Settings state
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(DEFAULT_THEME_SETTINGS);

  // User-specific states (synchronized with Firestore if authenticated, else localStorage)
  const [favorites, setFavorites] = useState<string[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);

  // Apply Theme settings to DOM HTML element
  const applyThemeToDOM = (ts: ThemeSettings) => {
    const root = document.documentElement;
    const activeTheme = ts.themeId || ts.siteThemeId || "netflix";
    const isDark = ts.darkOn ?? ts.isDarkOn ?? true;

    root.setAttribute("data-theme", activeTheme);
    root.setAttribute("data-mode", isDark ? "dark" : "light");
    root.setAttribute("data-accent", ts.accentColor || "red");
    root.setAttribute("data-screen", ts.screenLayoutMode || "standard");

    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  };

  // Real-time Global Theme listener from Firestore
  useEffect(() => {
    const themeDocRef = doc(db, "settings", "theme");
    const unsubscribe = onSnapshot(
      themeDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as ThemeSettings;
          const merged: ThemeSettings = { ...DEFAULT_THEME_SETTINGS, ...data };
          setThemeSettings(merged);
          applyThemeToDOM(merged);
        } else {
          applyThemeToDOM(DEFAULT_THEME_SETTINGS);
        }
      },
      (err) => {
        console.warn("Theme Firestore subscription notice:", err);
        applyThemeToDOM(DEFAULT_THEME_SETTINGS);
      }
    );

    return () => unsubscribe();
  }, []);

  // Quick user toggle for dark/light mode in navbar
  const handleToggleDarkMode = () => {
    const isCurrentlyDark = themeSettings.darkOn ?? themeSettings.isDarkOn ?? true;
    const updatedDark = !isCurrentlyDark;
    const nextSettings = { ...themeSettings, darkOn: updatedDark, isDarkOn: updatedDark, mode: updatedDark ? ("dark" as const) : ("light" as const) };
    setThemeSettings(nextSettings);
    applyThemeToDOM(nextSettings);

    // If user is admin/logged in, save back to Firestore
    if (user?.isAdmin) {
      setDoc(doc(db, "settings", "theme"), { darkOn: updatedDark, isDarkOn: updatedDark, mode: updatedDark ? "dark" : "light" }, { merge: true }).catch(() => {});
    }
  };


  // 1. Monitor Authentication State changes
  useEffect(() => {
    let userUnsubscribe: (() => void) | null = null;

    const authUnsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (userUnsubscribe) {
        userUnsubscribe();
        userUnsubscribe = null;
      }

      if (firebaseUser) {
        const cleanUserEmail = firebaseUser.email?.trim().toLowerCase() || "";
        const isSuperAdmin = cleanUserEmail === "admin@movieflix.com" || 
                             cleanUserEmail === "djskshahin544@gmail.com" || 
                             cleanUserEmail === "shahinkhan28qqqq@gmail.com" ||
                             cleanUserEmail === "shahinkhan28ddd@gmail.com" ||
                             cleanUserEmail === "shahinkhan28uu@gmail.com";
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: isSuperAdmin ? "admin" : "user",
          isAdmin: isSuperAdmin,
          isModerator: false
        };
        setUser(profile);
        // Load user cloud stats and store unsubscribe handler
        userUnsubscribe = loadUserCloudData(firebaseUser);
      } else {
        setUser(null);
        // Fallback to local storage values
        loadLocalStorageData();
      }
    });

    return () => {
      if (userUnsubscribe) userUnsubscribe();
      authUnsubscribe();
    };
  }, []);

  // 2. Fetch & subscribe to real-time movies stream catalog from Firestore
  useEffect(() => {
    const moviesRef = collection(db, "movies");
    const q = query(moviesRef, limit(500));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedMovies: Movie[] = [];
        snapshot.forEach((docSnap) => {
          loadedMovies.push({ id: docSnap.id, ...docSnap.data() } as Movie);
        });

        const localMovies = getLocalStorageMovies();
        let mergedMovies: Movie[] = [];

        if (loadedMovies.length > 0) {
          // Firestore is authoritative
          const localOnly = localMovies.filter(lm => !loadedMovies.some(m => m.id === lm.id));
          mergedMovies = mergeMovieCatalogs(loadedMovies, localOnly);
        } else {
          mergedMovies = mergeMovieCatalogs(INITIAL_MOVIES, localMovies);
        }

        if (mergedMovies.length > 0) {
          setMovies(mergedMovies);
          setFeaturedMovie(prev => {
            if (prev) {
              const updatedPrev = mergedMovies.find(m => m.id === prev.id);
              if (updatedPrev) return updatedPrev;
            }
            return mergedMovies.find(m => m.featured) || mergedMovies[0];
          });
        }
        setIsLoading(false);
      },
      (error: any) => {
        console.warn("Firestore movies subscription notice (using local catalog):", error?.message || error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Helper: Refresh movies from Firestore on demand
  const handleRefreshMovies = async () => {
    try {
      const moviesRef = collection(db, "movies");
      const q = query(moviesRef, limit(500));
      const snapshot = await getDocs(q);
      
      const loadedMovies: Movie[] = [];
      snapshot.forEach((docSnap) => {
        loadedMovies.push({ id: docSnap.id, ...docSnap.data() } as Movie);
      });

      const localMovies = getLocalStorageMovies();
      let mergedMovies: Movie[] = [];

      if (loadedMovies.length > 0) {
        const localOnly = localMovies.filter(lm => !loadedMovies.some(m => m.id === lm.id));
        mergedMovies = mergeMovieCatalogs(loadedMovies, localOnly);
      } else {
        mergedMovies = mergeMovieCatalogs(INITIAL_MOVIES, localMovies);
      }

      if (mergedMovies.length > 0) {
        setMovies(mergedMovies);
        const featured = mergedMovies.find((m) => m.featured) || mergedMovies[0];
        setFeaturedMovie(featured);
      }
      console.log("Movie catalog refreshed successfully.");
    } catch (err: any) {
      console.warn("Refresh movies notice (using current state):", err?.message || err);
    }
  };

  // 3. User Persistence (Cloud Synchronization and Local fallbacks)
  const loadUserCloudData = (firebaseUser: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }): () => void => {
    let innerUnsubscribe: (() => void) | null = null;
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const cleanEmail = firebaseUser.email?.trim().toLowerCase() || "";
      const isSuperAdminEmail = cleanEmail === "shahinkhan28qqqq@gmail.com" || 
                                 cleanEmail === "djskshahin544@gmail.com" || 
                                 cleanEmail === "shahinkhan28ddd@gmail.com" || 
                                 cleanEmail === "shahinkhan28r@gmail.com" || 
                                 cleanEmail === "shahinkhan28uu@gmail.com" || 
                                 cleanEmail === "admin@movieflix.com";

      // 1. Setup Real-time Listener (handles initial state too)
      innerUnsubscribe = onSnapshot(userDocRef, async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFavorites(data.favorites || []);
          setWatchHistory(data.watchHistory || []);

          let role = data.role || "user";
          if (isSuperAdminEmail) role = "admin";

          const isAdmin = role === "admin" || isSuperAdminEmail || data.isAdmin === true;
          const isModerator = role === "moderator" || data.isModerator === true;

          // Set profile in local React state
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || data.email,
            displayName: firebaseUser.displayName || data.displayName,
            photoURL: firebaseUser.photoURL || data.photoURL,
            role: role as UserRole,
            permissions: data.permissions || {},
            isAdmin: isAdmin,
            isModerator: isModerator,
          });
        } else {
          // Check if there is a pre-assigned role for this email
          let assignedRole = "user";
          let assignedPermissions = {};
          
          if (cleanEmail) {
            try {
              const { getDoc, doc } = await import("firebase/firestore");
              const roleRef = doc(db, "user_roles", cleanEmail);
              const roleSnap = await getDoc(roleRef);
              if (roleSnap.exists()) {
                const rData = roleSnap.data();
                assignedRole = rData.role || "user";
                assignedPermissions = rData.permissions || {};
              }
            } catch (err) {
              console.warn("Pre-assigned role check skipped:", err);
            }
          }

          // Create user if missing
          const initialDoc = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
            photoURL: firebaseUser.photoURL,
            role: isSuperAdminEmail ? "admin" : assignedRole,
            isAdmin: isSuperAdminEmail || assignedRole === "admin",
            isModerator: assignedRole === "moderator",
            permissions: assignedPermissions,
            favorites: [],
            watchHistory: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setDoc(userDocRef, initialDoc).catch(e => console.warn("Auto-create user failed:", e));
        }
      }, (error) => {
        console.warn("User listener error:", error);
      });

    } catch (e) {
      console.error("loadUserCloudData error:", e);
    }
    return () => {
      if (innerUnsubscribe) innerUnsubscribe();
    };
  };

  const loadLocalStorageData = () => {
    const localFavs = localStorage.getItem("movieflix_favs");
    const localHistory = localStorage.getItem("movieflix_history");
    if (localFavs) setFavorites(JSON.parse(localFavs));
    else setFavorites([]);
    if (localHistory) setWatchHistory(JSON.parse(localHistory));
    else setWatchHistory([]);
  };

  // Sync state modifications to both Cloud and Local
  const syncFavorites = async (updatedFavs: string[]) => {
    setFavorites(updatedFavs);
    localStorage.setItem("movieflix_favs", JSON.stringify(updatedFavs));
    
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { favorites: updatedFavs });
      } catch (err) {
        console.error("Cloud favorites sync failed:", err);
      }
    }
  };

  const syncWatchHistory = async (updatedHistory: WatchHistoryItem[]) => {
    setWatchHistory(updatedHistory);
    localStorage.setItem("movieflix_history", JSON.stringify(updatedHistory));

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { watchHistory: updatedHistory });
      } catch (err) {
        console.error("Cloud watch history sync failed:", err);
      }
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (movie: Movie) => {
    const isFav = favorites.includes(movie.id);
    let updated: string[];
    if (isFav) {
      updated = favorites.filter((id) => id !== movie.id);
    } else {
      updated = [...favorites, movie.id];
    }
    syncFavorites(updated);
  };

  // Play Movie trigger (updates history & count)
  const handlePlayMovie = async (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentView("watch");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Update local or remote views count
    try {
      const movieDocRef = doc(db, "movies", movie.id);
      await updateDoc(movieDocRef, { views: (movie.views || 0) + 1 });
    } catch (e) {
      // safe fallback
    }

    // Add/Update Watch History record
    const historyItem: WatchHistoryItem = {
      movieId: movie.id,
      watchedAt: new Date().toISOString(),
      progress: 0,
      duration: 0
    };

    const cleanHistory = watchHistory.filter((item) => item.movieId !== movie.id);
    const updatedHistory = [historyItem, ...cleanHistory].slice(0, 15); // limit to last 15 items
    syncWatchHistory(updatedHistory);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFavorites([]);
      setWatchHistory([]);
      localStorage.removeItem("movieflix_favs");
      localStorage.removeItem("movieflix_history");
      setCurrentView("home");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen text-white font-sans flex flex-col justify-between">
      {/* 1. Global Navigation Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
        onSignOut={handleSignOut}
        onShowLogin={() => setShowLogin(true)}
        favoritesCount={favorites.length}
        watchHistoryCount={watchHistory.length}
        movies={movies}
        themeSettings={themeSettings}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* 2. Primary Page Router View */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-screen w-full bg-neutral-950 flex flex-col items-center justify-center select-none"
            >
              <div className="flex items-center gap-1 text-red-600 font-extrabold text-3xl tracking-tighter mb-4 animate-pulse">
                <span>MOVIE</span>
                <span className="text-white bg-red-600 px-1.5 py-0.5 rounded text-xl font-black">FLIX</span>
              </div>
              <div className="animate-spin h-6 w-6 border-4 border-red-600 border-t-transparent rounded-full" />
              <p className="text-neutral-500 text-xs font-semibold mt-3">Connecting to Secure Cloud Streams...</p>
            </motion.div>
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {/* View Router Switch */}
              {currentView === "home" && (
                <Home
                  movies={movies}
                  featuredMovie={featuredMovie}
                  onPlay={handlePlayMovie}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                  watchHistory={watchHistory}
                />
              )}

              {currentView === "watch" && selectedMovie && (
                <Watch
                  movie={selectedMovie}
                  onBack={() => setCurrentView("home")}
                  onPlay={handlePlayMovie}
                  movies={movies}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}

              {currentView === "search" && (
                <Search
                  query={searchQuery}
                  movies={movies}
                  onPlay={handlePlayMovie}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                  onSelectSearchQuery={(q) => setSearchQuery(q)}
                />
              )}

              {currentView === "category" && selectedCategory && (
                <Search
                  query={selectedCategory}
                  movies={movies}
                  onPlay={handlePlayMovie}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                  onSelectSearchQuery={(q) => setSearchQuery(q)}
                />
              )}

              {currentView === "favorites" && (
                <div className="pt-24 pb-16 px-4 md:px-12 select-none min-h-screen">
                  <div className="max-w-7xl mx-auto space-y-8">
                    <div className="border-b border-neutral-900 pb-5">
                      <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                        <Heart className="text-red-600 h-5 w-5 fill-red-600" />
                        <span>My Streaming Playlist</span>
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1">
                        You have bookmarked {favorites.length} movie titles.
                      </p>
                    </div>

                    {favorites.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {movies
                          .filter((m) => favorites.includes(m.id))
                          .map((movie) => (
                            <div key={movie.id} className="flex justify-center">
                              <MovieCard
                                movie={movie}
                                onPlay={handlePlayMovie}
                                onToggleFavorite={handleToggleFavorite}
                                isFavorite={true}
                              />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-neutral-950 rounded-lg border border-neutral-900/60 max-w-xl mx-auto">
                        <Heart size={40} className="text-neutral-700 mx-auto mb-4" />
                        <h4 className="text-sm font-bold text-neutral-300">My List is Empty</h4>
                        <p className="text-xs text-neutral-600 max-w-xs mx-auto mt-1 leading-relaxed">
                          Hover over any movie cover and click the '+' sign to save it to your personal checklist.
                        </p>
                      </div>
                    )}

                    <div className="pt-8">
                      <AdSensePlaceholder type="banner" />
                    </div>
                  </div>
                </div>
              )}

              {currentView === "history" && (
                <div className="pt-24 pb-16 px-4 md:px-12 select-none min-h-screen">
                  <div className="max-w-7xl mx-auto space-y-8">
                    <div className="border-b border-neutral-900 pb-5">
                      <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                        <Clock className="text-red-600 h-5 w-5" />
                        <span>My Streaming History</span>
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1">
                        Showing your last {watchHistory.length} streamed movies.
                      </p>
                    </div>

                    {watchHistory.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {watchHistory
                          .map((item) => movies.find((m) => m.id === item.movieId))
                          .filter((m): m is Movie => !!m)
                          .map((movie) => (
                            <div key={movie.id} className="flex justify-center">
                              <MovieCard
                                movie={movie}
                                onPlay={handlePlayMovie}
                                onToggleFavorite={handleToggleFavorite}
                                isFavorite={favorites.includes(movie.id)}
                              />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-neutral-950 rounded-lg border border-neutral-900/60 max-w-xl mx-auto">
                        <Clock size={40} className="text-neutral-700 mx-auto mb-4" />
                        <h4 className="text-sm font-bold text-neutral-300">No Streaming History</h4>
                        <p className="text-xs text-neutral-600 max-w-xs mx-auto mt-1 leading-relaxed">
                          You haven't streamed any movies or trailers yet. Click 'Play Now' on the hero banner to begin.
                        </p>
                      </div>
                    )}

                    <div className="pt-8">
                      <AdSensePlaceholder type="banner" />
                    </div>
                  </div>
                </div>
              )}

              {currentView === "admin" && (
                <Admin movies={movies} onRefreshMovies={handleRefreshMovies} user={user} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Auto-Relaxed Recommendation Ad Unit */}
      <div className="px-4 md:px-12 py-8 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <AdSensePlaceholder type="autorelaxed" />
        </div>
      </div>

      {/* 3. Global Netflix-style Footer */}
      <Footer />

      {/* 4. Login Portal Overlay Frame */}
      {showLogin && (
        <Login
          onSuccess={() => {
            setShowLogin(false);
            handleRefreshMovies();
          }}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}
