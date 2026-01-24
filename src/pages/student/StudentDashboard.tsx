import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Calendar, CreditCard, Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const StudentDashboard = () => {
  const { user } = useAuth();

  const { data: enrollments } = useQuery({
    queryKey: ["student-enrollments", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, courses(*)")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: upcomingClasses } = useQuery({
    queryKey: ["student-classes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const enrolledCourseIds = enrollments?.map((e) => e.course_id) || [];
      if (enrolledCourseIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from("classes")
        .select("*, courses(title)")
        .in("course_id", enrolledCourseIds)
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!enrollments,
  });

  const { data: payments } = useQuery({
    queryKey: ["student-payments", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("payments")
        .select("*, courses(title)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const stats = [
    {
      title: "Enrolled Courses",
      value: enrollments?.length || 0,
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Upcoming Classes",
      value: upcomingClasses?.length || 0,
      icon: Video,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Payments",
      value: payments?.length || 0,
      icon: CreditCard,
      color: "text-accent-foreground",
      bgColor: "bg-accent/20",
    },
  ];

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "Student"}!
          </h2>
          <p className="text-muted-foreground">
            Continue your musical journey. Here's what's happening.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Enrolled Courses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif">My Courses</CardTitle>
              <Link to="/student/courses">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {enrollments?.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No courses enrolled yet</p>
                  <Button variant="hero" size="sm" asChild>
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {enrollments?.slice(0, 3).map((enrollment: any) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {enrollment.courses?.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Enrolled {format(new Date(enrollment.enrolled_at), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Classes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif">Upcoming Classes</CardTitle>
              <Link to="/student/classes">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingClasses?.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No upcoming classes scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingClasses?.slice(0, 3).map((cls: any) => (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <Video className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{cls.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(cls.scheduled_at), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                      {cls.meet_link && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(cls.meet_link, "_blank")}
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
