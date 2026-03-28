import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Loader2, ArrowLeft, ArrowRight, CheckCircle2, Copy, IndianRupee, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface EnrollmentFormDialogProps {
  courseId: string;
  courseTitle: string;
  coursePrice?: number | null;
  children: React.ReactNode;
}

export function EnrollmentFormDialog({ courseId, courseTitle, coursePrice, children }: EnrollmentFormDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "payment">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upiId, setUpiId] = useState<string>("");
  const [transactionRef, setTransactionRef] = useState("");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    class_mode: "offline",
    preferred_batch: "",
    referral_code: "",
  });

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "upi_id")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.setting_value) setUpiId(data.setting_value);
      });
  }, []);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.class_mode === "offline" && !form.preferred_batch) {
      toast.error("Please select a batch");
      return;
    }
    setStep("payment");
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const upiPayLink = upiId && coursePrice
    ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("Sandy's Stereo")}&am=${coursePrice}&cu=INR&tn=${encodeURIComponent(`Admission: ${courseTitle}`)}`
    : "";

  const handleSubmit = async () => {
    if (!transactionRef.trim()) {
      toast.error("Please enter the UPI transaction reference");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user) {
        toast.error("Please log in first");
        return;
      }

      // Insert admission via Backend API
      const admissionResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          course: { id: courseId },
          user: { id: user.id },
          applicantName: user.user_metadata.full_name || "",
          dateOfBirth: user.user_metadata.date_of_birth || new Date().toISOString().split('T')[0],
          gender: user.user_metadata.gender || "Prefer not to say",
          fatherName: user.user_metadata.father_name || "N/A",
          motherName: user.user_metadata.mother_name || "N/A",
          email: user.email,
          phoneNumber: user.user_metadata.phone_number || "0000000000",
          address: user.user_metadata.address || "N/A",
          photoUrl: user.user_metadata.avatar_url || "",
          classMode: form.class_mode,
          preferredBatch: form.class_mode === "offline" ? form.preferred_batch : null,
          referralCode: form.referral_code.trim() || null,
          status: "pending"
        })
      });

      if (!admissionResponse.ok) throw new Error("Failed to submit admission");

      // Insert payment record via Backend API
      if (coursePrice) {
        const paymentResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.access_token}`
          },
          body: JSON.stringify({
            user: { id: user.id },
            course: { id: courseId },
            amount: coursePrice,
            transactionReference: transactionRef.trim(),
            status: "pending"
          })
        });

        if (!paymentResponse.ok) throw new Error("Failed to submit payment");
      }

      toast.success("Application & payment submitted successfully! We'll verify your payment shortly.");
      resetAndClose();
    } catch (error: any) {
      toast.error(error.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setOpen(false);
    setStep("form");
    setTransactionRef("");
    setForm({
      class_mode: "offline",
      preferred_batch: "",
      referral_code: "",
    });
  };

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-md text-center py-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="font-serif text-2xl mb-2">Login Required</DialogTitle>
          <p className="text-muted-foreground mb-6">You must create an account or sign in before you can apply for admission.</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAndClose(); else setOpen(true); }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {step === "form" ? `Admission Form — ${courseTitle}` : "Complete UPI Payment"}
          </DialogTitle>
        </DialogHeader>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`flex items-center gap-1.5 text-xs font-medium ${step === "form" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === "form" ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"}`}>
              {step === "payment" ? <CheckCircle2 className="w-4 h-4" /> : "1"}
            </div>
            Details
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className={`flex items-center gap-1.5 text-xs font-medium ${step === "payment" ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              2
            </div>
            Payment
          </div>
        </div>

        {step === "form" ? (
          <form onSubmit={handleFormNext} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Class Mode *</Label>
              <RadioGroup value={form.class_mode} onValueChange={(v) => updateField("class_mode", v)} className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="online" id="mode-online" />
                  <Label htmlFor="mode-online" className="text-sm font-normal cursor-pointer">Online</Label>
                </div>
                <div className="flex items-center gap-1.5">
                  <RadioGroupItem value="offline" id="mode-offline" />
                  <Label htmlFor="mode-offline" className="text-sm font-normal cursor-pointer">Offline</Label>
                </div>
              </RadioGroup>
            </div>

            {form.class_mode === "offline" && (
              <div className="space-y-1.5">
                <Label>Pick a Suitable Batch *</Label>
                <RadioGroup value={form.preferred_batch} onValueChange={(v) => updateField("preferred_batch", v)} className="flex flex-col gap-2" required>
                  {["4pm - 5pm", "5pm - 6pm", "6pm - 7pm"].map((batch) => (
                    <div key={batch} className="flex items-center gap-1.5">
                      <RadioGroupItem value={batch} id={`batch-${batch}`} />
                      <Label htmlFor={`batch-${batch}`} className="text-sm font-normal cursor-pointer">{batch}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="referral">Referral Code (optional)</Label>
              <Input id="referral" value={form.referral_code} onChange={(e) => updateField("referral_code", e.target.value)} />
            </div>

            <Button type="submit" variant="hero" className="w-full">
              <ArrowRight className="w-4 h-4" />
              Proceed to Payment
            </Button>
          </form>
        ) : (
          <div className="space-y-5">
            {/* Payment amount */}
            {coursePrice && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
                <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
                <div className="flex items-center justify-center gap-1">
                  <IndianRupee className="w-7 h-7 text-primary" />
                  <span className="text-4xl font-bold text-primary">
                    {coursePrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">for {courseTitle}</p>
              </div>
            )}

            {/* UPI ID */}
            {upiId && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Pay via UPI</Label>
                <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
                  <span className="font-mono text-sm flex-1 text-foreground">{upiId}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={handleCopyUpi} className="shrink-0">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}

            {/* UPI deep link button */}
            {upiPayLink && (
              <a
                href={upiPayLink}
                className="flex items-center justify-center gap-2 w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors"
              >
                <IndianRupee className="w-5 h-5" />
                Pay with UPI App
              </a>
            )}

            {/* Instructions */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">How to pay:</p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Open any UPI app (GPay, PhonePe, Paytm, etc.)</li>
                <li>Send ₹{coursePrice?.toLocaleString("en-IN")} to the UPI ID above</li>
                <li>Copy the <strong>Transaction Reference / UTR number</strong> from the payment confirmation</li>
                <li>Paste it below and submit</li>
              </ol>
            </div>

            {/* Transaction ref input */}
            <div className="space-y-1.5">
              <Label htmlFor="txn_ref" className="font-semibold">Transaction Reference / UTR Number *</Label>
              <Input
                id="txn_ref"
                required
                placeholder="e.g. 431234567890"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                You'll find this in your UPI app's payment confirmation screen.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep("form")} className="flex-1">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                type="button"
                variant="hero"
                onClick={handleSubmit}
                disabled={isSubmitting || !transactionRef.trim()}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
