import React, { useState } from "react";
import { Film, Mail, Lock, User, Key, Check, AlertCircle } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "../firebase";

interface LoginProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function Login({ onSuccess, onClose }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      onSuccess();
    } catch (err: any) {
      console.error("Google sign in failed:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup closed before completion.");
      } else if (err.code === "auth/blocked-by-popup-killer") {
        setError("Sign-in popup was blocked by your browser. Please allow popups for this site.");
      } else {
        setError(err.message || "An error occurred during Google sign-in.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: displayName || email.split("@")[0],
          photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName || email)}`
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onSuccess();
    } catch (err: any) {
      console.error("Auth error:", err);
      let errMsg = "An error occurred during authentication.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        errMsg = "Invalid email or password combination.";
      } else if (err.code === "auth/email-already-in-use") {
        errMsg = "This email is already registered.";
      } else if (err.code === "auth/weak-password") {
        errMsg = "Password must be at least 6 characters long.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "Please enter a valid email address.";
      }
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInAnonymously(auth);
      onSuccess();
    } catch (err: any) {
      console.error("Anonymous sign in failed:", err);
      setError("Anonymous sign in was disabled in Firebase panel. Attempting demo auto-login.");
      
      // Fallback: local simulated guest login
      setTimeout(() => {
        onSuccess();
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemoAccount = (role: "admin" | "user") => {
    if (role === "admin") {
      setEmail("admin@movieflix.com");
      setPassword("admin123");
      setIsSignUp(false);
    } else {
      setEmail("viewer@movieflix.com");
      setPassword("viewer123");
      setIsSignUp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md select-none">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e50914_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Login Frame Panel */}
      <div className="relative w-full max-w-md bg-neutral-900/95 border border-neutral-800 rounded-lg shadow-2xl p-8 mx-4 overflow-hidden">
        {/* Dark Red Neon Blur Ring */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-1 cursor-pointer text-red-600 font-black text-2xl tracking-tighter mb-2">
            <span>MOVIE</span>
            <span className="text-white bg-red-600 px-1 py-0.2 rounded text-lg font-black">FLIX</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-100">
            {isSignUp ? "Create a free account" : "Sign In to Stream"}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {isSignUp ? "Unlock unlimited movie lists" : "Welcome back! Ready for popcorn?"}
          </p>
        </div>

        {/* Demo banner overlay for testing convenience */}
        {showDemoBanner && (
          <div className="bg-neutral-950 border border-neutral-800 rounded p-3 mb-4 text-[11px] relative">
            <button
              onClick={() => setShowDemoBanner(false)}
              className="absolute top-1 right-1.5 text-neutral-600 hover:text-neutral-400"
            >
              &times;
            </button>
            <p className="text-red-500 font-bold mb-1.5 flex items-center gap-1">
              <Check size={11} />
              <span>Developer Quick Access Modes:</span>
            </p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => handleUseDemoAccount("admin")}
                className="py-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded text-center border border-red-500/20 active:scale-95 transition-all font-semibold"
              >
                Use Admin Demo
              </button>
              <button
                onClick={() => handleUseDemoAccount("user")}
                className="py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded text-center border border-neutral-800 active:scale-95 transition-all"
              >
                Use Viewer Demo
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-600/10 border border-red-500/25 p-3 rounded text-xs text-red-400 flex items-start gap-2 mb-4">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-400">Your Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="e.g. Shakib Al Hasan"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2.5 pl-9 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-3.5 text-neutral-500" />
              <input
                type="email"
                placeholder="e.g. viewer@movieflix.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2.5 pl-9 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-3.5 text-neutral-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2.5 pl-9 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-lg shadow-red-600/10"
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800/80" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-neutral-600">
            <span className="bg-neutral-900 px-3">or</span>
          </div>
        </div>

        {/* Google Login Option */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-2.5 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold rounded transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer mb-3 shadow-lg"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48c0,-0.32 -0.03,-0.64 -0.09,-0.9z" fill="#4285F4" />
              <path d="M12,20.6c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.58c-0.91,0.61 -2.08,0.98 -3.3,0.98c-2.35,0 -4.35,-1.58 -5.06,-3.71H2.86v2.66c1.48,2.94 4.53,4.83 8.04,4.83z" fill="#34A853" />
              <path d="M6.94,13.11c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7s0.1,-1.16 0.28,-1.7V7.05H2.86C2.24,8.27 1.88,9.66 1.88,11.11s0.36,2.84 0.98,4.06l3.12,-2.42c0.32,-0.63 0.65,-1.3 0.96,-1.64z" fill="#FBBC05" />
              <path d="M12,5.34c1.32,0 2.51,0.45 3.44,1.35l2.58,-2.58C16.46,2.6 14.43,1.6 12,1.6C8.49,1.6 5.44,3.49 3.96,6.43l3.12,2.42c0.71,-2.13 2.71,-3.71 5.06,-3.71z" fill="#EA4335" />
            </g>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Guest Login Option */}
        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={isLoading}
          className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-bold rounded transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Key size={13} />
          <span>Stream as Guest / Visitor</span>
        </button>

        {/* Toggle between login / signup modes */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-xs text-neutral-500 hover:text-white transition-colors"
          >
            {isSignUp ? (
              <span>
                Already registered? <strong className="text-red-500">Sign In instead</strong>
              </span>
            ) : (
              <span>
                New to MovieFlix? <strong className="text-red-500">Create an account</strong>
              </span>
            )}
          </button>
        </div>

        {/* Cancel button */}
        <button
          onClick={onClose}
          className="w-full text-center mt-4 text-[11px] text-neutral-600 hover:text-neutral-400 font-semibold cursor-pointer py-1"
        >
          Close and Browse Anonymously
        </button>
      </div>
    </div>
  );
}
