import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import StudentClasses from "./pages/student/StudentClasses";
import StudentPayments from "./pages/student/StudentPayments";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import InstructorSchedule from "./pages/instructor/InstructorSchedule";
import InstructorStudents from "./pages/instructor/InstructorStudents";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/courses"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/classes"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/payments"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentPayments />
              </ProtectedRoute>
            }
          />

          {/* Instructor Routes */}
          <Route
            path="/instructor"
            element={
              <ProtectedRoute allowedRoles={["instructor"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/courses"
            element={
              <ProtectedRoute allowedRoles={["instructor"]}>
                <InstructorCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/schedule"
            element={
              <ProtectedRoute allowedRoles={["instructor"]}>
                <InstructorSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor/students"
            element={
              <ProtectedRoute allowedRoles={["instructor"]}>
                <InstructorStudents />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
