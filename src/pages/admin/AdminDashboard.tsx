import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  Calendar,
  Users,
  CreditCard,
  TrendingUp,
  ArrowRight,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data: coursesCount } = useQuery({
    queryKey: ["admin-courses-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: eventsCount } = useQuery({
    queryKey: ["admin-events-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: usersCount } = useQuery({
    queryKey: ["admin-users-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: paymentsData } = useQuery({
    queryKey: ["admin-payments-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("amount, status")
        .eq("status", "completed");
      if (error) throw error;
      const total = data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      return { total, count: data?.length || 0 };
    },
  });

  const { data: recentPayments } = useQuery({
    queryKey: ["admin-recent-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*, courses(title)")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const stats = [
    {
      title: "Total Courses",
      value: coursesCount || 0,
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/admin/courses",
    },
    {
      title: "Active Events",
      value: eventsCount || 0,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/admin/events",
    },
    {
      title: "Total Users",
      value: usersCount || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/admin/users",
    },
    {
      title: "Revenue",
      value: `₹${(paymentsData?.total || 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-accent-foreground",
      bgColor: "bg-accent/20",
      href: "/admin/payments",
    },
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground">
            Manage courses, events, users, and monitor your platform.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={stat.href}>
                <Card className="hover:shadow-medium transition-shadow cursor-pointer">
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
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-serif">Recent Transactions</CardTitle>
              <Link to="/admin/payments">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentPayments?.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPayments?.map((payment: any) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {payment.courses?.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payment.transaction_reference || "No reference"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ₹{Number(payment.amount).toLocaleString("en-IN")}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            payment.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="hero" className="w-full justify-start" asChild>
                <Link to="/admin/courses">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Manage Courses
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/admin/events">
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Events
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/admin/users">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/admin/settings">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Site Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
