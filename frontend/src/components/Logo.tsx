import React from "react";

const LOGO_URL = "https://ik.imagekit.io/zp0tch54w/PHANTOM-VISA/Gemini_Generated_Image_fjm238fjm238fjm2-removebg-preview%20(2)_p2j9SE6bD.png";
const FALLBACK_URL = "https://ik.imagekit.io/zp0tch54w/PHANTOM-VISA/Gemini_Generated_Image_fjm238fjm238fjm2-removebg-preview%20(2)_p2j9SE6bD.png";
const ICON_FALLBACK_URL = "https://ik.imagekit.io/zp0tch54w/PHANTOM-VISA/Gemini_Generated_Image_fjm238fjm238fjm2-removebg-preview%20(2)_p2j9SE6bD.png";

interface LogoProps {
  variant?: "full" | "header" | "icon" | "card" | "sidebar";
  className?: string;
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "full",
  className = "",
  size = "md",
  showSubtitle = true
}) => {
  const [activeLogo, setActiveLogo] = React.useState<string>(() => {
    try {
      return localStorage.getItem("phantom_custom_logo") || LOGO_URL;
    } catch {}
    return LOGO_URL;
  });

  const [activeIcon, setActiveIcon] = React.useState<string>(() => {
    try {
      return localStorage.getItem("phantom_custom_favicon") || localStorage.getItem("phantom_custom_logo") || "/favicon.png";
    } catch {}
    return "/favicon.png";
  });

  React.useEffect(() => {
    const handleUpdate = () => {
      try {
        const custom = localStorage.getItem("phantom_custom_logo");
        if (custom) setActiveLogo(custom);
        const customFav = localStorage.getItem("phantom_custom_favicon");
        if (customFav) setActiveIcon(customFav);
      } catch {}
    };
    window.addEventListener("phantom_logo_updated", handleUpdate);
    window.addEventListener("phantom_favicon_updated", handleUpdate);
    return () => {
      window.removeEventListener("phantom_logo_updated", handleUpdate);
      window.removeEventListener("phantom_favicon_updated", handleUpdate);
    };
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.src !== FALLBACK_URL) {
      target.src = FALLBACK_URL;
    }
  };

  const handleIconError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.src !== ICON_FALLBACK_URL) {
      target.src = ICON_FALLBACK_URL;
    }
  };

  if (variant === "icon") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img
          src={activeIcon}
          onError={handleIconError}
          alt="Phantom Forex Mart"
          className={`${size === "sm" ? "h-6" : size === "lg" ? "h-10" : "h-8"} w-auto object-contain filter drop-shadow-sm`}
        />
      </div>
    );
  }

  if (variant === "header") {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div className="bg-white/95 backdrop-blur px-2.5 py-1 flex items-center justify-center overflow-hidden">
          <img
            src={activeLogo}
            onError={handleImageError}
            alt="Phantom Forex Mart Pvt. Ltd."
            className="h-12 sm:h-12 w-auto object-contain"
          />
        </div>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="bg-white/95 backdrop-blur px-3 py-2 border border-brand-gold/30 flex items-center justify-center transition-all hover:border-brand-gold/60 overflow-hidden">
          <img
            src={activeLogo}
            onError={handleImageError}
            alt="Phantom Forex Mart Pvt. Ltd. - A one stop complete travel guide"
            className="h-10 max-h-12 w-auto object-contain"
          />
        </div>
        {showSubtitle && (
          <div className="flex items-center justify-between text-[8px] font-mono tracking-wider text-brand-gold/80 px-0.5 mt-0.5">
            <span>ENTERPRISE PORTAL</span>
            <span className="text-brand-teal font-semibold">VERIFIED ✓</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`bg-white p-3 rounded-xl shadow-lg border border-brand-gold/30 inline-flex flex-col items-center justify-center overflow-hidden ${className}`}>
        <img
          src={activeLogo}
          onError={handleImageError}
          alt="Phantom Forex Mart Pvt. Ltd."
          className="h-14 w-auto object-contain"
        />
      </div>
    );
  }

  // Default "full" display
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="p-2 rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={activeLogo}
          onError={handleImageError}
          alt="Phantom Forex Mart Pvt. Ltd."
          className="h-14 w-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Logo;
