import { HeroSection } from "@/components/home/hero-section";
import { StreamsSection } from "@/components/home/streams-section";
import { AnnouncementsSection } from "@/components/home/announcements-section";
import { GallerySection } from "@/components/home/gallery-section";
import { SocialConnectSection } from "@/components/home/social-connect-section";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <StreamsSection />
        <AnnouncementsSection />
        <GallerySection />
        <SocialConnectSection />
      </main>
      <Footer />
    </div>
  );
}
