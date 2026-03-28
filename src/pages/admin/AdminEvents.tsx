import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";

const AdminEvents = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        eventDate: "",
        bannerUrl: "",
        googleFormLink: "",
    });

    const { data: events, isLoading } = useQuery({
        queryKey: ["admin-all-events"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
                headers: { 'Authorization': `Bearer ${user?.access_token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch events");
            return response.json();
        },
        enabled: !!user,
    });

    const toggleMutation = useMutation({
        mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.access_token}`
                },
                body: JSON.stringify({ isActive: !isActive })
            });
            if (!response.ok) throw new Error("Failed to update event status");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-all-events"] });
            toast.success("Event status updated");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update event status");
        },
    });

    const saveMutation = useMutation({
        mutationFn: async (data: any) => {
            const url = editingEvent
                ? `${import.meta.env.VITE_API_URL}/api/events/${editingEvent.id}`
                : `${import.meta.env.VITE_API_URL}/api/events`;
            const method = editingEvent ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.access_token}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error("Failed to save event");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-all-events"] });
            toast.success(editingEvent ? "Event updated" : "Event created");
            setIsDialogOpen(false);
            resetForm();
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to save event");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user?.access_token}`
                }
            });
            if (!response.ok) throw new Error("Failed to delete event");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-all-events"] });
            toast.success("Event deleted");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete event");
        },
    });

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            eventDate: "",
            bannerUrl: "",
            googleFormLink: "",
        });
        setEditingEvent(null);
    };

    const handleEdit = (event: any) => {
        setEditingEvent(event);
        setFormData({
            name: event.name,
            description: event.description || "",
            eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : "",
            bannerUrl: event.bannerUrl || "",
            googleFormLink: event.googleFormLink || "",
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate({
            name: formData.name,
            description: formData.description,
            eventDate: formData.eventDate,
            bannerUrl: formData.bannerUrl || null,
            googleFormLink: formData.googleFormLink || null,
        });
    };

    return (
        <DashboardLayout title="Manage Events">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-muted-foreground">
                            Add, edit, or remove events from the platform.
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button variant="hero">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="font-serif">
                                    {editingEvent ? "Edit Event" : "Add New Event"}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="eventDate">Event Date & Time</Label>
                                    <Input
                                        id="eventDate"
                                        type="datetime-local"
                                        value={formData.eventDate}
                                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="bannerUrl">Banner URL</Label>
                                    <Input
                                        id="bannerUrl"
                                        type="url"
                                        value={formData.bannerUrl}
                                        onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="googleFormLink">Google Form Link</Label>
                                    <Input
                                        id="googleFormLink"
                                        type="url"
                                        value={formData.googleFormLink}
                                        onChange={(e) => setFormData({ ...formData, googleFormLink: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" variant="hero" className="flex-1">
                                        {editingEvent ? "Update" : "Create"} Event
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Events Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events?.map((event: any, index: number) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <Card className={!event.isActive ? "opacity-60" : ""}>
                                <div className="aspect-video overflow-hidden rounded-t-lg bg-muted flex items-center justify-center">
                                    {event.bannerUrl ? (
                                        <img
                                            src={event.bannerUrl}
                                            alt={event.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Calendar className="w-12 h-12 text-muted-foreground/20" />
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-foreground">{event.name}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(event.eventDate).toLocaleDateString("en-IN", {
                                                    weekday: "short",
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        <Badge variant={event.isActive ? "default" : "secondary"}>
                                            {event.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleEdit(event)}
                                        >
                                            <Pencil className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleMutation.mutate({ id: event.id, isActive: event.isActive })}
                                        >
                                            {event.isActive ? (
                                                <ToggleRight className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => {
                                                if (confirm("Delete this event?")) {
                                                    deleteMutation.mutate(event.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminEvents;
