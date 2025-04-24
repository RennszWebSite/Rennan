import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaLock } from "react-icons/fa";

export default function AuthPage() {
  const [password, setPassword] = useState("");

  const { user, loginMutation, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ password });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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
            
            <form onSubmit={handleLoginSubmit} className="space-y-6 mt-8">
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock />
                  </span>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={handlePasswordChange}
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
                Access Admin Panel
              </Button>
              
              <p className="text-sm text-center text-gray-400 mt-4">
                (Default password: admin123)
              </p>
            </form>
          </div>
          
          {/* Right Section - Hero/Info */}
          <div className="w-full lg:w-1/2 p-8 bg-gradient-to-br from-primary/20 via-dark-light to-accent-purple/20 hidden lg:block">
            <div className="h-full flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-white">Welcome to the</span>
                <span className="block mt-2 text-secondary">RENNSZ Admin Portal</span>
              </h2>
              
              <p className="text-lg text-gray-300 mb-8">
                Access the control panel to manage your streaming website. Update streams, announcements, gallery images, and customize the site's appearance.
              </p>
              
              <Card className="bg-dark/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-secondary">Site Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>✓ Manage live stream channels</p>
                  <p>✓ Post and edit announcements</p>
                  <p>✓ Curate the image gallery</p>
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
