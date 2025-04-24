import { Navbar } from "@/components/layout/navbar";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Dashboard } from "@/components/admin/dashboard";
import { StreamsManager } from "@/components/admin/streams-manager";
import { AnnouncementsManager } from "@/components/admin/announcements-manager";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { ThemeSettings } from "@/components/admin/theme-settings";
import { SiteSettingsManager } from "@/components/admin/site-settings";
import { useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Footer } from "@/components/layout/footer";

export default function AdminPage() {
  const [match, params] = useRoute("/admin/:section");
  const section = params?.section || "dashboard";
  const { user } = useAuth();
  
  if (!user || !user.isAdmin) {
    return null; // Protected route should handle this
  }

  // Render content based on current section
  const renderContent = () => {
    switch (section) {
      case "streams":
        return <StreamsManager />;
      case "announcements":
        return <AnnouncementsManager />;
      case "gallery":
        return <GalleryManager />;
      case "theme":
        return <ThemeSettings />;
      case "settings":
        return <SiteSettingsManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col lg:flex-row">
        <AdminSidebar activeSection={section} />
        <main className="flex-grow bg-background p-4 lg:p-6 mt-16 lg:mt-0">
          {renderContent()}
        </main>
      </div>
      <Footer />
    </div>
  );
}
