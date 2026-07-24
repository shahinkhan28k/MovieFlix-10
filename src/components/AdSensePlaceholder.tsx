import React, { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface AdSensePlaceholderProps {
  type: "banner" | "sidebar" | "row" | "footer" | "in-article" | "autorelaxed";
  className?: string;
}

export default function AdSensePlaceholder({ type, className = "" }: AdSensePlaceholderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [adsConfig, setAdsConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // User's specific AdSense credentials
  const USER_ADSENSE_CLIENT = "ca-pub-5348967662326700";
  const USER_ADSENSE_SLOT_IN_ARTICLE = "7514986918";
  const USER_ADSENSE_SLOT_AUTORELAXED = "9651029817";

  // Load AdSense configuration from Firestore
  useEffect(() => {
    const docRef = doc(db, "settings", "adsense");
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setAdsConfig(docSnap.data());
        } else {
          // If Firestore is empty, we still want to enable ads if we have the client ID
          setAdsConfig({
            isEnabled: true,
            client: USER_ADSENSE_CLIENT,
            inArticleSlot: USER_ADSENSE_SLOT_IN_ARTICLE,
            autorelaxedSlot: USER_ADSENSE_SLOT_AUTORELAXED
          });
        }
        setIsLoading(false);
      },
      (error) => {
        console.warn("Could not load AdSense config from Firestore, using hardcoded defaults:", error);
        setAdsConfig({
          isEnabled: true,
          client: USER_ADSENSE_CLIENT,
          inArticleSlot: USER_ADSENSE_SLOT_IN_ARTICLE,
          autorelaxedSlot: USER_ADSENSE_SLOT_AUTORELAXED
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Dynamically load Google AdSense global script
  useEffect(() => {
    const client = adsConfig?.client || USER_ADSENSE_CLIENT;
    if (adsConfig?.isEnabled && client) {
      const existingScript = document.querySelector(`script[src*="adsbygoogle.js"]`);
      if (!existingScript) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
        script.crossOrigin = "anonymous";
        document.body.appendChild(script);
      }

      // Small delay to ensure the DOM elements for ads are rendered before pushing
      const timer = setTimeout(() => {
        try {
          const adsbygoogle = (window as any).adsbygoogle || [];
          adsbygoogle.push({});
        } catch (err) {
          console.debug("AdSense push notification notice:", err);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [adsConfig, type]); // Re-run when type changes to ensure each unit gets a push

  if (!isVisible) return null;

  // If ads are globally disabled in settings, hide the container
  if (adsConfig && adsConfig.isEnabled === false) {
    return null;
  }

  // Get active Slot ID based on ad type
  const getSlotId = () => {
    if (!adsConfig) return null;
    
    // Prioritize user's provided in-article slot if type is in-article
    if (type === "in-article") return adsConfig.inArticleSlot || USER_ADSENSE_SLOT_IN_ARTICLE;
    if (type === "autorelaxed") return adsConfig.autorelaxedSlot || USER_ADSENSE_SLOT_AUTORELAXED;

    switch (type) {
      case "banner":
        return adsConfig.bannerSlot || null;
      case "sidebar":
        return adsConfig.sidebarSlot || null;
      case "row":
        return adsConfig.rowSlot || null;
      case "footer":
        return adsConfig.footerSlot || null;
      default:
        return null;
    }
  };

  const slotId = getSlotId();
  const client = adsConfig?.client || USER_ADSENSE_CLIENT;

  // Get customized sponsor campaign content (fallback/override for ads)
  const getAdContent = () => {
    const defaults: Record<string, any> = {
      banner: {
        title: "Sponsor: Premium Cinema Setup 4K",
        desc: "Upgrade your home theatre with 40% Off on Dolby Atmos soundbars and OLED screens.",
        cta: "Shop Sale",
        url: "https://google.com/adsense",
        size: "w-full h-28 md:h-32",
      },
      sidebar: {
        title: "Stream Premium Unlimited",
        desc: "No latency, ultra-fast 10Gbps gaming and streaming fiber connection starting at $29/mo.",
        cta: "Check Availability",
        url: "https://google.com/adsense",
        size: "w-full md:w-64 h-80",
      },
      row: {
        title: "Special Offer: Try MovieFlix VR",
        desc: "Immerse yourself completely in the action with our brand new cinematic VR Headsets.",
        cta: "Experience VR",
        url: "https://google.com/adsense",
        size: "w-full h-36 md:h-44",
      },
      footer: {
        title: "Google AdSense Partner",
        desc: "Targeted, safe advertising optimized for your premium streaming audience. Learn how to monetize your site.",
        cta: "Get Started",
        url: "https://google.com/adsense",
        size: "w-full h-24",
      },
      "in-article": {
        title: "Premium Stream Partner",
        desc: "Get exclusive access to early releases and 4K ultra-HDR streams by supporting our verified partners.",
        cta: "Explore More",
        url: "https://google.com/adsense",
        size: "w-full min-h-[100px]",
      },
      "autorelaxed": {
        title: "Recommended for You",
        desc: "Discover more premium content and exclusive member-only streams recommended by our cinema community.",
        cta: "View Content",
        url: "https://google.com/adsense",
        size: "w-full min-h-[150px]",
      }
    };

    const typeDefault = defaults[type];

    // If custom ads are specified in settings, override the defaults
    if (adsConfig?.customAds?.[type]) {
      return {
        ...typeDefault,
        title: adsConfig.customAds[type].title || typeDefault.title,
        desc: adsConfig.customAds[type].desc || typeDefault.desc,
        cta: adsConfig.customAds[type].cta || typeDefault.cta,
        url: adsConfig.customAds[type].url || typeDefault.url,
      };
    }

    return typeDefault;
  };

  const ad = getAdContent();

  // Check if we should render actual Google AdSense tags
  const shouldRenderRealAd = adsConfig?.isEnabled && client && slotId;

  return (
    <div
      className={`relative bg-neutral-900 border border-neutral-800/80 rounded-lg p-4 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-neutral-700/60 shadow-lg ${ad.size} ${className}`}
    >
      {/* Ad Label */}
      <div className="absolute top-2 left-3 flex items-center gap-1.5 z-10">
        <span className="text-[9px] font-semibold text-amber-500 uppercase tracking-widest px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded">
          {shouldRenderRealAd ? "Sponsor Ad" : "Sponsored Ad"}
        </span>
        <span className="text-[9px] text-neutral-500 hover:text-neutral-400 cursor-help flex items-center gap-0.5">
          {shouldRenderRealAd ? "Google AdSense" : "Google AdSense Partner"}
        </span>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 p-1 text-neutral-500 hover:text-neutral-300 rounded-full hover:bg-neutral-800/80 transition-colors z-10"
        title="Dismiss Ad"
      >
        <X size={14} />
      </button>

      {/* Real AdSense Unit */}
      {shouldRenderRealAd ? (
        <div className="w-full h-full pt-6 flex items-center justify-center overflow-hidden">
          {type === "in-article" ? (
            <ins
              className="adsbygoogle"
              style={{ display: "block", textAlign: "center", width: "100%", height: "100%" }}
              data-ad-layout="in-article"
              data-ad-format="fluid"
              data-ad-client={client}
              data-ad-slot={slotId}
            />
          ) : type === "autorelaxed" ? (
            <ins
              className="adsbygoogle"
              style={{ display: "block", width: "100%", height: "100%" }}
              data-ad-format="autorelaxed"
              data-ad-client={client}
              data-ad-slot={slotId}
            />
          ) : (
            <ins
              className="adsbygoogle"
              style={{ display: "block", width: "100%", height: "100%" }}
              data-ad-client={client}
              data-ad-slot={slotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          )}
        </div>
      ) : (
        /* Custom Direct Campaign (Fallback & Sandbox display) */
        <>
          {/* Ad Graphics Background Accent */}
          <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-gradient-to-br from-amber-500/5 to-red-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Main Content Layout */}
          {type === "banner" || type === "footer" ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 h-full pt-4">
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-sm font-semibold text-neutral-200 truncate flex items-center gap-1">
                  {ad.title}
                  <ExternalLink size={12} className="text-neutral-500 inline" />
                </h4>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2 sm:line-clamp-1">
                  {ad.desc}
                </p>
              </div>
              <a
                href={ad.url}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-medium text-xs rounded transition-all shadow-md active:scale-95 hover:text-white"
              >
                {ad.cta}
              </a>
            </div>
          ) : type === "sidebar" ? (
            <div className="flex flex-col justify-between h-full pt-4">
              <div className="flex flex-col gap-2 mt-2">
                <h4 className="text-sm font-bold text-neutral-200 leading-tight">
                  {ad.title}
                </h4>
                <div className="w-full h-24 bg-neutral-950/80 rounded border border-neutral-800/50 flex items-center justify-center relative overflow-hidden">
                  <span className="text-[10px] text-neutral-600 font-mono tracking-widest">AD SPONSOR</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-amber-600/10 opacity-20 animate-pulse" />
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mt-1 line-clamp-3">
                  {ad.desc}
                </p>
              </div>
              <a
                href={ad.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold text-xs rounded transition-all mt-3 active:scale-95 hover:text-white"
              >
                {ad.cta}
              </a>
            </div>
          ) : (
            /* row ad */
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 h-full pt-4">
              <div className="flex gap-4 items-center">
                <div className="hidden sm:flex w-24 h-16 bg-neutral-950 rounded border border-neutral-800/80 items-center justify-center flex-shrink-0 text-neutral-600 text-xs font-mono">
                  Sponsor
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm md:text-base font-semibold text-neutral-200">
                    {ad.title}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                    {ad.desc}
                  </p>
                </div>
              </div>
              <a
                href={ad.url}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap px-5 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded transition-all active:scale-95 shadow-lg shadow-amber-500/10"
              >
                {ad.cta}
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
