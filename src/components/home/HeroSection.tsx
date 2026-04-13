import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/modify/EditableText";
import { EditableImage } from "@/components/modify/EditableImage";
import heroBanner from "@/assets/hero-banner.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <EditableImage
          settingKey="hero_banner_url"
          defaultSrc={heroBanner}
          alt="Musical instruments"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 lg:py-40">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6">
              <EditableText
                settingKey="hero_badge"
                defaultValue="🎵 Start Your Musical Journey"
              />
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-secondary-foreground leading-tight mb-6">
              <EditableText
                settingKey="hero_title"
                defaultValue="Discover the Magic of Music"
              />
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-lg md:text-xl text-secondary-foreground/80 mb-8 max-w-2xl">
              <EditableText
                settingKey="hero_description"
                defaultValue="Learn from expert instructors in a nurturing environment. From classical Indian music to contemporary instruments, we offer comprehensive training for all skill levels."
                as="p"
                multiline
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/courses">
                Explore Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              variant="heroOutline"
              size="xl"
              className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary"
              asChild
            >
              <Link to="/events">
                <Play className="w-5 h-5" />
                View Events
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid grid-cols-3 gap-8 max-w-lg"
          >
            {[
              { valueKey: "hero_stat_1_value", labelKey: "hero_stat_1_label", defaultValue: "500+", defaultLabel: "Students" },
              { valueKey: "hero_stat_2_value", labelKey: "hero_stat_2_label", defaultValue: "9", defaultLabel: "Courses" },
              { valueKey: "hero_stat_3_value", labelKey: "hero_stat_3_label", defaultValue: "15+", defaultLabel: "Instructors" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-3xl md:text-4xl font-bold text-accent">
                  <EditableText
                    settingKey={stat.valueKey}
                    defaultValue={stat.defaultValue}
                  />
                </div>
                <div className="text-sm text-secondary-foreground/60">
                  <EditableText
                    settingKey={stat.labelKey}
                    defaultValue={stat.defaultLabel}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
