import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import brandLogoUrl from "@/assets/sandy-stereo-logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useSiteContent } from "@/hooks/SiteContentContext";
import { EditableText } from "@/components/modify/EditableText";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/events", label: "Events" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, isLoading, signOut } = useAuth();
  const { getContent } = useSiteContent();

  const logoUrl = getContent("site_logo_url", "");
  const logoType = getContent("site_logo_type", "icon");
  const logoSrc = logoType === "image" && logoUrl ? logoUrl : brandLogoUrl;
  const showSiteNameBesideLogo = logoType === "image" && Boolean(logoUrl);
  const isBundledBrandLogo = logoSrc === brandLogoUrl;

  const getDashboardPath = () => {
    switch (role) {
      case "admin": return "/admin";
      case "instructor": return "/instructor";
      default: return "/student";
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="container mx-auto px-4">
        <div className="flex min-h-16 items-center justify-between py-2 lg:min-h-20 lg:py-2.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center py-1.5 pr-1 transition-all duration-300 group-hover:scale-[1.02] active:scale-[0.98]">
              <img
                src={logoSrc}
                alt="Sandy's Stereo — Music Institute and Event Management"
                className={cn(
                  "h-12 w-auto max-h-[3.5rem] max-w-[min(280px,52vw)] object-contain object-left sm:h-[3.35rem] lg:h-16 lg:max-h-[4.25rem] lg:max-w-[min(320px,40vw)]",
                  isBundledBrandLogo ? "brand-logo-prominent" : "drop-shadow-md",
                )}
              />
            </div>
            {showSiteNameBesideLogo ? (
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl lg:text-2xl font-bold text-foreground tracking-wide uppercase">
                  <EditableText
                    settingKey="site_name"
                    defaultValue="Sandy's Stereo"
                  />
                </span>
                <span className="text-[9px] lg:text-[10px] font-medium text-muted-foreground tracking-widest uppercase">
                  <EditableText
                    settingKey="site_tagline"
                    defaultValue="Music Institute & Event Management"
                  />
                </span>
              </div>
            ) : null}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative py-2",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-foreground/80 hover:text-primary"
                )}
              >
                {link.label}
                {location.pathname === link.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {user.email?.split("@")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(getDashboardPath())}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !isLoading ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="hero" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 bg-background/65 backdrop-blur-xl animate-fade-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/85 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 px-4">
                {!isLoading && user ? (
                  <>
                    <Button variant="outline" className="w-full" onClick={() => { navigate(getDashboardPath()); setIsOpen(false); }}>
                      Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                      Sign Out
                    </Button>
                  </>
                ) : !isLoading ? (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button variant="hero" asChild className="w-full">
                      <Link to="/register">Get Started</Link>
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
