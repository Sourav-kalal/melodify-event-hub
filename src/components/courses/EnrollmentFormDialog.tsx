import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EnrollmentFormDialogProps {
  courseId: string;
  courseTitle: string;
  children: React.ReactNode;
}

export function EnrollmentFormDialog({ courseId, courseTitle, children }: EnrollmentFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      toast.success("Application submitted successfully!");
      setOpen(false);
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
    } catch (error: any) {
      toast.error(error.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            Admission Form — {courseTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
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

          <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting || !form.gender}>
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
