import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FaLock, FaUserCircle } from "react-icons/fa";
import { LoginCredentials } from "@shared/schema";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [loginData, setLoginData] = useState<LoginCredentials>({
    username: "",
    password: ""
  });
  
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  const { user, loginMutation, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? "/admin" : "/");
    }
  }, [user, navigate]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Registration is purposely not implemented since we only
    // want the admin user to be able to log in with predetermined credentials
    
    // Show message that registration is disabled
    alert("New user registration is currently disabled. Please use the provided admin credentials to log in.");
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="flex flex-col lg:flex-row w-full max-w-7xl rounded-lg overflow-hidden shadow-xl">
          {/* Left Section - Auth Form */}
          <div className="w-full lg:w-1/2 p-8 bg-dark-light">
            <h1 className="text-3xl font-bold mb-6 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-purple">
                RENNSZ Admin Access
              </span>
            </h1>
            
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaUserCircle />
                      </span>
                      <Input
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={loginData.username}
                        onChange={handleLoginInputChange}
                        className="pl-10 bg-dark border-gray-700"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaLock />
                      </span>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={handleLoginInputChange}
                        className="pl-10 bg-dark border-gray-700"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full gradient-btn"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Sign In
                  </Button>
                  
                  <p className="text-sm text-center text-gray-400 mt-4">
                    (Hint: Use admin/Rennsz5842 for access)
                  </p>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-username">Username</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaUserCircle />
                      </span>
                      <Input
                        id="reg-username"
                        name="username"
                        placeholder="Choose a username"
                        value={registerData.username}
                        onChange={handleRegisterInputChange}
                        className="pl-10 bg-dark border-gray-700"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaLock />
                      </span>
                      <Input
                        id="reg-password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={handleRegisterInputChange}
                        className="pl-10 bg-dark border-gray-700"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaLock />
                      </span>
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterInputChange}
                        className="pl-10 bg-dark border-gray-700"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full gradient-btn"
                  >
                    Create Account
                  </Button>
                  
                  <p className="text-sm text-center text-gray-400 mt-4">
                    Registration is currently limited to authorized personnel only.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Section - Hero/Info */}
          <div className="w-full lg:w-1/2 p-8 bg-gradient-to-br from-primary/20 via-dark-light to-accent-purple/20 hidden lg:block">
            <div className="h-full flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-white">Welcome to the</span>
                <span className="block mt-2 text-secondary">RENNSZ Admin Portal</span>
              </h2>
              
              <p className="text-lg text-gray-300 mb-8">
                Access the control panel to manage your luxury travel streaming website. Update streams, announcements, gallery images, and customize the site's appearance.
              </p>
              
              <Card className="bg-dark/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-secondary">Site Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>✓ Manage live stream channels</p>
                  <p>✓ Post and edit announcements</p>
                  <p>✓ Curate the travel gallery</p>
                  <p>✓ Customize site themes and colors</p>
                  <p>✓ Update social media links</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
