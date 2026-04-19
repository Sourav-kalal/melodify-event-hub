import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/modify/EditableText";
import ctaSectionBg from "@/assets/cta-section-bg.png";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src={ctaSectionBg}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/92 via-background/88 to-background/94" />
      </div>
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-20 top-1/4 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl px-2 py-6 text-center sm:px-4 sm:py-10"
        >
          <h2 className="mb-6 font-serif text-3xl font-bold text-foreground [text-shadow:0_2px_28px_rgba(0,0,0,0.75)] md:text-4xl lg:text-5xl">
            <EditableText
              settingKey="cta_title"
              defaultValue="Ready to Start Your Musical Journey?"
              className="[text-shadow:inherit]"
            />
          </h2>
          <div className="mb-8 text-lg font-medium leading-relaxed text-foreground/95 [text-shadow:0_2px_16px_rgba(0,0,0,0.65)]">
            <EditableText
              settingKey="cta_description"
              defaultValue="Join hundreds of students who have discovered their passion for music at Sandy's Stereo. Register today and take the first step towards mastering your favorite instrument."
              as="p"
              multiline
              className="[text-shadow:inherit]"
            />
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-foreground/35 text-foreground hover:bg-foreground hover:text-background"
              asChild
            >
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
