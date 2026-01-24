import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-navy relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground mb-6">
            Ready to Start Your{" "}
            <span className="text-accent">Musical Journey?</span>
          </h2>
          <p className="text-secondary-foreground/70 text-lg mb-8">
            Join hundreds of students who have discovered their passion for music
            at Sangeet Academy. Register today and take the first step towards
            mastering your favorite instrument.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary"
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
