import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useCourse } from "@/hooks/useCoursesApi";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EnrollmentFormDialog } from "@/components/courses/EnrollmentFormDialog";
import { getCourseImage } from "@/lib/courseImages";
import {
  ArrowLeft,
  Clock,
  BarChart3,
  MessageCircle,
  CreditCard,
  Music,
  Users,
  Star,
  CheckCircle2,
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: course, isLoading } = useCourse(id || "");

  const handleWhatsApp = () => {
    const phone = "918660046713";
    const message = encodeURIComponent(
      `Hi, I'm interested in the ${course?.title} course. Please share more details.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Intermediate":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Advanced":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const image = course ? (course.image_url || getCourseImage(course.title)) : "";

  const highlights = [
    "Expert instructors with years of experience",
    "Flexible class schedules — morning & evening batches",
    "Both online and offline modes available",
    "Regular performance opportunities",
    "Certificate upon completion",
    "Small batch sizes for personal attention",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {isLoading ? (
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="h-8 w-40 mb-8" />
            <div className="grid lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <Skeleton className="aspect-video w-full rounded-2xl" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div className="lg:col-span-2">
                <Skeleton className="h-80 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        ) : !course ? (
          <div className="container mx-auto px-4 py-32 text-center">
            <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold mb-2">Course Not Found</h2>
            <p className="text-muted-foreground mb-6">This course doesn't exist or has been removed.</p>
            <Button variant="hero" asChild>
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Hero Banner */}
            <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
              <img
                src={image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                <div className="container mx-auto">
                  <Link
                    to="/courses"
                    className="inline-flex items-center gap-2 text-secondary-foreground/70 hover:text-accent transition-colors text-sm mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Courses
                  </Link>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Badge className={`${getLevelColor(course.level)} mb-3`} variant="outline">
                      {course.level}
                    </Badge>
                    <h1 className="font-serif text-3xl md:text-5xl font-bold text-secondary-foreground mb-2">
                      {course.title}
                    </h1>
                    {course.duration && (
                      <div className="flex items-center gap-2 text-secondary-foreground/70">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    )}
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
                    {/* About */}
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                        About This Course
                      </h2>
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {course.description}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                      <h3 className="font-serif text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                        <Star className="w-5 h-5 text-accent" />
                        Course Highlights
                      </h3>
                      <ul className="grid sm:grid-cols-2 gap-3">
                        {highlights.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { icon: Users, label: "Batch Size", value: "8-12" },
                        { icon: BarChart3, label: "Level", value: course.level },
                        { icon: Clock, label: "Duration", value: course.duration || "Flexible" },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="bg-card rounded-xl border border-border p-4 text-center"
                        >
                          <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                          <div className="font-bold text-foreground text-lg">{stat.value}</div>
                          <div className="text-muted-foreground text-xs">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Sidebar - Actions */}
                  <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="sticky top-28 bg-card rounded-2xl border border-border shadow-medium p-6 md:p-8 space-y-6">
                      {course.upi_price && (
                        <div className="text-center pb-4 border-b border-border">
                          <span className="text-4xl font-bold text-primary">
                            ₹{Number(course.upi_price).toLocaleString("en-IN")}
                          </span>
                          <span className="text-muted-foreground ml-1">/course</span>
                        </div>
                      )}

                      <div className="space-y-3">
                        <Button
                          variant="default"
                          size="lg"
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          onClick={handleWhatsApp}
                        >
                          <MessageCircle className="w-5 h-5" />
                          Chat on WhatsApp
                        </Button>

                        <EnrollmentFormDialog courseId={course.id} courseTitle={course.title} coursePrice={course.upi_price ? Number(course.upi_price) : null}>
                          <Button variant="hero" size="lg" className="w-full">
                            <CreditCard className="w-5 h-5" />
                            Join Now — Apply
                          </Button>
                        </EnrollmentFormDialog>
                      </div>

                      <p className="text-muted-foreground text-xs text-center">
                        Have questions? Reach us on WhatsApp or fill the admission form to join.
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

export default CourseDetail;
