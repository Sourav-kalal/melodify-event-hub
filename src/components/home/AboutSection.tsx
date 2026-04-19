import { motion } from "framer-motion";
import { Music2, Users, Award, Heart } from "lucide-react";
import { EditableText } from "@/components/modify/EditableText";
import aboutSectionBg from "@/assets/about-section-bg.png";

const features = [
  {
    icon: Music2,
    title: "Expert Instructors",
    description: "Learn from accomplished musicians with years of teaching experience.",
  },
  {
    icon: Users,
    title: "Small Batch Sizes",
    description: "Personalized attention with limited students per batch.",
  },
  {
    icon: Award,
    title: "Certified Programs",
    description: "Receive recognized certifications upon course completion.",
  },
  {
    icon: Heart,
    title: "Passion-Driven",
    description: "We nurture your love for music in a supportive environment.",
  },
];

export function AboutSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src={aboutSectionBg}
          alt=""
          className="h-full w-full object-cover object-[center_45%] brightness-[0.64] contrast-[0.93] saturate-[0.88]"
        />
        {/* Tone down hotspots; heavy on the left where copy sits */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/91 via-black/66 to-black/52" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/68 via-secondary/48 to-secondary/36" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/46 via-transparent to-black/56" />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_88%_42%,rgba(0,0,0,0.66)_0%,transparent_68%)]"
          aria-hidden
        />
        {/* Blend from hero — continue page background into this image */}
        <div className="absolute inset-x-0 top-0 z-[2] h-32 bg-gradient-to-b from-background via-background/55 to-transparent md:h-44" />
        {/* Fade into page background so the next section doesn’t hard-cut */}
        <div className="absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-b from-transparent via-background/75 to-background md:h-44" />
      </div>
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-block rounded-full px-4 py-1.5 text-sm font-semibold text-foreground [text-shadow:0_1px_10px_rgba(0,0,0,0.8)] glass-surface">
              <EditableText
                settingKey="about_badge"
                defaultValue="About Us"
              />
            </span>
            <h2 className="mb-6 font-serif text-3xl font-bold text-foreground [text-shadow:0_2px_24px_rgba(0,0,0,0.85)] md:text-4xl lg:text-5xl">
              <EditableText
                settingKey="about_title"
                defaultValue="Where Passion Meets Excellence"
              />
            </h2>
            <div className="mb-8 text-lg font-medium leading-relaxed text-foreground/92 [text-shadow:0_1px_14px_rgba(0,0,0,0.75)]">
              <EditableText
                settingKey="about_description"
                defaultValue={`Welcome to Sandy's Stereo 
Our structured programs and small batches keep instruction personal, focused, and inspiring.
We're here to help you build technique, confidence, and real joy in making music.`}
                as="p"
                multiline
                className="whitespace-pre-line"
              />
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg glass-surface">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold text-foreground [text-shadow:0_1px_8px_rgba(0,0,0,0.65)]">
                      {feature.title}
                    </h4>
                    <p className="text-sm font-medium text-foreground/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.65)]">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Circle */}
              <div className="absolute inset-8 rounded-full bg-gradient-hero opacity-20 blur-3xl" />
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute inset-8 rounded-full border-2 border-dashed border-accent/30 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
              
              {/* Center Content */}
              <div className="absolute inset-16 flex items-center justify-center rounded-full glass-surface-strong shadow-medium">
                <div className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-hero shadow-glow">
                    <Music2 className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 font-serif text-2xl font-bold text-foreground">
                    <EditableText
                      settingKey="about_experience_years"
                      defaultValue="5+ Years"
                    />
                  </h3>
                  <div className="text-sm font-medium text-foreground/85">
                    <EditableText
                      settingKey="about_experience_subtitle"
                      defaultValue="Of Musical Excellence"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              {[
                { emoji: "🎸", position: "top-4 left-1/2 -translate-x-1/2" },
                { emoji: "🎹", position: "bottom-4 left-1/2 -translate-x-1/2" },
                { emoji: "🥁", position: "left-4 top-1/2 -translate-y-1/2" },
                { emoji: "🎵", position: "right-4 top-1/2 -translate-y-1/2" },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`absolute ${item.position} flex h-12 w-12 items-center justify-center rounded-full glass-surface text-2xl shadow-soft animate-float`}
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  {item.emoji}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
