import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, History, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const StudentPayments = () => {
    const { user } = useAuth();

    const { data: payments, isLoading } = useQuery({
        queryKey: ["student-payments-full", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/my`, {
                headers: {
                    'Authorization': `Bearer ${user.access_token}`
                }
            });
            if (!response.ok) throw new Error("Failed to fetch payments");
            return response.json();
        },
        enabled: !!user,
    });

    return (
        <DashboardLayout title="Payment History">
            <div className="space-y-6">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : payments?.length === 0 ? (
                    <Card className="p-12 text-center">
                        <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No payment history</h3>
                        <p className="text-muted-foreground">You haven't made any payments yet.</p>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments?.map((payment: any) => (
                                        <TableRow key={payment.id}>
                                            <TableCell className="font-medium">
                                                {payment.course?.title}
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(payment.createdAt), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                ₹{payment.amount}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {payment.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    Details
                                                </Button>
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

export default StudentPayments;
