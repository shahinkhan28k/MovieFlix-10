import React, { useState, useEffect, useMemo } from "react";
import { Search, Bell, Menu, X, LogIn, LogOut, Film, User, Heart, Clock, LayoutDashboard, ChevronDown, Shield, ShieldCheck, Sun, Moon, Trash2, History } from "lucide-react";
import { UserProfile, Movie, ThemeSettings } from "../types";
import { CATEGORIES } from "../data/mockMovies";

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user: UserProfile | null;
  onSignOut: () => Promise<void>;
  onShowLogin: () => void;
  favoritesCount: number;
  watchHistoryCount: number;
  movies?: Movie[];
  themeSettings?: ThemeSettings;
  onToggleDarkMode?: () => void;
}

export default function Navbar({
  currentView,
  setCurrentView,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  user,
  onSignOut,
  onShowLogin,
  favoritesCount,
  watchHistoryCount,
  movies = [],
  themeSettings,
  onToggleDarkMode,
}: NavbarProps) {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  // Persistent Search History in LocalStorage
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("movieflix_search_history");
      return saved ? JSON.parse(saved) : ["Bad Boys", "Action", "Classic Movies", "Bangla Natok"];
    } catch {
      return ["Bad Boys", "Action", "Classic Movies", "Bangla Natok"];
    }
  });

  const saveSearchTerm = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 10);
      try {
        localStorage.setItem("movieflix_search_history", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const removeSearchHistoryItem = (e: React.MouseEvent, itemToRemove: string) => {
    e.stopPropagation();
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item !== itemToRemove);
      try {
        localStorage.setItem("movieflix_search_history", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearAllSearchHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory([]);
    try {
      localStorage.removeItem("movieflix_search_history");
    } catch (e) {}
  };

  const handleSelectHistoryItem = (term: string) => {
    setSearchQuery(term);
    saveSearchTerm(term);
    setCurrentView("search");
    setShowSearchHistory(false);
  };

  // Dynamically compute active categories from existing movies to include TV Series, Bangla Natok, Web Series, K-Drama, etc.
  const dynamicCategories = useMemo(() => {
    if (!movies || movies.length === 0) return CATEGORIES;
    const catsSet = new Set<string>(CATEGORIES);
    movies.forEach(m => {
      if (m.category) catsSet.add(m.category);
      if (m.subCategory) catsSet.add(m.subCategory);
    });
    return Array.from(catsSet).filter(Boolean);
  }, [movies]);

  // Monitor scroll to apply solid background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    setCurrentView("home");
    setSelectedCategory(null);
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentView("category");
    setIsCategoriesDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (currentView !== "search") {
      setCurrentView("search");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 select-none ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md shadow-xl border-b border-neutral-900/40 py-3"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Main Navigation Links */}
        <div className="flex items-center gap-8">
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-1.5 cursor-pointer text-red-600 font-extrabold text-2xl md:text-3xl tracking-tighter select-none transform transition hover:scale-105 active:scale-95"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
          >
            <span>MOVIE</span>
            <span className="text-white bg-red-600 px-1.5 py-0.5 rounded text-lg md:text-xl font-black">FLIX</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
            <button
              onClick={() => {
                setCurrentView("home");
                setSelectedCategory(null);
              }}
              className={`hover:text-white transition-colors cursor-pointer ${
                currentView === "home" && !selectedCategory ? "text-white font-semibold" : ""
              }`}
            >
              Home
            </button>

            {/* Categories Dropdown (Multi-column Mega Menu Layout) */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                className={`hover:text-white flex items-center gap-1 transition-colors cursor-pointer py-1 px-2 rounded-md ${
                  currentView === "category" || isCategoriesDropdownOpen ? "text-white font-semibold bg-neutral-900/80" : ""
                }`}
              >
                <span>Categories</span>
                <ChevronDown size={14} className={`transform transition-transform duration-300 ${isCategoriesDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isCategoriesDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCategoriesDropdownOpen(false)}
                  />
                  <div
                    className="absolute left-0 sm:left-1/2 sm:-translate-x-1/3 md:-translate-x-1/4 mt-2 w-[320px] sm:w-[580px] md:w-[700px] lg:w-[820px] bg-neutral-950/95 backdrop-blur-2xl border border-neutral-800/90 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in text-xs max-h-[380px] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-neutral-800/80">
                      <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Film size={15} className="text-red-500" />
                        <span>All Categories & Genres ({dynamicCategories.length})</span>
                      </span>
                      <button
                        onClick={() => setIsCategoriesDropdownOpen(false)}
                        className="text-neutral-500 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
                        title="Close"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {dynamicCategories.map((category) => {
                        const count = movies ? movies.filter(m => m.category === category || m.subCategory === category).length : 0;
                        const isSelected = selectedCategory === category;
                        return (
                          <button
                            key={category}
                            onClick={() => handleCategorySelect(category)}
                            className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-between gap-1 group ${
                              isSelected
                                ? "bg-red-600 text-white font-bold shadow-lg shadow-red-600/30 scale-[1.02]"
                                : "bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800/80 hover:border-neutral-700"
                            }`}
                          >
                            <span className="truncate">{category}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors flex-shrink-0 ${
                                isSelected
                                  ? "bg-red-800 text-white"
                                  : "bg-neutral-800/90 group-hover:bg-neutral-700 text-neutral-400 group-hover:text-white"
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setCurrentView("favorites")}
              className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${
                currentView === "favorites" ? "text-white font-semibold" : ""
              }`}
            >
              <span>My List</span>
              {favoritesCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView("history")}
              className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${
                currentView === "history" ? "text-white font-semibold" : ""
              }`}
            >
              <span>History</span>
              {watchHistoryCount > 0 && (
                <span className="bg-neutral-800 text-neutral-300 text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-semibold">
                  {watchHistoryCount}
                </span>
              )}
            </button>

            {/* Admin / Moderator Dashboard */}
            <button
              onClick={() => setCurrentView("admin")}
              className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border rounded text-xs font-medium ${
                currentView === "admin" 
                  ? "text-white border-neutral-700 bg-neutral-800" 
                  : user?.role === "admin" || user?.isAdmin
                  ? "text-red-400 border-red-900/60 bg-red-950/20"
                  : user?.role === "moderator" || user?.isModerator
                  ? "text-purple-400 border-purple-900/60 bg-purple-950/20"
                  : "text-neutral-400 border-neutral-800/80"
              }`}
            >
              {user?.role === "admin" || user?.isAdmin ? (
                <>
                  <Shield size={14} className="text-red-500 flex-shrink-0" />
                  <span>Admin Panel</span>
                </>
              ) : user?.role === "moderator" || user?.isModerator ? (
                <>
                  <ShieldCheck size={14} className="text-purple-400 flex-shrink-0" />
                  <span>Moderator Panel</span>
                </>
              ) : (
                <>
                  <LayoutDashboard size={14} className="flex-shrink-0" />
                  <span>Admin</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar with History Dropdown */}
          <div className="relative flex items-center">
            <div
              className={`flex items-center bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 transition-all duration-300 ${
                isSearchExpanded || searchQuery ? "w-48 sm:w-72 opacity-100" : "w-0 opacity-0 md:opacity-100 md:w-48 border-transparent bg-transparent"
              }`}
            >
              <Search size={16} className="text-neutral-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Titles, people, genres..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  setIsSearchExpanded(true);
                  setShowSearchHistory(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    saveSearchTerm(searchQuery);
                    setCurrentView("search");
                    setShowSearchHistory(false);
                  }
                }}
                className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder-neutral-500 p-0 focus:ring-0 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    saveSearchTerm(searchQuery);
                    setSearchQuery("");
                    setCurrentView("home");
                    setShowSearchHistory(false);
                  }}
                  className="text-neutral-500 hover:text-neutral-300 flex-shrink-0 ml-1 p-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Search History Dropdown */}
            {showSearchHistory && searchHistory.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSearchHistory(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-64 sm:w-80 bg-neutral-950/95 backdrop-blur-2xl border border-neutral-800 rounded-2xl shadow-2xl p-3 z-50 text-xs animate-fade-in">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80">
                    <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock size={13} className="text-red-500" />
                      <span>Search History</span>
                    </span>
                    <button
                      onClick={clearAllSearchHistory}
                      className="text-[10px] text-neutral-500 hover:text-red-400 font-semibold transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={11} />
                      <span>Clear All</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                    {searchHistory.map((term, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectHistoryItem(term)}
                        className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white px-2.5 py-1 rounded-full border border-neutral-800 hover:border-neutral-700 cursor-pointer text-xs transition-all group"
                      >
                        <Clock size={11} className="text-neutral-500 group-hover:text-red-400" />
                        <span className="truncate max-w-[130px] font-medium">{term}</span>
                        <button
                          onClick={(e) => removeSearchHistoryItem(e, term)}
                          className="text-neutral-500 hover:text-red-400 ml-0.5 p-0.5 rounded-full hover:bg-neutral-700/50"
                          title="Remove from history"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!(isSearchExpanded || searchQuery) && (
              <button
                onClick={() => {
                  setIsSearchExpanded(true);
                  setShowSearchHistory(true);
                }}
                className="p-2 text-neutral-300 hover:text-white transition-colors md:hidden"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            )}
          </div>

          {/* Theme Mode Switcher Toggle Button */}
          {onToggleDarkMode && (themeSettings?.allowUserThemeToggle !== false) && (
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800/60 rounded-full transition-all cursor-pointer"
              title={(themeSettings?.darkOn ?? themeSettings?.isDarkOn ?? true) ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme Mode"
            >
              {(themeSettings?.darkOn ?? themeSettings?.isDarkOn ?? true) ? (
                <Sun size={18} className="text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon size={18} className="text-indigo-400 hover:-rotate-12 transition-transform" />
              )}
            </button>
          )}

          {/* User Account / Login State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 250)}
                className="flex items-center gap-1.5 focus:outline-none"
                aria-label="User Profile Dropdown"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Profile"}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded border border-neutral-800 shadow-md flex-shrink-0 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center font-bold border border-red-500/30 text-sm flex-shrink-0">
                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <ChevronDown size={12} className="text-neutral-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-neutral-950 border border-neutral-800 rounded shadow-2xl py-2 z-50 animate-fade-in text-xs">
                  <div className="px-4 py-2 border-b border-neutral-900 text-neutral-300">
                    <p className="font-semibold text-neutral-100 truncate">
                      {user.displayName || "Authorized User"}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate mt-0.5">{user.email}</p>
                    {user.isAdmin && (
                      <span className="inline-block bg-red-600/10 text-red-500 text-[9px] font-bold px-1.5 py-0.5 rounded border border-red-500/20 mt-1.5">
                        Admin Account
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentView("favorites");
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors flex items-center gap-2"
                  >
                    <Heart size={14} className="text-red-500" />
                    <span>My List ({favoritesCount})</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView("history");
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors flex items-center gap-2"
                  >
                    <Clock size={14} className="text-neutral-400" />
                    <span>Watch History ({watchHistoryCount})</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView("admin");
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-900/60"
                  >
                    <LayoutDashboard size={14} className="text-neutral-400" />
                    <span>Admin Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      onSignOut();
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-neutral-900 transition-colors flex items-center gap-2 border-t border-neutral-900/80"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onShowLogin}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-all active:scale-95 shadow-lg shadow-red-600/20"
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white transition-colors md:hidden focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-950 border-b border-neutral-900 py-4 px-4 space-y-3 shadow-2xl animate-slide-down">
          <div className="grid grid-cols-2 gap-2 text-sm text-neutral-300">
            <button
              onClick={() => {
                setCurrentView("home");
                setSelectedCategory(null);
                setIsMobileMenuOpen(false);
              }}
              className={`text-left p-2 rounded hover:bg-neutral-900 hover:text-white ${
                currentView === "home" && !selectedCategory ? "text-white font-bold bg-neutral-900" : ""
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView("favorites");
                setIsMobileMenuOpen(false);
              }}
              className={`text-left p-2 rounded hover:bg-neutral-900 hover:text-white flex items-center justify-between ${
                currentView === "favorites" ? "text-white font-bold bg-neutral-900" : ""
              }`}
            >
              <span>My List</span>
              {favoritesCount > 0 && <span className="bg-red-600 text-white text-[10px] px-1.5 rounded-full font-bold">{favoritesCount}</span>}
            </button>
            <button
              onClick={() => {
                setCurrentView("history");
                setIsMobileMenuOpen(false);
              }}
              className={`text-left p-2 rounded hover:bg-neutral-900 hover:text-white flex items-center justify-between ${
                currentView === "history" ? "text-white font-bold bg-neutral-900" : ""
              }`}
            >
              <span>History</span>
              {watchHistoryCount > 0 && <span className="bg-neutral-800 text-neutral-300 text-[10px] px-1.5 rounded-full font-semibold">{watchHistoryCount}</span>}
            </button>
            <button
              onClick={() => {
                setCurrentView("admin");
                setIsMobileMenuOpen(false);
              }}
              className={`text-left p-2 rounded hover:bg-neutral-900 hover:text-white flex items-center gap-1.5 ${
                currentView === "admin" ? "text-white font-bold bg-neutral-900" : ""
              }`}
            >
              <LayoutDashboard size={14} />
              <span>Admin</span>
            </button>
          </div>

          {/* Categories Grid inside mobile menu */}
          <div className="border-t border-neutral-900 pt-3">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 px-2">Categories</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-neutral-400">
              {dynamicCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`text-left p-2 rounded hover:bg-neutral-900 hover:text-white ${
                    selectedCategory === category ? "text-red-500 font-bold bg-neutral-900" : ""
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
