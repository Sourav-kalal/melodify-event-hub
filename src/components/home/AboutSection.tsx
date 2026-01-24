import { motion } from "framer-motion";
import { Music2, Users, Award, Heart } from "lucide-react";

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
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              About Us
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Where Passion Meets <span className="text-primary">Excellence</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Welcome to Sangeet Academy – a premier music institute dedicated to
              nurturing musical talent. We offer comprehensive training across a
              wide range of instruments and vocal techniques, guided by experienced
              instructors who are passionate about sharing their knowledge.
            </p>
            <p className="text-muted-foreground mb-8">
              Whether you're a beginner taking your first steps into the world of
              music or an intermediate learner looking to refine your skills, our
              structured curriculum and personalized approach ensure you achieve
              your musical goals.
            </p>

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
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
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
              <div className="absolute inset-16 rounded-full bg-card shadow-medium flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-hero flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <Music2 className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                    10+ Years
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Of Musical Excellence
                  </p>
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
                  className={`absolute ${item.position} w-12 h-12 bg-card rounded-full shadow-soft flex items-center justify-center text-2xl animate-float`}
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
