import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  Calendar,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Video,
  GraduationCap,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import brandLogoUrl from "@/assets/sandy-stereo-logo.png";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const studentNav: NavItem[] = [
  { href: "/student", label: "Dashboard", icon: Home },
  { href: "/student/courses", label: "My Courses", icon: BookOpen },
  { href: "/student/classes", label: "Upcoming Classes", icon: Video },
  { href: "/student/payments", label: "Payment History", icon: CreditCard },
];

const instructorNav: NavItem[] = [
  { href: "/instructor", label: "Dashboard", icon: Home },
  { href: "/instructor/courses", label: "My Courses", icon: BookOpen },
  { href: "/instructor/schedule", label: "Class Schedule", icon: Calendar },
  { href: "/instructor/students", label: "Students", icon: GraduationCap },
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/modify", label: "Modify Website", icon: Palette },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { role, user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = role === "admin" ? adminNav : role === "instructor" ? instructorNav : studentNav;
  const roleLabel = role === "admin" ? "Admin" : role === "instructor" ? "Instructor" : "Student";
  const roleColor = role === "admin" ? "bg-red-500" : role === "instructor" ? "bg-blue-500" : "bg-green-500";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-border/50 bg-card/50 backdrop-blur-2xl transform transition-transform duration-300 lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border/50">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center py-2 shrink-0">
                <img
                  src={brandLogoUrl}
                  alt="Sandy's Stereo"
                  className="brand-logo-prominent h-12 w-auto max-w-[200px] object-contain object-left lg:h-14 lg:max-w-[220px]"
                />
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {user?.email?.[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.user_metadata?.full_name || user?.email}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white",
                    roleColor
                  )}
                >
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "border border-primary/25 bg-primary/12 text-primary backdrop-blur-md"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border/40 glass-nav">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 -ml-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <h1 className="font-serif text-xl font-bold text-foreground">
                {title}
              </h1>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                View Website
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
