import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse, useToggleCourseActive } from "@/hooks/useCoursesApi";
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
import { CourseLevel } from "@/integrations/backend/types";

const AdminCourses = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: CourseLevel.BEGINNER,
    upiPrice: "",
    googleFormLink: "",
    whatsappNumber: "",
  });

  const { data: courses, isLoading } = useCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const toggleActive = useToggleCourseActive();

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await toggleActive.mutateAsync({ id, isActive: !isActive });
      toast.success("Course status updated");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to update course status");
    }
  };

  const handleSave = async () => {
    try {
      const courseData = {
        ...formData,
        upiPrice: formData.upiPrice ? Number(formData.upiPrice) : undefined,
        isActive: editingCourse?.isActive ?? true,
      };

      if (editingCourse) {
        await updateCourse.mutateAsync({
          id: editingCourse.id,
          course: courseData,
        });
        toast.success("Course updated successfully");
      } else {
        await createCourse.mutateAsync(courseData);
        toast.success("Course created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to save course");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse.mutateAsync(id);
        toast.success("Course deleted");
      } catch (error: any) {
        console.error("Error:", error);
        toast.error("Failed to delete course");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      level: CourseLevel.BEGINNER,
      upiPrice: "",
      googleFormLink: "",
      whatsappNumber: "",
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
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
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
                      onValueChange={(value) => setFormData({ ...formData, level: value as CourseLevel })}
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
              <Card className={!course.is_active ? "opacity-60" : ""}>
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={course.image_url || getCourseImage(course.title)}
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
                    <Badge variant={course.is_active ? "default" : "secondary"}>
                      {course.is_active ? "Active" : "Inactive"}
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
                      onClick={() => handleToggleActive(course.id, course.isActive)}
                    >
                      {course.is_active ? (
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
                          handleDelete(course.id);
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
