import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const StudentCourses = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: enrollments, isLoading } = useQuery({
        queryKey: ["student-enrollments-full", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/enrollments/my`, {
                headers: {
                    'Authorization': `Bearer ${user.access_token}`
                }
            });
            if (!response.ok) throw new Error("Failed to fetch enrollments");
            return response.json();
        },
        enabled: !!user,
    });

    const filteredEnrollments = enrollments?.filter((enrollment: any) =>
        enrollment.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout title="My Courses">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search your courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Link to="/courses">
                        <Button variant="hero" size="sm">
                            Browse More Courses
                        </Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <div className="h-40 bg-muted rounded-t-xl" />
                                <CardContent className="p-6 space-y-4">
                                    <div className="h-6 bg-muted rounded w-3/4" />
                                    <div className="h-4 bg-muted rounded w-1/2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredEnrollments?.length === 0 ? (
                    <Card className="p-12 text-center">
                        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                        <p className="text-muted-foreground mb-6">
                            {searchTerm ? "Try a different search term" : "You haven't enrolled in any courses yet."}
                        </p>
                        {!searchTerm && (
                            <Button asChild>
                                <Link to="/courses">Browse Courses</Link>
                            </Button>
                        )}
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEnrollments?.map((enrollment: any) => (
                            <motion.div
                                key={enrollment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                    {enrollment.course?.imageUrl && (
                                        <img
                                            src={enrollment.course.imageUrl}
                                            alt={enrollment.course.title}
                                            className="w-full h-40 object-cover"
                                        />
                                    )}
                                    <CardHeader>
                                        <CardTitle className="line-clamp-1">{enrollment.course?.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Enrolled on {format(new Date(enrollment.enrolledAt), "PPP")}
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <Link to={`/courses/${enrollment.course?.id}`}>
                                            <Button className="w-full" variant="outline">
                                                View Course Details
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StudentCourses;
