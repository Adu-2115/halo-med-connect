import React, { createContext, useContext, useState, useEffect } from "react";

// Define user roles
export type UserRole = "admin" | "staff" | "customer";

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Actual users for authentication
const users = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@halomed.com",
    password: "admin123",
    role: "admin" as UserRole,
    avatar: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=100&h=100&auto=format&fit=crop"
  },
  {
    id: "staff-1",
    name: "Staff User",
    email: "staff@halomed.com",
    password: "staff123",
    role: "staff" as UserRole,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop"
  },
  {
    id: "customer-1",
    name: "Customer User",
    email: "customer@halomed.com",
    password: "customer123",
    role: "customer" as UserRole,
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&auto=format&fit=crop"
  }
];

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("halomed_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user", err);
        localStorage.removeItem("halomed_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find matching user
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && 
             u.password === password && 
             u.role === role
    );
    
    if (matchedUser) {
      // Create user session without password
      const { password, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);
      localStorage.setItem("halomed_user", JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    } else {
      setError("Invalid email, password, or user role");
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("halomed_user");
  };

  // Create auth context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
