import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { CreditCard, Search, CheckCircle2, Clock, XCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminPayments = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: payments, isLoading } = useQuery({
        queryKey: ["admin-all-payments"],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
                headers: { 'Authorization': `Bearer ${user?.access_token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch payments");
            return response.json();
        },
        enabled: !!user,
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.access_token}`
                },
                body: JSON.stringify({ status })
            });
            if (!response.ok) throw new Error("Failed to update payment status");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-all-payments"] });
            toast.success("Payment status updated");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update status");
        },
    });

    const filteredPayments = payments?.filter((payment: any) =>
        payment.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionReference?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
            case "pending":
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case "failed":
                return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <DashboardLayout title="Payment Records">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-muted-foreground">
                            Monitor and manage all course transactions.
                        </p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by email, course, or reference..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-20">Loading payments...</div>
                    ) : filteredPayments?.length === 0 ? (
                        <div className="text-center py-20 bg-card rounded-lg border border-dashed border-border">
                            <CreditCard className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                            <p className="text-muted-foreground">No payments found</p>
                        </div>
                    ) : (
                        <div className="bg-card rounded-lg border border-border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50 border-b border-border">
                                            <th className="p-4 font-semibold text-sm">User & Course</th>
                                            <th className="p-4 font-semibold text-sm">Amount</th>
                                            <th className="p-4 font-semibold text-sm">Reference</th>
                                            <th className="p-4 font-semibold text-sm">Date</th>
                                            <th className="p-4 font-semibold text-sm">Status</th>
                                            <th className="p-4 font-semibold text-sm w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPayments?.map((payment: any) => (
                                            <tr key={payment.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                                                <td className="p-4">
                                                    <p className="font-medium text-foreground">{payment.user?.email}</p>
                                                    <p className="text-xs text-muted-foreground">{payment.course?.title}</p>
                                                </td>
                                                <td className="p-4 font-semibold">
                                                    ₹{Number(payment.amount).toLocaleString("en-IN")}
                                                </td>
                                                <td className="p-4 text-sm font-mono text-muted-foreground">
                                                    {payment.transactionReference || "N/A"}
                                                </td>
                                                <td className="p-4 text-sm text-muted-foreground">
                                                    {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </td>
                                                <td className="p-4">
                                                    {getStatusBadge(payment.status)}
                                                </td>
                                                <td className="p-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: payment.id, status: "completed" })}>
                                                                Mark as Completed
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: payment.id, status: "pending" })}>
                                                                Mark as Pending
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive" onClick={() => updateStatusMutation.mutate({ id: payment.id, status: "failed" })}>
                                                                Mark as Failed
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminPayments;
