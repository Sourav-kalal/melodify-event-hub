import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  BookOpen,
  Calendar,
  UserPlus,
  Guitar,
  Piano,
  Mic2,
  Drumstick,
  Drum,
  Instagram,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "@/components/modify/EditableText";
import { useSiteContent } from "@/hooks/SiteContentContext";
import brandLogoUrl from "@/assets/sandy-stereo-logo.png";

const quickLinks = [
  { to: "/courses", label: "Our Courses", Icon: BookOpen },
  { to: "/events", label: "Upcoming Events", Icon: Calendar },
  { to: "/register", label: "Register Now", Icon: UserPlus },
] as const;

const popularCourses = [
  { label: "Guitar", Icon: Guitar },
  { label: "Piano", Icon: Piano },
  { label: "Vocals", Icon: Mic2 },
  { label: "Tabla", Icon: Drumstick },
  { label: "Drums", Icon: Drum },
] as const;

const INSTAGRAM_URL = "https://www.instagram.com/sandys_stereo/";

const footerIconTileClass =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary";

export function Footer() {
  const { getContent } = useSiteContent();
  const logoUrl = getContent("site_logo_url", "");
  const logoType = getContent("site_logo_type", "icon");
  const logoSrc = logoType === "image" && logoUrl ? logoUrl : brandLogoUrl;
  const showSiteNameBesideLogo = logoType === "image" && Boolean(logoUrl);
  const isBundledBrandLogo = logoSrc === brandLogoUrl;

  return (
    <footer className="relative -mt-px overflow-hidden text-foreground">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-card via-background to-card" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_55%_at_50%_-15%,hsl(var(--primary)/0.1),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_0%_100%,hsl(var(--secondary)/0.65),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_80%,hsl(var(--primary)/0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy)/0.92)] to-transparent opacity-90" />
        {/* Blend with section above (e.g. Events) — same background token, no hard rule */}
        <div className="absolute inset-x-0 top-0 z-[2] h-28 bg-gradient-to-b from-background via-background/55 to-transparent md:h-36" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center py-2">
                <img
                  src={logoSrc}
                  alt="Sandy's Stereo — Music Institute and Event Management"
                  className={cn(
                    "h-14 w-auto max-w-[min(280px,85vw)] object-contain object-left lg:h-16 lg:max-w-[300px]",
                    isBundledBrandLogo ? "brand-logo-prominent" : "drop-shadow-md",
                  )}
                />
              </div>
              {showSiteNameBesideLogo ? (
                <div className="flex flex-col leading-none">
                  <span className="font-serif text-xl font-bold uppercase tracking-wide text-foreground">
                    <EditableText
                      settingKey="site_name"
                      defaultValue="Sandy's Stereo"
                    />
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
                    <EditableText
                      settingKey="site_tagline"
                      defaultValue="Music Institute & Event Management"
                    />
                  </span>
                </div>
              ) : null}
            </Link>
            <div className="space-y-2 rounded-xl border border-primary/15 bg-primary/[0.06] px-4 py-3 backdrop-blur-sm">
              <EditableText
                settingKey="footer_tagline_lead"
                defaultValue="Where passion meets excellence."
                as="p"
                className="text-sm font-semibold leading-snug text-primary"
              />
              <EditableText
                settingKey="footer_description"
                defaultValue="Learn music from the best instructors in a nurturing environment."
                as="p"
                multiline
                className="whitespace-pre-line bg-gradient-to-r from-[hsl(var(--cream))] via-foreground to-[hsl(var(--saffron))] bg-clip-text text-sm font-medium leading-relaxed text-transparent"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-serif text-lg font-semibold text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map(({ to, label, Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center gap-2.5 rounded-lg py-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span
                      className={`${footerIconTileClass} transition-colors group-hover:border-primary/25 group-hover:bg-primary/15`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="mb-4 font-serif text-lg font-semibold text-foreground">
              Popular Courses
            </h4>
            <ul className="space-y-2">
              {popularCourses.map(({ label, Icon }) => (
                <li key={label}>
                  <Link
                    to="/courses"
                    className="group flex items-center gap-2.5 rounded-lg py-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span
                      className={`${footerIconTileClass} transition-colors group-hover:border-primary/25 group-hover:bg-primary/15`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-serif text-lg font-semibold text-foreground">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <span className={footerIconTileClass} aria-hidden>
                  <Phone className="h-4 w-4" />
                </span>
                <EditableText
                  settingKey="footer_phone"
                  defaultValue="+91 86600 46713"
                />
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <span className={footerIconTileClass} aria-hidden>
                  <Mail className="h-4 w-4" />
                </span>
                <EditableText
                  settingKey="footer_email"
                  defaultValue="sandysstereo@gmail.com"
                />
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className={`${footerIconTileClass} mt-0.5`} aria-hidden>
                  <MapPin className="h-4 w-4" />
                </span>
                <EditableText
                  settingKey="footer_address"
                  defaultValue="Ring Rd, Alkunte Nagar, KC Nagar, Adarsh Nagar, Vijayapura, Karnataka 586103"
                />
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-lg py-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <span
                    className={`${footerIconTileClass} transition-colors group-hover:border-primary/25 group-hover:bg-primary/15`}
                  >
                    <Instagram className="h-4 w-4" aria-hidden />
                  </span>
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sandy's Stereo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
