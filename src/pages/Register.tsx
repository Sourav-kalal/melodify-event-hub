import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Music, Eye, EyeOff, Loader2, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!gender) {
        toast.error("Please select your gender");
        throw new Error("Validation failed");
      }

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

      const registerResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          dateOfBirth,
          gender,
          fatherName: fatherName.trim(),
          motherName: motherName.trim(),
          phoneNumber: phoneNumber.trim(),
          address: address.trim(),
          avatarUrl: photo_url
        })
      });

      if (!registerResponse.ok) {
        let errorMsg = "Registration failed";
        try {
          const errorData = await registerResponse.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) { /* ignore */ }
        throw new Error(errorMsg);
      }

      const { accessToken } = await registerResponse.json();
      localStorage.setItem("sandystereo_token", accessToken);

      toast.success("Account created successfully!");
      navigate("/student");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center shadow-soft">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl font-bold text-accent tracking-wide uppercase">
                Sandy's Stereo
              </span>
              <span className="text-[9px] font-medium text-muted-foreground tracking-widest uppercase">
                Music Institute & Event Management
              </span>
            </div>
          </Link>

          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Create your account
          </h1>
          <p className="text-muted-foreground mb-8">
            Join Sandy's Stereo and start your musical journey
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Name of Applicant *</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Gender *</Label>
              <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4" required>
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
                <Label htmlFor="fatherName">Father Name *</Label>
                <Input id="fatherName" value={fatherName} onChange={(e) => setFatherName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="motherName">Mother Name *</Label>
                <Input id="motherName" value={motherName} onChange={(e) => setMotherName(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Address *</Label>
              <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required rows={2} />
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

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-navy items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center relative z-10 max-w-md"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-hero flex items-center justify-center mx-auto mb-8 shadow-glow">
            <Music className="w-16 h-16 text-primary-foreground" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-secondary-foreground mb-4">
            Start Your Musical Journey
          </h2>
          <ul className="text-secondary-foreground/70 text-left space-y-3">
            {[
              "Learn from expert instructors",
              "Access to 9+ music courses",
              "Flexible learning schedule",
              "Join live classes via Google Meet",
              "Certificate upon completion",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-accent" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
