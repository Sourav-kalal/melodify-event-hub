import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Music, LogOut, LayoutDashboard } from "lucide-react";
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {logoType === "image" && logoUrl ? (
              <div className="h-10 lg:h-12 w-auto overflow-hidden rounded-lg shadow-soft transition-all duration-300 group-hover:scale-105 active:scale-95">
                <img src={logoUrl} alt="Logo" className="h-full w-auto object-contain" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow">
                <Music className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl lg:text-2xl font-bold text-accent tracking-wide uppercase">
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
                    : "text-muted-foreground"
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
          <div className="md:hidden py-4 border-t border-border animate-fade-up">
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
                      : "text-muted-foreground hover:bg-muted"
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
