import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Stream, SiteSettings } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    Twitch?: {
      Embed: new (elementId: string, options: any) => any;
    };
  }
}

export function HeroSection() {
  const { data: featuredStream, isLoading: isLoadingStream } = useQuery<Stream>({
    queryKey: ["/api/streams/featured"],
  });

  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  const [isStreamLoaded, setIsStreamLoaded] = useState(false);
  const [isStreamOffline, setIsStreamOffline] = useState(false);
  const twitchEmbedRef = useRef<HTMLDivElement>(null);
  const twitchPlayerRef = useRef<any>(null);

  // Load Twitch embed API
  useEffect(() => {
    if (!window.Twitch) {
      const script = document.createElement("script");
      script.src = "https://embed.twitch.tv/embed/v1.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  // Initialize Twitch embed when featuredStream is available
  useEffect(() => {
    if (featuredStream && window.Twitch && twitchEmbedRef.current) {
      const channelName = featuredStream.url.split("/").pop();
      
      if (!channelName) {
        setIsStreamOffline(true);
        return;
      }

      try {
        if (twitchPlayerRef.current) {
          twitchPlayerRef.current.setChannel(channelName);
        } else {
          twitchPlayerRef.current = new window.Twitch.Embed(twitchEmbedRef.current.id, {
            width: "100%",
            height: "100%",
            channel: channelName,
            parent: [window.location.hostname],
            layout: "video"
          });

          twitchPlayerRef.current.addEventListener(window.Twitch.Embed.VIDEO_READY, () => {
            setIsStreamLoaded(true);
          });
          
          twitchPlayerRef.current.addEventListener(window.Twitch.Embed.OFFLINE, () => {
            setIsStreamOffline(true);
          });
        }
      } catch (error) {
        console.error("Error initializing Twitch player:", error);
        setIsStreamOffline(true);
      }
    }
  }, [featuredStream, window.Twitch]);

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="bg-gradient-to-b from-dark to-primary/20 absolute inset-0 z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-secondary">Explore the World with</span>
            <span className="block mt-2 text-5xl md:text-7xl text-secondary">RENNSZ</span>
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Join the adventure as we travel to luxury destinations around the globe. Experience premium travel streaming like never before.
          </p>
          <div className="mt-8 flex justify-center">
            <Button className="bg-gradient-to-r from-primary to-accent-purple text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              Watch Live Now
            </Button>
            <a href="#streams" 
              className="ml-4 px-8 py-3 text-lg font-medium border border-secondary text-secondary rounded-full hover:bg-secondary/10 transition-colors duration-300 flex items-center"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('streams')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              All Streams
            </a>
          </div>
        </div>
        
        {/* Featured Stream */}
        <div className="bg-dark-light rounded-xl overflow-hidden shadow-2xl border border-primary/30">
          <div className="aspect-video relative">
            {isLoadingStream ? (
              <div className="absolute inset-0 flex items-center justify-center bg-dark/50">
                <Loader2 className="h-12 w-12 animate-spin text-secondary" />
              </div>
            ) : isStreamOffline ? (
              <div className="absolute inset-0 flex items-center justify-center bg-dark/50">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg text-gray-300">Stream is currently offline</p>
                </div>
              </div>
            ) : (
              <>
                {!isStreamLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-dark/50 z-10">
                    <Loader2 className="h-12 w-12 animate-spin text-secondary" />
                  </div>
                )}
                <div 
                  id="featured-stream" 
                  ref={twitchEmbedRef} 
                  className="w-full h-full"
                ></div>
              </>
            )}
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{featuredStream?.name || "Stream loading..."}</h2>
                <p className="text-gray-400">{featuredStream?.description || "Loading stream information..."}</p>
              </div>
              <div className="flex items-center">
                {!isStreamOffline && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-white">
                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                    LIVE
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
