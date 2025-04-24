
import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  Video,
  Megaphone,
  Images,
  Palette,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface AdminSidebarProps {
  activeSection: string;
}

export function AdminSidebar({ activeSection }: AdminSidebarProps) {
  const { logoutMutation } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };
  
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "streams", label: "Streams", icon: <Video className="h-5 w-5" /> },
    { id: "announcements", label: "Announcements", icon: <Megaphone className="h-5 w-5" /> },
    { id: "gallery", label: "Gallery", icon: <Images className="h-5 w-5" /> },
    { id: "theme", label: "Theme", icon: <Palette className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> }
  ];
  
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button 
          variant="outline"
          size="icon"
          className="bg-dark-light border-gray-800"
          onClick={toggleMobileSidebar}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-50 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        transition-transform duration-300 ease-in-out
        h-[100dvh] bg-dark-light border-r border-gray-800
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between min-h-[60px]">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`hidden lg:flex p-1.5 hover:bg-gray-700 rounded-md ${isCollapsed ? 'mx-auto' : ''}`}
              onClick={toggleSidebar}
            >
              {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-grow p-4 overflow-y-auto">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.id}>
                  <Link href={`/admin/${item.id === 'dashboard' ? '' : item.id}`}>
                    <a
                      className={`
                        flex items-center p-3 rounded-md transition-colors
                        ${activeSection === item.id ? 'bg-primary/20 text-white' : 'text-gray-300 hover:bg-primary/10 hover:text-white'}
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <span>{item.icon}</span>
                      {!isCollapsed && <span className="ml-3 text-sm">{item.label}</span>}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <Button 
              variant="ghost" 
              className={`
                w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}
                p-3 text-red-400 hover:bg-red-900/20 rounded-md
              `}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3 text-sm">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
