import { useEffect, useState } from "react";
import { authApi } from "@/integrations/backend/api/auth";
import { AppRole } from "@/integrations/backend/types";

interface DecodedToken {
  sub: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

interface AuthUser {
  id: string;
  email: string;
}

// Simple JWT decoder (you can also use jwt-decode package)
function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser({
          id: decoded.sub,
          email: decoded.email,
        });
        
        // Set first role as the primary role
        const primaryRole = (decoded.roles?.[0] as AppRole) || null;
        setRole(primaryRole);
      } else {
        authApi.logout();
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    authApi.logout();
    setUser(null);
    setRole(null);
  };

  return {
    user,
    role,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: role === AppRole.ADMIN,
    isInstructor: role === AppRole.INSTRUCTOR,
    isStudent: role === AppRole.STUDENT,
    logout,
  };
}
