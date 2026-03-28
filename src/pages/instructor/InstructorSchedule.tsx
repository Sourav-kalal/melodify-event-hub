import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Video, Clock, Plus, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const InstructorSchedule = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [courseId, setCourseId] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [useGoogleMeet, setUseGoogleMeet] = useState(true);

    const { data: courses } = useQuery({
        queryKey: ["instructor-courses-short", user?.id],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses`, {
                headers: { 'Authorization': `Bearer ${user?.access_token}` }
            });
            return response.json();
        },
        enabled: !!user,
    });

    const { data: classes, isLoading } = useQuery({
        queryKey: ["instructor-schedule", user?.id],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/classes/my`, {
                headers: { 'Authorization': `Bearer ${user?.access_token}` }
            });
            return response.json();
        },
        enabled: !!user,
    });

    const createClassMutation = useMutation({
        mutationFn: async (newClass: any) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/classes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.access_token}`
                },
                body: JSON.stringify(newClass)
            });
            if (!response.ok) throw new Error("Failed to create class");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instructor-schedule"] });
            toast.success("Class scheduled successfully!");
            setIsDialogOpen(false);
            resetForm();
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });

    const deleteClassMutation = useMutation({
        mutationFn: async (classId: string) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/classes/${classId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user?.access_token}`
                }
            });
            if (!response.ok) throw new Error("Failed to delete class");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instructor-schedule"] });
            toast.success("Class deleted successfully!");
        }
    });

    const resetForm = () => {
        setTitle("");
        setCourseId("");
        setScheduledAt("");
        setUseGoogleMeet(true);
    };

    const handleSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !courseId || !scheduledAt) {
            toast.error("Please fill in all required fields");
            return;
        }

        createClassMutation.mutate({
            title,
            course: { id: courseId },
            scheduledAt: new Date(scheduledAt).toISOString(),
            // Backend handles meet link generation if we pass a flag or just detect instructor preference
            // For now let's assume if they want it, we send something the backend reacts to
            // Backend implementation currently creates Google Meet if instructor has tokens
        });
    };

    return (
        <DashboardLayout title="Class Schedule">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Upcoming Classes
                    </h2>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Schedule Class
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Schedule a New Class</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSchedule} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Class Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Introduction to Guitar"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="course">Select Course</Label>
                                    <Select value={courseId} onValueChange={setCourseId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {courses?.map((course: any) => (
                                                <SelectItem key={course.id} value={course.id}>
                                                    {course.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="scheduledAt">Date & Time</Label>
                                    <Input
                                        id="scheduledAt"
                                        type="datetime-local"
                                        value={scheduledAt}
                                        onChange={(e) => setScheduledAt(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <div className="space-y-0.5">
                                        <Label>Google Meet</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Generate a Meet link for this class
                                        </p>
                                    </div>
                                    <Switch
                                        checked={useGoogleMeet}
                                        onCheckedChange={setUseGoogleMeet}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={createClassMutation.isPending}>
                                    {createClassMutation.isPending ? "Scheduling..." : "Schedule Class"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : classes?.length === 0 ? (
                    <Card className="p-12 text-center text-muted-foreground">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No classes scheduled yet.</p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {classes?.map((cls: any) => (
                            <motion.div
                                key={cls.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Video className="w-6 h-6 text-primary" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold text-lg">{cls.title}</h3>
                                                    <p className="text-sm text-primary">{cls.course?.title}</p>
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
                                                        variant="hero"
                                                        size="sm"
                                                        onClick={() => window.open(cls.meetLink, "_blank")}
                                                    >
                                                        Join <ExternalLink className="w-4 h-4 ml-1" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => {
                                                        if (window.confirm("Are you sure you want to delete this class?")) {
                                                            deleteClassMutation.mutate(cls.id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
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

export default InstructorSchedule;
