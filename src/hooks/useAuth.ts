import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "admin" | "instructor" | "student" | null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer role fetch to avoid blocking
          setTimeout(async () => {
            const { data } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id)
              .maybeSingle();
            
            setRole(data?.role as AppRole ?? null);
          }, 0);
        } else {
          setRole(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            setRole(data?.role as AppRole ?? null);
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return {
    user,
    role,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: role === "admin",
    isInstructor: role === "instructor",
    isStudent: role === "student",
    signOut,
  };
}
