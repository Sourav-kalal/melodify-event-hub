import { useState, useEffect, useRef } from "react";
import { useSiteContent } from "@/hooks/SiteContentContext";
import { useAuth } from "@/hooks/useAuth";
import { Palette, Type, RotateCcw, Check, ChevronDown, ChevronUp, Image as ImageIcon, Upload, X, Loader2, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ── Pre-built theme presets ──────────────────────────────────────
const THEME_PRESETS = [
  {
    id: "default",
    name: "Saffron & Navy",
    description: "Warm, elegant & creative",
    colors: {
      primary: "32 95% 44%",
      "primary-foreground": "0 0% 100%",
      secondary: "222 47% 20%",
      "secondary-foreground": "40 33% 98%",
      accent: "43 96% 56%",
      "accent-foreground": "222 47% 11%",
      background: "40 33% 98%",
      foreground: "222 47% 11%",
      card: "0 0% 100%",
      "card-foreground": "222 47% 11%",
      muted: "40 20% 94%",
      "muted-foreground": "222 15% 45%",
      border: "40 20% 88%",
    },
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    description: "Rich, luxurious & modern",
    colors: {
      primary: "262 80% 50%",
      "primary-foreground": "0 0% 100%",
      secondary: "262 40% 15%",
      "secondary-foreground": "262 20% 95%",
      accent: "280 70% 60%",
      "accent-foreground": "0 0% 100%",
      background: "262 15% 97%",
      foreground: "262 40% 10%",
      card: "0 0% 100%",
      "card-foreground": "262 40% 10%",
      muted: "262 15% 93%",
      "muted-foreground": "262 10% 45%",
      border: "262 15% 88%",
    },
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "Fresh, calm & professional",
    colors: {
      primary: "210 90% 45%",
      "primary-foreground": "0 0% 100%",
      secondary: "210 50% 15%",
      "secondary-foreground": "210 20% 95%",
      accent: "190 80% 50%",
      "accent-foreground": "210 50% 10%",
      background: "210 20% 98%",
      foreground: "210 50% 10%",
      card: "0 0% 100%",
      "card-foreground": "210 50% 10%",
      muted: "210 15% 94%",
      "muted-foreground": "210 10% 45%",
      border: "210 15% 88%",
    },
  },
  {
    id: "forest-bloom",
    name: "Forest Bloom",
    description: "Deep, natural & grounded",
    colors: {
      primary: "160 84% 25%",
      "primary-foreground": "0 0% 100%",
      secondary: "160 40% 8%",
      "secondary-foreground": "160 20% 95%",
      accent: "142 70% 45%",
      "accent-foreground": "0 0% 100%",
      background: "160 20% 98%",
      foreground: "160 40% 10%",
      card: "0 0% 100%",
      "card-foreground": "160 40% 10%",
      muted: "160 15% 94%",
      "muted-foreground": "160 10% 45%",
      border: "160 15% 88%",
    },
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    description: "Vibrant, energetic & warm",
    colors: {
      primary: "15 90% 55%",
      "primary-foreground": "0 0% 100%",
      secondary: "260 40% 15%",
      "secondary-foreground": "15 20% 95%",
      accent: "38 95% 55%",
      "accent-foreground": "0 0% 100%",
      background: "15 20% 98%",
      foreground: "260 40% 10%",
      card: "0 0% 100%",
      "card-foreground": "260 40% 10%",
      muted: "15 15% 94%",
      "muted-foreground": "260 10% 45%",
      border: "15 15% 88%",
    },
  },
  {
    id: "modern-slate",
    name: "Modern Slate",
    description: "Minimal, cool & precise",
    colors: {
      primary: "215 25% 27%",
      "primary-foreground": "0 0% 100%",
      secondary: "222 47% 11%",
      "secondary-foreground": "210 40% 98%",
      accent: "199 89% 48%",
      "accent-foreground": "0 0% 100%",
      background: "210 40% 98%",
      foreground: "222 47% 11%",
      card: "0 0% 100%",
      "card-foreground": "222 47% 11%",
      muted: "210 15% 92%",
      "muted-foreground": "215 16% 47%",
      border: "214 32% 91%",
    },
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    description: "Soft, romantic & premium",
    colors: {
      primary: "346 70% 55%",
      "primary-foreground": "0 0% 100%",
      secondary: "340 30% 18%",
      "secondary-foreground": "340 15% 95%",
      accent: "25 80% 60%",
      "accent-foreground": "340 30% 10%",
      background: "340 20% 98%",
      foreground: "340 30% 10%",
      card: "0 0% 100%",
      "card-foreground": "340 30% 10%",
      muted: "340 15% 94%",
      "muted-foreground": "340 10% 45%",
      border: "340 15% 88%",
    },
  },
  {
    id: "midnight-dark",
    name: "Midnight Dark",
    description: "Sleek, modern & dark mode",
    colors: {
      primary: "32 95% 50%",
      "primary-foreground": "222 47% 11%",
      secondary: "222 35% 25%",
      "secondary-foreground": "40 33% 96%",
      accent: "43 96% 56%",
      "accent-foreground": "222 47% 11%",
      background: "222 47% 8%",
      foreground: "40 33% 96%",
      card: "222 47% 11%",
      "card-foreground": "40 33% 96%",
      muted: "222 35% 18%",
      "muted-foreground": "40 20% 65%",
      border: "222 35% 20%",
    },
  },
];

// ── Font options ─────────────────────────────────────────────────
const FONT_OPTIONS = {
  heading: [
    { id: "playfair", name: "Playfair Display", value: "'Playfair Display', Georgia, serif", gfont: "Playfair+Display:wght@400;500;600;700" },
    { id: "poppins", name: "Poppins", value: "'Poppins', sans-serif", gfont: "Poppins:wght@400;500;600;700" },
    { id: "outfit", name: "Outfit", value: "'Outfit', sans-serif", gfont: "Outfit:wght@400;500;600;700" },
    { id: "lora", name: "Lora", value: "'Lora', Georgia, serif", gfont: "Lora:wght@400;500;600;700" },
    { id: "merriweather", name: "Merriweather", value: "'Merriweather', Georgia, serif", gfont: "Merriweather:wght@400;700" },
    { id: "raleway", name: "Raleway", value: "'Raleway', sans-serif", gfont: "Raleway:wght@400;500;600;700" },
    { id: "montserrat", name: "Montserrat", value: "'Montserrat', sans-serif", gfont: "Montserrat:wght@400;500;600;700" },
    { id: "crimson", name: "Crimson Pro", value: "'Crimson Pro', serif", gfont: "Crimson+Pro:wght@400;600;700" },
  ],
  body: [
    { id: "inter", name: "Inter", value: "'Inter', system-ui, sans-serif", gfont: "Inter:wght@300;400;500;600;700" },
    { id: "roboto", name: "Roboto", value: "'Roboto', sans-serif", gfont: "Roboto:wght@300;400;500;700" },
    { id: "cabin", name: "Cabin", value: "'Cabin', sans-serif", gfont: "Cabin:wght@400;500;600;700" },
    { id: "nunito", name: "Nunito", value: "'Nunito', sans-serif", gfont: "Nunito:wght@300;400;500;600;700" },
    { id: "source-sans", name: "Source Sans 3", value: "'Source Sans 3', sans-serif", gfont: "Source+Sans+3:wght@300;400;500;600;700" },
    { id: "dm-sans", name: "DM Sans", value: "'DM Sans', sans-serif", gfont: "DM+Sans:wght@300;400;500;600;700" },
    { id: "quicksand", name: "Quicksand", value: "'Quicksand', sans-serif", gfont: "Quicksand:wght@300;400;500;700" },
    { id: "lato", name: "Lato", value: "'Lato', sans-serif", gfont: "Lato:wght@300;400;700" },
  ],
};

// ── Helper: Load Google Font ─────────────────────────────────────
function loadGoogleFont(gfont: string) {
  const id = `gfont-${gfont.replace(/[^a-z0-9]/gi, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${gfont}&display=swap`;
  document.head.appendChild(link);
}

// ── Helper: HSL to hex ───────────────────────────────────────────
function hslToHex(hsl: string): string {
  const parts = hsl.split(" ").map((s) => parseFloat(s));
  if (parts.length < 3) return "#888888";
  const [h, s, l] = parts;
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0 0% 50%";
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// ── Main Component ───────────────────────────────────────────────
export function ThemeCustomizer() {
  const { getContent, updateContent, isSaving } = useSiteContent();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const [activeTheme, setActiveTheme] = useState<string>("");
  const [activeHeadingFont, setActiveHeadingFont] = useState<string>("");
  const [activeBodyFont, setActiveBodyFont] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Logo settings
  const logoUrl = getContent("site_logo_url", "");
  const logoType = getContent("site_logo_type", "icon"); // "icon" or "image"

  // Load saved values on mount
  useEffect(() => {
    setActiveTheme(getContent("theme_preset", "default"));
    setActiveHeadingFont(getContent("theme_heading_font", "playfair"));
    setActiveBodyFont(getContent("theme_body_font", "inter"));

    // Apply saved theme on load
    const savedColors = getContent("theme_colors", "");
    if (savedColors) {
      try {
        const colors = JSON.parse(savedColors);
        applyColors(colors);
      } catch {}
    }

    // Apply saved fonts on load
    const savedHeadingFont = getContent("theme_heading_font", "playfair");
    const savedBodyFont = getContent("theme_body_font", "inter");
    applyFont("heading", savedHeadingFont);
    applyFont("body", savedBodyFont);
  }, [getContent]);

  const applyColors = (colors: Record<string, string>) => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    // Also update gradients
    if (colors.primary && colors.accent) {
      root.style.setProperty("--gradient-hero", `linear-gradient(135deg, hsl(${colors.primary}) 0%, hsl(${colors.accent}) 100%)`);
      root.style.setProperty("--gradient-gold", `linear-gradient(135deg, hsl(${colors.accent}) 0%, hsl(${colors.primary}) 100%)`);
    }
    if (colors.secondary) {
      root.style.setProperty("--gradient-navy", `linear-gradient(135deg, hsl(${colors.secondary}) 0%, hsl(${colors.secondary.replace(/\d+%$/, (m) => parseInt(m) + 10 + "%")}) 100%)`);
    }
  };

  const applyFont = (type: "heading" | "body", fontId: string) => {
    const fontList = type === "heading" ? FONT_OPTIONS.heading : FONT_OPTIONS.body;
    const font = fontList.find((f) => f.id === fontId);
    if (!font) return;

    loadGoogleFont(font.gfont);
    const root = document.documentElement;
    if (type === "heading") {
      root.style.setProperty("--font-serif", font.value);
      document.querySelectorAll("h1,h2,h3,h4,h5,h6,.font-serif").forEach((el) => {
        (el as HTMLElement).style.fontFamily = font.value;
      });
    } else {
      root.style.setProperty("--font-sans", font.value);
      document.body.style.fontFamily = font.value;
    }
  };

  const handleSelectTheme = async (preset: typeof THEME_PRESETS[0]) => {
    setActiveTheme(preset.id);
    applyColors(preset.colors);
    await updateContent("theme_preset", preset.id);
    await updateContent("theme_colors", JSON.stringify(preset.colors));
  };

  const handleSelectFont = async (type: "heading" | "body", fontId: string) => {
    if (type === "heading") {
      setActiveHeadingFont(fontId);
      await updateContent("theme_heading_font", fontId);
    } else {
      setActiveBodyFont(fontId);
      await updateContent("theme_body_font", fontId);
    }
    applyFont(type, fontId);
  };

  const handleCustomColorChange = async (key: string, hex: string) => {
    const hsl = hexToHsl(hex);
    document.documentElement.style.setProperty(`--${key}`, hsl);

    // Get current colors and update
    const savedColors = getContent("theme_colors", "{}");
    let colors: Record<string, string> = {};
    try { colors = JSON.parse(savedColors); } catch {}
    colors[key] = hsl;
    applyColors(colors);
    setActiveTheme("custom");
    await updateContent("theme_preset", "custom");
    await updateContent("theme_colors", JSON.stringify(colors));
  };

  const handleResetToDefault = async () => {
    const defaultPreset = THEME_PRESETS[0];
    handleSelectTheme(defaultPreset);
    handleSelectFont("heading", "playfair");
    handleSelectFont("body", "inter");
    toast.success("Reset to default theme");
  };

  const handleLogoUpload = async (file: File) => {
    if (!user?.access_token) {
      toast.error("You must be logged in as an admin to upload assets");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    console.log("Starting logo upload for:", file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadUrl = `${import.meta.env.VITE_API_URL}/api/upload`;
      console.log("Uploading to:", uploadUrl);

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${user.access_token}` 
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Upload response error:", response.status, errorData);
        throw new Error(errorData.error || errorData.message || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload successful, result:", result);

      if (!result.url) {
        throw new Error("Server did not return a valid URL");
      }

      // Update both settings sequentially
      await updateContent("site_logo_url", result.url);
      await updateContent("site_logo_type", "image");
      
      toast.success("Branding updated successfully!");
    } catch (error: any) {
      console.error("Logo upload error:", error);
      toast.error(error.message || "Failed to upload logo. Please check your connection.");
    } finally {
      setIsUploading(false);
      // Clear the input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const currentColors = (() => {
    const savedColors = getContent("theme_colors", "");
    if (savedColors) {
      try { return JSON.parse(savedColors); } catch {}
    }
    return THEME_PRESETS[0].colors;
  })();

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-lg transform active:scale-95 transition-transform">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-bold text-foreground">Advanced Customization</h3>
            <p className="text-xs text-muted-foreground">Adjust themes, fonts, and branding</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSaving && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-8 border-t border-border mt-2">
          <Tabs defaultValue="themes" className="mt-4">
            <TabsList className="w-full grid grid-cols-3 mb-8 bg-muted/50 p-1">
              <TabsTrigger value="themes" className="gap-2"><Palette className="w-4 h-4" />Themes</TabsTrigger>
              <TabsTrigger value="typography" className="gap-2"><Type className="w-4 h-4" />Fonts</TabsTrigger>
              <TabsTrigger value="branding" className="gap-2"><Globe className="w-4 h-4" />Branding</TabsTrigger>
            </TabsList>

            <TabsContent value="themes" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* ── Theme Presets ── */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    Color Presets
                  </h4>
                  <Button variant="ghost" size="sm" className="text-xs gap-1.5 h-8 hover:bg-muted" onClick={handleResetToDefault}>
                    <RotateCcw className="w-3 h-3" />
                    Reset to Default
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectTheme(preset)}
                      className={`relative rounded-2xl p-4 border-2 transition-all text-left hover:shadow-xl group overflow-hidden ${
                        activeTheme === preset.id
                          ? "border-primary bg-primary/5 shadow-inner"
                          : "border-border hover:border-primary/40 bg-card"
                      }`}
                    >
                      {activeTheme === preset.id && (
                        <div className="absolute top-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-bl-xl">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      <div className="flex gap-2 mb-3">
                        {["primary", "secondary", "accent"].map((key) => (
                          <div
                            key={key}
                            className="w-7 h-7 rounded-lg border border-black/5 shadow-sm transform group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: `hsl(${preset.colors[key as keyof typeof preset.colors]})` }}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-bold text-foreground mb-0.5">{preset.name}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">{preset.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Custom Color Pickers ── */}
              <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
                <h4 className="text-sm font-bold text-foreground mb-4">Precision Color Tuning</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { key: "primary", label: "Brand Primary" },
                    { key: "secondary", label: "Navy Secondary" },
                    { key: "accent", label: "Gold Accent" },
                    { key: "background", label: "Page Body" },
                  ].map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
                      <div className="flex items-center gap-3 bg-card p-2 rounded-xl border border-border shadow-sm">
                        <input
                          type="color"
                          value={hslToHex(currentColors[key] || "0 0% 50%")}
                          onChange={(e) => handleCustomColorChange(key, e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-bold uppercase">{hslToHex(currentColors[key] || "0 0% 50%")}</span>
                          <span className="text-[9px] text-muted-foreground font-mono">{currentColors[key]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="typography" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" />
                  Heading Style
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {FONT_OPTIONS.heading.map((font) => {
                    loadGoogleFont(font.gfont);
                    return (
                      <button
                        key={font.id}
                        onClick={() => handleSelectFont("heading", font.id)}
                        className={`rounded-2xl px-4 py-5 border-2 transition-all text-left group ${
                          activeHeadingFont === font.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <span
                          className="block text-3xl font-bold text-foreground mb-1 group-hover:scale-110 transition-transform origin-left"
                          style={{ fontFamily: font.value }}
                        >
                          Aa
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">{font.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Type className="w-4 h-4 text-secondary" />
                  Body Text Style
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {FONT_OPTIONS.body.map((font) => {
                    loadGoogleFont(font.gfont);
                    return (
                      <button
                        key={font.id}
                        onClick={() => handleSelectFont("body", font.id)}
                        className={`rounded-2xl px-4 py-5 border-2 transition-all text-left ${
                          activeBodyFont === font.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <span
                          className="block text-sm text-foreground mb-2 leading-tight"
                          style={{ fontFamily: font.value }}
                        >
                          The art of music is nearest to tears and memories.
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">{font.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="branding" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-muted/30 rounded-3xl p-8 border border-border/50">
                <div className="max-w-2xl">
                  <h4 className="text-lg font-bold text-foreground mb-2">Corporate Branding</h4>
                  <p className="text-sm text-muted-foreground mb-8">Manage your official site logo and branding assets. Upload a high-resolution transparent PNG for best results.</p>
                  
                  <div className="space-y-8">
                    {/* Logo Type Selector */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-foreground uppercase tracking-widest">Logo Display Type</label>
                      <div className="flex gap-4">
                        <Button 
                          variant={logoType === "icon" ? "hero" : "outline"}
                          className="flex-1"
                          onClick={() => updateContent("site_logo_type", "icon")}
                        >
                          Icon & Text (Default)
                        </Button>
                        <Button 
                          variant={logoType === "image" ? "hero" : "outline"}
                          className="flex-1"
                          onClick={() => updateContent("site_logo_type", "image")}
                        >
                          Custom Image Logo
                        </Button>
                      </div>
                    </div>

                    {/* Logo Upload Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-foreground uppercase tracking-widest">Upload Logo</label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className={`aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                            isUploading ? "bg-muted" : "border-border hover:border-primary/50 hover:bg-primary/5"
                          }`}
                        >
                          {isUploading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                              <p className="text-sm font-bold">Choose a file</p>
                              <p className="text-[10px] text-muted-foreground mt-1">PNG, SVG or WEBP (Max 5MB)</p>
                            </>
                          )}
                          <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-foreground uppercase tracking-widest">Current Active Logo</label>
                        <div className="aspect-video rounded-2xl bg-white border border-border flex items-center justify-center p-6 shadow-inner relative overflow-hidden group">
                          {logoUrl ? (
                            <img src={logoUrl} alt="Site Logo" className="max-h-full max-w-full object-contain" />
                          ) : (
                            <div className="flex flex-col items-center text-muted-foreground">
                              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                              <p className="text-[10px] uppercase font-bold">No custom logo</p>
                            </div>
                          )}
                          {logoUrl && (
                            <button 
                              onClick={() => updateContent("site_logo_url", "")}
                              className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
