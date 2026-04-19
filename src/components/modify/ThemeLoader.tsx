import { useEffect } from "react";
import { useSiteContent } from "@/hooks/SiteContentContext";

/**
 * Applies optional heading/body fonts from site settings.
 * Theme colors always come from index.css; clears stale inline --* vars from older ThemeCustomizer sessions.
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

/** Inline theme vars from the admin ThemeCustomizer override :root in index.css — clear so bundled palette wins. */
const INJECTED_THEME_VAR_KEYS = [
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "accent",
  "accent-foreground",
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "muted",
  "muted-foreground",
  "border",
  "input",
  "ring",
  "destructive",
  "destructive-foreground",
  "gradient-hero",
  "gradient-gold",
  "gradient-navy",
];

function clearInjectedThemeVariables() {
  const root = document.documentElement;
  INJECTED_THEME_VAR_KEYS.forEach((key) => root.style.removeProperty(`--${key}`));
}

export function ThemeLoader() {
  const { getContent, isLoading } = useSiteContent();

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";

    if (isLoading) return;

    // Colors come from index.css only (API theme_colors was overriding local/neutral tokens).
    clearInjectedThemeVariables();

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
