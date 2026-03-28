import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { User as UserIcon, Shield, Trash2, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const AdminUsers = () => {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ["admin-all-users"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                headers: { 'Authorization': `Bearer ${currentUser?.access_token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch users");
            return response.json();
        },
        enabled: !!currentUser,
    });

    const { data: userRoles } = useQuery({
        queryKey: ["admin-all-roles"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/userroles`, {
                headers: { 'Authorization': `Bearer ${currentUser?.access_token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch roles");
            return response.json();
        },
        enabled: !!currentUser,
    });

    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/userroles/${userId}/role?role=${role}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${currentUser?.access_token}`
                }
            });
            if (!response.ok) throw new Error("Failed to update user role");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-all-roles"] });
            toast.success("User role updated");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update role");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            if (id === currentUser?.id) throw new Error("Cannot delete yourself");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${currentUser?.access_token}`
                }
            });
            if (!response.ok) throw new Error("Failed to delete user");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-all-users"] });
            toast.success("User deleted");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete user");
        },
    });

    const getUserRole = (userId: string) => {
        return userRoles?.find((ur: any) => ur.user.id === userId)?.role || "student";
    };

    return (
        <DashboardLayout title="Manage Users">
            <div className="space-y-6">
                <div>
                    <p className="text-muted-foreground">
                        View platform users and manage their access levels.
                    </p>
                </div>

                <div className="grid gap-4">
                    {users?.map((user: any) => {
                        const currentRole = getUserRole(user.id);
                        return (
                            <Card key={user.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <UserIcon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                                    {user.fullName || "User"}
                                                    {user.id === currentUser?.id && (
                                                        <Badge variant="outline" className="text-[10px] h-4">You</Badge>
                                                    )}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        {user.email}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        Joined {new Date(user.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-muted-foreground" />
                                                <Select
                                                    value={currentRole}
                                                    onValueChange={(newRole) => updateRoleMutation.mutate({ userId: user.id, role: newRole })}
                                                    disabled={user.id === currentUser?.id}
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                        <SelectItem value="instructor">Instructor</SelectItem>
                                                        <SelectItem value="student">Student</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                disabled={user.id === currentUser?.id}
                                                onClick={() => {
                                                    if (confirm(`Are you sure you want to delete ${user.email}?`)) {
                                                        deleteMutation.mutate(user.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminUsers;
