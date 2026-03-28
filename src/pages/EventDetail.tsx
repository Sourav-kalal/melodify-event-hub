import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  MessageCircle,
  MapPin,
  Share2,
  Music,
} from "lucide-react";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleWhatsApp = () => {
    const phone = "918660046713";
    const message = encodeURIComponent(
      `Hi, I'd like to know more about the "${event?.name}" event.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: event?.name,
        text: event?.description || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const isPast = event ? new Date(event.event_date) < new Date() : false;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {isLoading ? (
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-8 w-40 mb-8" />
            <Skeleton className="aspect-video w-full rounded-2xl mb-8" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : !event ? (
          <div className="container mx-auto px-4 py-32 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground mb-6">This event doesn't exist or has been removed.</p>
            <Button variant="hero" asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Hero Banner */}
            <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
              {event.banner_url ? (
                <img
                  src={event.banner_url}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-hero flex items-center justify-center">
                  <Music className="w-24 h-24 text-primary-foreground/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                <div className="container mx-auto">
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 text-secondary-foreground/70 hover:text-accent transition-colors text-sm mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Events
                  </Link>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {isPast && (
                      <span className="inline-block px-3 py-1 bg-muted-foreground/20 text-secondary-foreground/70 rounded-full text-xs font-medium mb-3">
                        Past Event
                      </span>
                    )}
                    <h1 className="font-serif text-3xl md:text-5xl font-bold text-secondary-foreground mb-3">
                      {event.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-secondary-foreground/70">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent" />
                        {format(new Date(event.event_date), "EEEE, MMMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        {format(new Date(event.event_date), "h:mm a")}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Content */}
            <section className="py-12 lg:py-20">
              <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
                  {/* Main Content */}
                  <motion.div
                    className="lg:col-span-3 space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                        About This Event
                      </h2>
                      <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
                        {event.description || "More details coming soon. Stay tuned!"}
                      </p>
                    </div>

                    {/* Event Info Cards */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-card rounded-xl border border-border p-5">
                        <Calendar className="w-6 h-6 text-primary mb-2" />
                        <div className="font-bold text-foreground">
                          {format(new Date(event.event_date), "MMM d, yyyy")}
                        </div>
                        <div className="text-muted-foreground text-sm">Event Date</div>
                      </div>
                      <div className="bg-card rounded-xl border border-border p-5">
                        <Clock className="w-6 h-6 text-primary mb-2" />
                        <div className="font-bold text-foreground">
                          {format(new Date(event.event_date), "h:mm a")}
                        </div>
                        <div className="text-muted-foreground text-sm">Event Time</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Sidebar */}
                  <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="sticky top-28 bg-card rounded-2xl border border-border shadow-medium p-6 md:p-8 space-y-4">
                      <div className="text-center pb-4 border-b border-border">
                        <span className="text-2xl font-bold text-accent">Free Entry</span>
                      </div>

                      {!isPast && (
                        <div className="space-y-3">
                          {event.google_form_link && (
                            <Button
                              variant="gold"
                              size="lg"
                              className="w-full"
                              onClick={() => window.open(event.google_form_link!, "_blank")}
                            >
                              <ExternalLink className="w-5 h-5" />
                              Register Now — Free
                            </Button>
                          )}

                          <Button
                            variant="default"
                            size="lg"
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleWhatsApp}
                          >
                            <MessageCircle className="w-5 h-5" />
                            Chat on WhatsApp
                          </Button>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={handleShare}
                      >
                        <Share2 className="w-5 h-5" />
                        Share Event
                      </Button>

                      <p className="text-muted-foreground text-xs text-center">
                        {isPast
                          ? "This event has already taken place."
                          : "Reserve your spot now. Limited seats available!"}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default EventDetail;
