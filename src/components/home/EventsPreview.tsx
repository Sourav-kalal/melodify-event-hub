import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { EditableText } from "@/components/modify/EditableText";
import eventsSectionBg from "@/assets/events-section-bg.png";

function EventBannerImage({ url, name }: { url: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!url.trim() || failed) return null;
  return (
    <div className="aspect-video overflow-hidden">
      <img
        src={url}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function EventsPreview() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(2);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src={eventsSectionBg}
          alt=""
          className="h-full w-full object-cover object-center brightness-[0.62] contrast-[0.92] saturate-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/78 via-black/52 to-black/74" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/42 via-secondary/28 to-secondary/36" />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_40%,transparent_0%,rgba(0,0,0,0.45)_100%)]"
          aria-hidden
        />
        {/* Blend from Courses — continue page background into this image */}
        <div className="absolute inset-x-0 top-0 z-[2] h-32 bg-gradient-to-b from-background via-background/55 to-transparent md:h-44" />
      </div>
      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 glass-surface rounded-full text-sm font-semibold text-foreground [text-shadow:0_1px_8px_rgba(0,0,0,0.75)] mb-6">
            <EditableText
              settingKey="events_section_badge"
              defaultValue="Upcoming Events"
            />
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 [text-shadow:0_2px_24px_rgba(0,0,0,0.85)]">
            <EditableText
              settingKey="events_section_title"
              defaultValue="Join Our Events"
            />
          </h2>
          <div className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-foreground/95 [text-shadow:0_1px_16px_rgba(0,0,0,0.8)]">
            <EditableText
              settingKey="events_section_description"
              defaultValue="Experience the joy of music through our concerts, workshops, and cultural events."
              as="p"
            />
          </div>
        </motion.div>

        {/* Events */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12 max-w-4xl mx-auto">
          {isLoading ? (
            Array(2)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-card rounded-2xl p-6 border border-border">
                  <Skeleton className="h-40 w-full rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
          ) : events?.length === 0 ? (
            <div className="col-span-2 py-12 text-center">
              <p className="rounded-xl glass-surface px-6 py-4 text-base font-medium text-foreground [text-shadow:0_1px_12px_rgba(0,0,0,0.75)]">
                No upcoming events at the moment.
              </p>
            </div>
          ) : (
            events?.map((event, index) => (
              <Link key={event.id} to={`/events/${event.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border border-border"
                >
                  <EventBannerImage url={event.banner_url ?? ""} name={event.name} />

                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        {format(new Date(event.event_date), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        {format(new Date(event.event_date), "h:mm a")}
                      </div>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                      {event.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/events">
              View All Events
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
