import { useEffect } from "react";
import { useSiteContent } from "@/hooks/SiteContentContext";

/**
 * Loads saved theme colors and fonts on app startup.
 * This component renders nothing — it just applies CSS variables.
 */

const FONT_MAP: Record<string, { value: string; gfont: string }> = {
  playfair: { value: "'Playfair Display', Georgia, serif", gfont: "Playfair+Display:wght@400;500;600;700" },
  poppins: { value: "'Poppins', sans-serif", gfont: "Poppins:wght@400;500;600;700" },
  outfit: { value: "'Outfit', sans-serif", gfont: "Outfit:wght@400;500;600;700" },
  lora: { value: "'Lora', Georgia, serif", gfont: "Lora:wght@400;500;600;700" },
  merriweather: { value: "'Merriweather', Georgia, serif", gfont: "Merriweather:wght@400;700" },
  raleway: { value: "'Raleway', sans-serif", gfont: "Raleway:wght@400;500;600;700" },
  montserrat: { value: "'Montserrat', sans-serif", gfont: "Montserrat:wght@400;500;600;700" },
  crimson: { value: "'Crimson Pro', serif", gfont: "Crimson+Pro:wght@400;600;700" },
  inter: { value: "'Inter', system-ui, sans-serif", gfont: "Inter:wght@300;400;500;600;700" },
  roboto: { value: "'Roboto', sans-serif", gfont: "Roboto:wght@300;400;500;700" },
  cabin: { value: "'Cabin', sans-serif", gfont: "Cabin:wght@400;500;600;700" },
  nunito: { value: "'Nunito', sans-serif", gfont: "Nunito:wght@300;400;500;600;700" },
  "source-sans": { value: "'Source Sans 3', sans-serif", gfont: "Source+Sans+3:wght@300;400;500;600;700" },
  "dm-sans": { value: "'DM Sans', sans-serif", gfont: "DM+Sans:wght@300;400;500;600;700" },
  quicksand: { value: "'Quicksand', sans-serif", gfont: "Quicksand:wght@300;400;500;700" },
  lato: { value: "'Lato', sans-serif", gfont: "Lato:wght@300;400;700" },
};

function loadGoogleFont(gfont: string) {
  const id = `gfont-${gfont.replace(/[^a-z0-9]/gi, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${gfont}&display=swap`;
  document.head.appendChild(link);
}

export function ThemeLoader() {
  const { getContent, isLoading } = useSiteContent();

  useEffect(() => {
    if (isLoading) return;

    // Apply saved colors
    const savedColors = getContent("theme_colors", "");
    if (savedColors) {
      try {
        const colors = JSON.parse(savedColors);
        const root = document.documentElement;
        Object.entries(colors).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value as string);
        });
        // Update gradients
        if (colors.primary && colors.accent) {
          root.style.setProperty("--gradient-hero", `linear-gradient(135deg, hsl(${colors.primary}) 0%, hsl(${colors.accent}) 100%)`);
          root.style.setProperty("--gradient-gold", `linear-gradient(135deg, hsl(${colors.accent}) 0%, hsl(${colors.primary}) 100%)`);
        }
        if (colors.secondary) {
          root.style.setProperty("--gradient-navy", `linear-gradient(135deg, hsl(${colors.secondary}) 0%, hsl(${colors.secondary}) 100%)`);
        }
      } catch {}
    }

    // Apply saved heading font
    const headingFontId = getContent("theme_heading_font", "");
    if (headingFontId && FONT_MAP[headingFontId]) {
      const font = FONT_MAP[headingFontId];
      loadGoogleFont(font.gfont);
      document.documentElement.style.setProperty("--font-serif", font.value);
    }

    // Apply saved body font
    const bodyFontId = getContent("theme_body_font", "");
    if (bodyFontId && FONT_MAP[bodyFontId]) {
      const font = FONT_MAP[bodyFontId];
      loadGoogleFont(font.gfont);
      document.body.style.fontFamily = font.value;
      document.documentElement.style.setProperty("--font-sans", font.value);
    }
  }, [isLoading, getContent]);

  return null; // renders nothing
}
