import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Calendar, Users, Video, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("google_linked") === "true") {
      toast.success("Google Calendar account linked successfully!");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { data: assignedCourses } = useQuery({
    queryKey: ["instructor-courses", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/my`, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch courses");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: upcomingClasses } = useQuery({
    queryKey: ["instructor-classes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/classes/my`, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch classes");
      const data = await response.json();
      return data.slice(0, 5);
    },
    enabled: !!user,
  });

  const stats = [
    {
      title: "Assigned Courses",
      value: assignedCourses?.length || 0,
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Upcoming Classes",
      value: upcomingClasses?.length || 0,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Students",
      value: "-",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <DashboardLayout title="Instructor Dashboard">
      <div className="space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Welcome, {user?.user_metadata?.full_name?.split(" ")[0] || "Instructor"}!
          </h2>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-muted-foreground">
              Manage your courses and connect with your students.
            </p>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={async () => {
                try {
                  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google/url`, {
                    headers: {
                      'Authorization': `Bearer ${user?.access_token}`
                    }
                  });
                  const data = await response.json();
                  if (data.url) window.location.href = data.url;
                } catch (error) {
                  console.error("Failed to get Google auth URL", error);
                }
              }}
            >
              <Video className="w-4 h-4" />
              Connect Google Calendar
            </Button>
          </div>
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

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* My Courses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif">My Courses</CardTitle>
              <Link to="/instructor/courses">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {assignedCourses?.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No courses assigned yet. Contact admin for course assignment.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignedCourses?.slice(0, 4).map((course: any) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {course.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course.level}
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
              <Link to="/instructor/schedule">
                <Button variant="ghost" size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Schedule
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingClasses?.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No classes scheduled</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/instructor/schedule">Schedule a Class</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingClasses?.map((cls: any) => (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Video className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{cls.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(cls.scheduledAt), "MMM d, h:mm a")} • {cls.course?.title}
                          </p>
                        </div>
                      </div>
                      {cls.meetLink && (
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={() => window.open(cls.meetLink, "_blank")}
                        >
                          Start
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

export default InstructorDashboard;
