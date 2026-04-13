import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type AppRole = "admin" | "instructor" | "student" | null;

export interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    date_of_birth: string;
    gender: string;
    father_name: string;
    mother_name: string;
    phone_number: string;
    address: string;
    avatar_url: string;
  };
  access_token?: string;
}

interface AuthContextType {
  user: User | null;
  role: AppRole;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  isStudent: boolean;
  signOut: () => Promise<void>;
  checkAuth: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  const decodeToken = (token: string) => {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Token decoding failed", e);
      return null;
    }
  };

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("sandystereo_token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({
          id: decoded.sub,
          email: decoded.email,
          user_metadata: {
            full_name: decoded.fullName || "",
            date_of_birth: decoded.dateOfBirth || "",
            gender: decoded.gender || "",
            father_name: decoded.fatherName || "",
            mother_name: decoded.motherName || "",
            phone_number: decoded.phoneNumber || "",
            address: decoded.address || "",
            avatar_url: decoded.avatarUrl || "",
          },
          access_token: token,
        });
        const roles = decoded.roles || [];
        setRole(roles[0]?.toLowerCase() as AppRole);
      } else {
        localStorage.removeItem("sandystereo_token");
        setUser(null);
        setRole(null);
      }
    } else {
      setUser(null);
      setRole(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signOut = async () => {
    localStorage.removeItem("sandystereo_token");
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: role === "admin",
        isInstructor: role === "instructor",
        isStudent: role === "student",
        signOut,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
