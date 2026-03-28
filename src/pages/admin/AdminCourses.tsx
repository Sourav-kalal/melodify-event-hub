import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCourseImage } from "@/lib/courseImages";

const AdminCourses = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "Beginner",
    upiPrice: "",
    googleFormLink: "",
    whatsappNumber: "",
    instructorId: "none",
  });

  const { data: instructors } = useQuery({
    queryKey: ["admin-instructors"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/userroles`, {
        headers: { 'Authorization': `Bearer ${user?.access_token}` }
      });
      const data = await response.json();
      return data.filter((role: any) => role.role === 'instructor').map((r: any) => r.user);
    },
    enabled: !!user,
  });

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-all-courses"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses`, {
        headers: { 'Authorization': `Bearer ${user?.access_token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch courses");
      return response.json();
    },
    enabled: !!user,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        },
        body: JSON.stringify({ isActive: !isActive })
      });
      if (!response.ok) throw new Error("Failed to update course status");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-courses"] });
      toast.success("Course status updated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update course status");
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = editingCourse
        ? `${import.meta.env.VITE_API_URL}/api/courses/${editingCourse.id}`
        : `${import.meta.env.VITE_API_URL}/api/courses`;
      const method = editingCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to save course");
      return response.json();
    },
    onSuccess: async (data) => {
      if (formData.instructorId && formData.instructorId !== 'none') {
        try {
          await fetch(`${import.meta.env.VITE_API_URL}/api/instructorcourses`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user?.access_token}`
            },
            body: JSON.stringify({
              instructor: { id: formData.instructorId },
              course: { id: data.id }
            })
          });
        } catch (e) {
          console.error("Failed to assign instructor", e);
        }
      }
      queryClient.invalidateQueries({ queryKey: ["admin-all-courses"] });
      toast.success(editingCourse ? "Course updated" : "Course created");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save course");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`
        }
      });
      if (!response.ok) throw new Error("Failed to delete course");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-courses"] });
      toast.success("Course deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete course");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      level: "Beginner",
      upiPrice: "",
      googleFormLink: "",
      whatsappNumber: "",
      instructorId: "none",
    });
    setEditingCourse(null);
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      level: course.level,
      upiPrice: course.upiPrice?.toString() || "",
      googleFormLink: course.googleFormLink || "",
      whatsappNumber: course.whatsappNumber || "",
      instructorId: "none",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      title: formData.title,
      description: formData.description,
      level: formData.level,
      upiPrice: formData.upiPrice ? parseFloat(formData.upiPrice) : null,
      googleFormLink: formData.googleFormLink || null,
      whatsappNumber: formData.whatsappNumber || null,
    });
  };

  return (
    <DashboardLayout title="Manage Courses">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              Add, edit, or remove courses from the platform.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-serif">
                  {editingCourse ? "Edit Course" : "Add New Course"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => setFormData({ ...formData, level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.upiPrice}
                      onChange={(e) => setFormData({ ...formData, upiPrice: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="formLink">Google Form Link</Label>
                  <Input
                    id="formLink"
                    type="url"
                    value={formData.googleFormLink}
                    onChange={(e) => setFormData({ ...formData, googleFormLink: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="instructor">Assign Instructor (Admin Only)</Label>
                  <Select
                    value={formData.instructorId}
                    onValueChange={(value) => setFormData({ ...formData, instructorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {instructors?.map((inst: any) => (
                        <SelectItem key={inst.id} value={inst.id}>
                          {inst.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number (optional override)</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="+91..."
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" variant="hero" className="flex-1">
                    {editingCourse ? "Update" : "Create"} Course
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className={!course.isActive ? "opacity-60" : ""}>
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={course.imageUrl || getCourseImage(course.title)}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{course.title}</h3>
                      <Badge variant="outline" className="mt-1">
                        {course.level}
                      </Badge>
                    </div>
                    <Badge variant={course.isActive ? "default" : "secondary"}>
                      {course.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {course.upiPrice && (
                    <p className="text-primary font-semibold mb-3">
                      ₹{Number(course.upiPrice).toLocaleString("en-IN")}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(course)}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMutation.mutate({ id: course.id, isActive: course.isActive })}
                    >
                      {course.isActive ? (
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
                        if (confirm("Delete this course?")) {
                          deleteMutation.mutate(course.id);
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

export default AdminCourses;
