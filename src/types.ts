export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
  year: number;
  duration: string;
  rating: string;
  featured: boolean;
  views: number;
  likes: number;
  createdAt: string;
  country?: string;
  language?: string;
  subCategory?: string;
  genres?: string[];
  tmdbId?: number | string;
  imdbId?: string;
  embedUrl?: string;
  downloadUrl?: string;
  isTV?: boolean;
  bannerUrl?: string;
}

export interface WatchHistoryItem {
  movieId: string;
  watchedAt: string;
  progress: number; // in seconds
  duration: number; // in seconds
}

export interface Comment {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export type UserRole = "admin" | "moderator" | "user";

export interface ModeratorPermissions {
  manageMovies?: boolean;     // Add/edit/delete movie catalog
  importMovies?: boolean;     // Access bulk importers (TMDB, OMDB, MovieBox, etc.)
  manageAds?: boolean;        // Access AdSense & Sponsor settings
  viewAnalytics?: boolean;    // Access site analytics dashboard
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: UserRole;
  permissions?: ModeratorPermissions;
  isAdmin?: boolean;
  isModerator?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type SiteThemeId = "netflix" | "cyberpunk" | "gold" | "emerald" | "purple" | "light";
export type SiteMode = "dark" | "light" | "auto";
export type ScreenLayoutMode = "standard" | "cinema" | "compact";

export interface ThemeSettings {
  themeId: SiteThemeId;
  siteThemeId?: SiteThemeId;
  mode: SiteMode;
  darkOn: boolean;
  isDarkOn?: boolean;
  accentColor: string; // "red" | "cyan" | "gold" | "emerald" | "purple" | "blue" | "rose"
  screenLayoutMode: ScreenLayoutMode;
  enableGlassmorphism: boolean;
  enableGlowEffects: boolean;
  allowUserThemeToggle: boolean;
  updatedAt?: string;
}

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  themeId: "netflix",
  siteThemeId: "netflix",
  mode: "dark",
  darkOn: true,
  isDarkOn: true,
  accentColor: "red",
  screenLayoutMode: "standard",
  enableGlassmorphism: true,
  enableGlowEffects: true,
  allowUserThemeToggle: true,
};

