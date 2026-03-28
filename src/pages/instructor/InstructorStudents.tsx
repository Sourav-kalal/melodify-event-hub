import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Users, Search, Mail, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const InstructorStudents = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: enrollments, isLoading } = useQuery({
        queryKey: ["instructor-students", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/enrollments/my-students`, {
                headers: {
                    'Authorization': `Bearer ${user.access_token}`
                }
            });
            if (!response.ok) throw new Error("Failed to fetch students");
            return response.json();
        },
        enabled: !!user,
    });

    const filteredEnrollments = enrollments?.filter((enrollment: any) =>
        enrollment.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout title="My Students">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by student name or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : filteredEnrollments?.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No students found</h3>
                        <p className="text-muted-foreground">
                            {searchTerm ? "Try a different search term" : "No students are currently enrolled in your courses."}
                        </p>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Enrolled On</TableHead>
                                        <TableHead>Email</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEnrollments?.map((enrollment: any) => (
                                        <TableRow key={enrollment.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                        {enrollment.user?.fullName?.charAt(0)}
                                                    </div>
                                                    {enrollment.user?.fullName}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                                                    {enrollment.course?.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(enrollment.enrolledAt), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                                    {enrollment.user?.email}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
};

export default InstructorStudents;
