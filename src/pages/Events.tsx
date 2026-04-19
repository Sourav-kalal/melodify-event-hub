import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import eventsSectionBg from "@/assets/events-section-bg.png";

const Events = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .order("event_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const upcomingEvents = events?.filter(
    (e) => new Date(e.event_date) >= new Date()
  );
  const pastEvents = events?.filter(
    (e) => new Date(e.event_date) < new Date()
  );

  // removed handleRegister - now using detail pages

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <img
              src={eventsSectionBg}
              alt=""
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/85 to-secondary/72" />
          </div>
          <div className="container relative z-10 mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <h1 className="mb-4 font-serif text-4xl font-bold text-secondary-foreground [text-shadow:0_2px_28px_rgba(0,0,0,0.9)] md:text-5xl lg:text-6xl">
                Upcoming <span className="text-primary [text-shadow:0_2px_20px_rgba(0,0,0,0.85)]">Events</span>
              </h1>
              <p className="text-lg font-medium leading-relaxed text-secondary-foreground/95 [text-shadow:0_1px_18px_rgba(0,0,0,0.85)]">
                Join us for concerts, workshops, and cultural celebrations.
                Experience the joy of music with our community.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
              Upcoming Events
            </h2>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-card rounded-2xl p-6 border border-border">
                      <Skeleton className="h-48 w-full rounded-lg mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
              </div>
            ) : upcomingEvents?.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card py-16 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-primary" />
                <p className="text-lg font-medium text-foreground">
                  No upcoming events at the moment. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                {upcomingEvents?.map((event, index) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border border-border"
                    >
                      {/* Banner */}
                      <div className="aspect-video bg-gradient-hero overflow-hidden relative">
                        {event.banner_url ? (
                          <img
                            src={event.banner_url}
                            alt={event.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Calendar className="w-16 h-16 text-primary-foreground/50" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-primary">
                            {format(new Date(event.event_date), "d")}
                          </div>
                          <div className="text-xs text-muted-foreground uppercase">
                            {format(new Date(event.event_date), "MMM")}
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            {format(new Date(event.event_date), "EEEE, MMMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            {format(new Date(event.event_date), "h:mm a")}
                          </div>
                        </div>

                        <h3 className="font-serif text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                          {event.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {event.description}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Past Events */}
        {pastEvents && pastEvents.length > 0 && (
          <section className="py-12 lg:py-20 bg-muted/50">
            <div className="container mx-auto px-4">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                Past Events
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {pastEvents.map((event, index) => (
                  <Link key={event.id} to={`/events/${event.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-card rounded-xl p-4 border border-border opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <div className="flex items-center gap-3 mb-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(event.event_date), "MMM d, yyyy")}
                      </div>
                      <h4 className="font-semibold text-card-foreground">
                        {event.name}
                      </h4>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Events;
