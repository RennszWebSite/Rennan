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
      {/* Mobile sidebar toggle button */}
      <div className="md:hidden fixed top-20 left-4 z-30">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-10 h-10 rounded-full bg-dark-light border border-gray-800 p-2"
          onClick={toggleMobileSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 
        h-screen bg-dark-light border-r border-gray-800
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`p-1.5 hover:bg-gray-700 rounded-md ${isCollapsed ? 'mx-auto' : ''}`}
              onClick={toggleSidebar}
            >
              {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-grow p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.id}>
                  <Link href={`/admin/${item.id === 'dashboard' ? '' : item.id}`}>
                    <a
                      className={`
                        flex items-center p-2 rounded-md transition-colors
                        ${activeSection === item.id ? 'bg-primary/20 text-white' : 'text-gray-300 hover:bg-primary/10 hover:text-white'}
                      `}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <span className={isCollapsed ? 'mx-auto' : ''}>{item.icon}</span>
                      {!isCollapsed && <span className="ml-3">{item.label}</span>}
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
                w-full flex items-center justify-${isCollapsed ? 'center' : 'start'} 
                p-2 text-red-400 hover:bg-red-900/20
              `}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
