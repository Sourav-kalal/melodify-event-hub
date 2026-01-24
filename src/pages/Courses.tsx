import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CourseCard } from "@/components/courses/CourseCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");

      if (error) throw error;
      return data?.reduce((acc, item) => {
        acc[item.setting_key] = item.setting_value;
        return acc;
      }, {} as Record<string, string>);
    },
  });

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      levelFilter === "all" || course.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-navy">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-foreground mb-4">
                Our <span className="text-accent">Courses</span>
              </h1>
              <p className="text-secondary-foreground/70 text-lg">
                Explore our comprehensive range of music courses designed for
                learners at every level. From classical Indian instruments to
                contemporary music, find your perfect course.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border bg-card sticky top-16 lg:top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {Array(9)
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
                  ))}
              </div>
            ) : filteredCourses?.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  No courses found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredCourses?.map((course, index) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    level={course.level}
                    upiPrice={course.upi_price ? Number(course.upi_price) : undefined}
                    imageUrl={course.image_url || undefined}
                    whatsappNumber={course.whatsapp_number || undefined}
                    googleFormLink={course.google_form_link || undefined}
                    globalWhatsappNumber={settings?.global_whatsapp_number}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
