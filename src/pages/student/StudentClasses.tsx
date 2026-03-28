import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Video, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isFuture, parseISO } from "date-fns";

const StudentClasses = () => {
    const { user } = useAuth();

    const { data: upcomingClasses, isLoading } = useQuery({
        queryKey: ["student-classes-full", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/classes/student/my`, {
                headers: {
                    'Authorization': `Bearer ${user.access_token}`
                }
            });
            if (!response.ok) throw new Error("Failed to fetch classes");
            return response.json();
        },
        enabled: !!user,
    });

    return (
        <DashboardLayout title="Upcoming Classes">
            <div className="space-y-6">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-muted rounded-xl" />
                                        <div className="space-y-2">
                                            <div className="h-5 bg-muted rounded w-48" />
                                            <div className="h-4 bg-muted rounded w-32" />
                                        </div>
                                    </div>
                                    <div className="h-10 bg-muted rounded w-24" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : upcomingClasses?.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No upcoming classes</h3>
                        <p className="text-muted-foreground">You don't have any classes scheduled at the moment.</p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {upcomingClasses?.map((cls: any) => (
                            <motion.div
                                key={cls.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="hover:border-primary/50 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                                                    <Video className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-lg text-foreground">
                                                        {cls.title}
                                                    </h3>
                                                    <p className="text-sm text-primary font-medium">
                                                        {cls.course?.title}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {format(parseISO(cls.scheduledAt), "EEEE, MMM do")}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {format(parseISO(cls.scheduledAt), "h:mm a")}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {cls.meetLink && (
                                                    <Button
                                                        className="w-full md:w-auto"
                                                        onClick={() => window.open(cls.meetLink, "_blank")}
                                                    >
                                                        Join Now
                                                        <ExternalLink className="w-4 h-4 ml-2" />
                                                    </Button>
                                                )}
                                            </div>
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

export default StudentClasses;
