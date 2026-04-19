import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/courses/CourseCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { EditableText } from "@/components/modify/EditableText";
import coursesSectionBg from "@/assets/courses-section-bg.png";

export function CoursesPreview() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses-preview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src={coursesSectionBg}
          alt=""
          className="h-full w-full scale-[1.06] object-cover object-[center_45%] brightness-[0.58] contrast-[0.92] saturate-[0.82] blur-[2.5px]"
        />
        {/* Heavily toned down; warm tint kept subtle */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/88 via-black/68 to-black/86" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/48 via-secondary/32 to-secondary/40" />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_95%_72%_at_50%_48%,transparent_0%,rgba(0,0,0,0.52)_100%)]"
          aria-hidden
        />
        {/* Blend from About — continue page background into this image */}
        <div className="absolute inset-x-0 top-0 z-[2] h-32 bg-gradient-to-b from-background via-background/55 to-transparent md:h-44" />
        {/* Blend into Events — fade out through page background */}
        <div className="absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-b from-transparent via-background/75 to-background md:h-44" />
      </div>
      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-6 inline-block rounded-full px-4 py-1.5 text-sm font-semibold text-foreground [text-shadow:0_1px_10px_rgba(0,0,0,0.8)] glass-surface">
            <EditableText
              settingKey="courses_section_badge"
              defaultValue="Our Courses"
            />
          </span>
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground [text-shadow:0_2px_24px_rgba(0,0,0,0.85)] selection:bg-foreground/25 selection:text-foreground md:text-4xl lg:text-5xl">
            <EditableText
              settingKey="courses_section_title"
              defaultValue="Learn From the Best"
              className="selection:bg-foreground/25 selection:text-foreground"
            />
          </h2>
          <div className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-foreground/92 [text-shadow:0_1px_14px_rgba(0,0,0,0.75)]">
            <EditableText
              settingKey="courses_section_description"
              defaultValue="Explore our diverse range of music courses designed for learners at every level."
              as="p"
            />
          </div>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))
          ) : (
            courses?.map((course, index) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                level={course.level}
                upiPrice={course.upi_price ? Number(course.upi_price) : undefined}
                imageUrl={course.image_url || undefined}
                index={index}
              />
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
          <Button variant="hero" size="lg" asChild>
            <Link to="/courses">
              View All Courses
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
