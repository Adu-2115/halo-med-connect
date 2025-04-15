
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check, AlertCircle, PillIcon, ShieldCheck } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      return;
    }
    
    const success = await login(email, password, role);
    
    if (success) {
      toast.success(`Logged in successfully as ${role}`);
      navigate("/dashboard");
    } else {
      // Error is already handled in AuthContext
    }
  };

  const handleForgotPassword = () => {
    toast.error("Please try again with correct credentials or contact support");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-halomed-50 to-halomed-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <PillIcon className="h-8 w-8 text-halomed-500" />
            <h1 className="text-3xl font-bold text-halomed-700">HaloMed</h1>
          </div>
        </div>
        
        <Card className="border-halomed-100 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-halomed-700">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access the HaloMed pharmacy management system
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="credentials" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
                <TabsTrigger value="demo">Demo Accounts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="credentials">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">User Type</Label>
                    <Select 
                      value={role} 
                      onValueChange={(value) => setRole(value as UserRole)}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">Password</Label>
                      <button 
                        type="button" 
                        onClick={handleForgotPassword}
                        className="text-sm text-halomed-500 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 text-red-500 p-2 rounded-md flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-halomed-500 hover:bg-halomed-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="demo">
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="text-halomed-500 h-5 w-5 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Admin Demo</h3>
                        <p className="text-sm text-muted-foreground">Email: rajesh.sharma@halomed.com</p>
                        <p className="text-sm text-muted-foreground">Password: admin123</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="flex items-start gap-2">
                      <Check className="text-halomed-500 h-5 w-5 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Staff Demo</h3>
                        <p className="text-sm text-muted-foreground">Email: priya.patel@halomed.com</p>
                        <p className="text-sm text-muted-foreground">Password: staff123</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="flex items-start gap-2">
                      <Check className="text-halomed-500 h-5 w-5 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Customer Demo</h3>
                        <p className="text-sm text-muted-foreground">Email: amit.kumar@gmail.com</p>
                        <p className="text-sm text-muted-foreground">Password: customer123</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-center text-muted-foreground">
              By signing in, you agree to HaloMed's Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
