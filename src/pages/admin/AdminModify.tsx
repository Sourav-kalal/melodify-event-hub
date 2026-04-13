import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useSiteContent } from "@/hooks/SiteContentContext";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { CoursesPreview } from "@/components/home/CoursesPreview";
import { EventsPreview } from "@/components/home/EventsPreview";
import { CTASection } from "@/components/home/CTASection";
import { ThemeCustomizer } from "@/components/modify/ThemeCustomizer";

const AdminModify = () => {
  const { isEditMode, setEditMode, isSaving, isLoading } = useSiteContent();

  if (isLoading) {
    return (
      <DashboardLayout title="Modify Website">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Modify Website">
      {/* Floating Toolbar */}
      <div className="sticky top-16 z-40 mb-6">
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isEditMode ? 'bg-primary/10' : 'bg-muted'}`}>
                <Sparkles className={`w-5 h-5 ${isEditMode ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {isEditMode ? "Edit Mode Active" : "Preview Mode"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isEditMode
                    ? "Click on any text or image to edit. Changes save instantly."
                    : "Toggle edit mode to start making changes."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isSaving && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </div>
              )}
              <Button
                onClick={() => setEditMode(!isEditMode)}
                variant={isEditMode ? "hero" : "outline"}
                size="sm"
                className="gap-2"
              >
                {isEditMode ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Exit Edit Mode
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Enter Edit Mode
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Customizer Panel */}
      <div className="mb-6">
        <ThemeCustomizer />
      </div>

      {/* Website Preview Container */}
      <div className={`rounded-2xl overflow-hidden border-2 transition-colors duration-300 ${
        isEditMode ? "border-primary/30 shadow-[0_0_30px_rgba(var(--primary),0.1)]" : "border-border"
      }`}>
        {/* Info Banner when in edit mode */}
        {isEditMode && (
          <div className="bg-primary/5 border-b border-primary/20 px-4 py-2.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">
              Edit Mode — Hover over text or images to see edit controls
            </span>
          </div>
        )}

        {/* Actual Website Render */}
        <div className="bg-background">
          <Navbar />
          <main className="pt-16 lg:pt-20">
            <HeroSection />
            <AboutSection />
            <CoursesPreview />
            <EventsPreview />
            <CTASection />
          </main>
          <Footer />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminModify;
