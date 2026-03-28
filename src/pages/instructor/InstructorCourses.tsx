import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Search, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const InstructorCourses = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: courses, isLoading } = useQuery({
        queryKey: ["instructor-courses-full", user?.id],
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

    const filteredCourses = courses?.filter((course: any) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout title="My Assigned Courses">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
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
                ) : filteredCourses?.length === 0 ? (
                    <Card className="p-12 text-center">
                        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                        <p className="text-muted-foreground">
                            {searchTerm ? "Try a different search term" : "You haven't been assigned any courses yet."}
                        </p>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses?.map((course: any) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                    {course.imageUrl && (
                                        <img
                                            src={course.imageUrl}
                                            alt={course.title}
                                            className="w-full h-40 object-cover"
                                        />
                                    )}
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                                                {course.level}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{course.duration || "N/A"}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link to={`/instructor/schedule?courseId=${course.id}`}>
                                                    <Calendar className="w-4 h-4 mr-2" /> Schedule
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link to={`/instructor/students?courseId=${course.id}`}>
                                                    <Users className="w-4 h-4 mr-2" /> Students
                                                </Link>
                                            </Button>
                                        </div>
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

export default InstructorCourses;
