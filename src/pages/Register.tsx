import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Music, Eye, EyeOff, Loader2, GraduationCap, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type UserRole = "student" | "instructor";

const roles: { id: UserRole; title: string; description: string; icon: React.ElementType }[] = [
  {
    id: "student",
    title: "Student",
    description: "Learn music from expert instructors",
    icon: GraduationCap,
  },
  {
    id: "instructor",
    title: "Instructor",
    description: "Teach and share your expertise",
    icon: Users,
  },
];

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"role" | "details">("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("details");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Insert user role
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: data.user.id,
          role: selectedRole,
        });

        if (roleError) throw roleError;

        toast.success("Account created successfully!");

        // Redirect based on role
        if (selectedRole === "instructor") {
          navigate("/instructor");
        } else {
          navigate("/student");
        }
      }
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
            <span className="font-serif text-xl font-semibold text-foreground">
              Sangeet Academy
            </span>
          </Link>

          {step === "role" ? (
            <>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Join Sangeet Academy
              </h1>
              <p className="text-muted-foreground mb-8">
                Select your role to get started
              </p>

              <div className="space-y-4">
                {roles.map((role) => (
                  <motion.button
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(role.id)}
                    className={cn(
                      "w-full p-6 rounded-2xl border-2 text-left transition-all duration-300",
                      "hover:border-primary hover:shadow-medium",
                      "border-border bg-card"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <role.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {role.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <p className="text-center text-muted-foreground mt-8 text-sm">
                Admin accounts are created by administrators only.
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep("role")}
                className="text-muted-foreground hover:text-foreground mb-4 text-sm"
              >
                ← Back to role selection
              </button>

              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Create your account
              </h1>
              <p className="text-muted-foreground mb-8">
                Registering as{" "}
                <span className="text-primary font-medium capitalize">
                  {selectedRole}
                </span>
              </p>

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
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
            </>
          )}

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
