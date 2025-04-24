import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SiteSettings } from "@shared/schema";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [location] = useLocation();

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  const menuItems = [
    { href: "#home", label: "Home" },
    { href: "#streams", label: "Streams" },
    { href: "#announcements", label: "Announcements" },
    { href: "#gallery", label: "Gallery" },
    { href: "#social", label: "Connect" }
  ];

  // Only show navigation on home page
  const isHomePage = location === "/" || location === "";
  const navLinks = isHomePage ? menuItems : [];

  const toggleMobileMenu = () => setIsOpen(!isOpen);

  const scrollToSection = (elementId: string) => {
    setIsOpen(false);
    
    if (!elementId.startsWith('#')) return;
    
    const targetId = elementId.substring(1);
    const element = document.getElementById(targetId);
    
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="bg-dark-light shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-purple">
                  RENNSZ
                </a>
              </Link>
            </div>
            {navLinks.length > 0 && (
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {navLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }}
                    className="relative overflow-hidden text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user?.isAdmin ? (
              <Link href="/admin">
                <Button variant="secondary" className="bg-gradient-to-r from-primary to-accent-purple text-white hover:bg-gradient-to-r hover:from-accent-purple hover:to-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                  Admin Panel
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button variant="secondary" className="bg-gradient-to-r from-primary to-accent-purple text-white hover:bg-gradient-to-r hover:from-accent-purple hover:to-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                  Admin Login
                </Button>
              </Link>
            )}
            <div className="ml-3 md:hidden">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
