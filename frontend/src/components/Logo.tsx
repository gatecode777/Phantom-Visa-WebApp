import React from "react";

const LOGO_URL = "https://ik.imagekit.io/zp0tch54w/PHANTOM-VISA/Gemini_Generated_Image_fjm238fjm238fjm2-removebg-preview%20(2).png";
const FALLBACK_URL = "https://ik.imagekit.io/zp0tch54w/PHANTOM-VISA/Gemini_Generated_Image_fjm238fjm238fjm2-removebg-preview%20(2).png";
const ICON_FALLBACK_URL = "https://ik.imagekit.io/zp0tch54w/PHANTOM-VISA/Gemini_Generated_Image_kei20nkei20nkei2-removebg-preview.png";

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
          src="/logo-icon.png"
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
        <div className="bg-white/95 backdrop-blur px-2.5 py-1 rounded-md shadow-sm border border-brand-gold/30 flex items-center justify-center overflow-hidden">
          <img
            src={LOGO_URL}
            onError={handleImageError}
            alt="Phantom Forex Mart Pvt. Ltd."
            className="h-7 sm:h-8 w-auto object-contain"
          />
        </div>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <div className="bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow-md border border-brand-gold/30 flex items-center justify-center transition-all hover:border-brand-gold/60 overflow-hidden">
          <img
            src={LOGO_URL}
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
          src={LOGO_URL}
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
      <div className="bg-white p-2 rounded-lg shadow-md border border-brand-gold/30 flex items-center justify-center overflow-hidden">
        <img
          src={LOGO_URL}
          onError={handleImageError}
          alt="Phantom Forex Mart Pvt. Ltd."
          className="h-10 w-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Logo;
