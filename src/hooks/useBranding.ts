import { useState, useCallback } from "react";

export interface BrandingConfig {
  logoUrl: string | null;
  primaryColor: string;
}

// Theme color presets
export const THEME_PRESETS = [
  { name: "Amber", color: "#f59e0b" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Green", color: "#22c55e" },
  { name: "Purple", color: "#a855f7" },
  { name: "Red", color: "#ef4444" },
  { name: "Cyan", color: "#06b6d4" },
  { name: "Pink", color: "#ec4899" },
] as const;

const DEFAULT_COLOR = "#f59e0b";

export function useBranding() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>(DEFAULT_COLOR);

  const uploadLogo = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setLogoUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const removeLogo = useCallback(() => {
    setLogoUrl(null);
  }, []);

  const setThemeColor = useCallback((color: string) => {
    setPrimaryColor(color);
    // Apply to CSS variable
    document.documentElement.style.setProperty("--color-primary", color);
  }, []);

  const resetBranding = useCallback(() => {
    setLogoUrl(null);
    setPrimaryColor(DEFAULT_COLOR);
    document.documentElement.style.setProperty(
      "--color-primary",
      DEFAULT_COLOR
    );
  }, []);

  return {
    logoUrl,
    primaryColor,
    uploadLogo,
    removeLogo,
    setThemeColor,
    resetBranding,
  };
}
