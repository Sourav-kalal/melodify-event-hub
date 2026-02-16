import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Loader2, Upload, ArrowLeft, ArrowRight, CheckCircle2, Copy, IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EnrollmentFormDialogProps {
  courseId: string;
  courseTitle: string;
  coursePrice?: number | null;
  children: React.ReactNode;
}

export function EnrollmentFormDialog({ courseId, courseTitle, coursePrice, children }: EnrollmentFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "payment">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [upiId, setUpiId] = useState<string>("");
  const [transactionRef, setTransactionRef] = useState("");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    applicant_name: "",
    date_of_birth: "",
    gender: "",
    father_name: "",
    mother_name: "",
    email: "",
    phone_number: "",
    address: "",
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Photo must be less than 10MB");
        return;
      }
      setPhotoFile(file);
    }
  };

  const handleFormNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.gender) {
      toast.error("Please select a gender");
      return;
    }
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
      let photo_url: string | null = null;

      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("admission-photos")
          .upload(path, photoFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("admission-photos")
          .getPublicUrl(path);
        photo_url = urlData.publicUrl;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const user_id = sessionData?.session?.user?.id ?? null;

      // Insert admission
      const { error } = await supabase.from("admissions").insert({
        course_id: courseId,
        user_id,
        applicant_name: form.applicant_name.trim(),
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        father_name: form.father_name.trim(),
        mother_name: form.mother_name.trim(),
        email: form.email.trim(),
        phone_number: form.phone_number.trim(),
        address: form.address.trim(),
        photo_url,
        class_mode: form.class_mode,
        preferred_batch: form.class_mode === "offline" ? form.preferred_batch : null,
        referral_code: form.referral_code.trim() || null,
      } as any);

      if (error) throw error;

      // Insert payment record if user is logged in
      if (user_id && coursePrice) {
        await supabase.from("payments").insert({
          user_id,
          course_id: courseId,
          amount: coursePrice,
          transaction_reference: transactionRef.trim(),
          status: "pending",
        } as any);
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
      applicant_name: "",
      date_of_birth: "",
      gender: "",
      father_name: "",
      mother_name: "",
      email: "",
      phone_number: "",
      address: "",
      class_mode: "offline",
      preferred_batch: "",
      referral_code: "",
    });
    setPhotoFile(null);
  };

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
              <Label htmlFor="applicant_name">Name of Applicant *</Label>
              <Input id="applicant_name" required value={form.applicant_name} onChange={(e) => updateField("applicant_name", e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input id="dob" type="date" required value={form.date_of_birth} onChange={(e) => updateField("date_of_birth", e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>Gender *</Label>
              <RadioGroup value={form.gender} onValueChange={(v) => updateField("gender", v)} className="flex gap-4" required>
                {["Male", "Female", "Prefer not to say"].map((g) => (
                  <div key={g} className="flex items-center gap-1.5">
                    <RadioGroupItem value={g} id={`gender-${g}`} />
                    <Label htmlFor={`gender-${g}`} className="text-sm font-normal cursor-pointer">{g}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="father_name">Father Name *</Label>
                <Input id="father_name" required value={form.father_name} onChange={(e) => updateField("father_name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mother_name">Mother Name *</Label>
                <Input id="mother_name" required value={form.mother_name} onChange={(e) => updateField("mother_name", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="enroll_email">Email *</Label>
                <Input id="enroll_email" type="email" required value={form.email} onChange={(e) => updateField("email", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" required value={form.phone_number} onChange={(e) => updateField("phone_number", e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Address *</Label>
              <Textarea id="address" required value={form.address} onChange={(e) => updateField("address", e.target.value)} rows={2} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="photo">Photo (max 10MB)</Label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-md cursor-pointer hover:bg-muted transition-colors text-sm">
                  <Upload className="w-4 h-4" />
                  {photoFile ? photoFile.name : "Choose file"}
                  <input type="file" id="photo" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              </div>
            </div>

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

            <Button type="submit" variant="hero" className="w-full" disabled={!form.gender}>
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
