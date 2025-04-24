import { useQuery } from "@tanstack/react-query";
import { Stream } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { FaTwitch } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function StreamsSection() {
  const { data: streams, isLoading } = useQuery<Stream[]>({
    queryKey: ["/api/streams"],
  });

  if (isLoading) {
    return (
      <section id="streams" className="py-16 bg-dark-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Stream Channels</h2>
            <p className="mt-4 text-xl text-gray-300">Check out both RENNSZ channels for different content</p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (!streams || streams.length === 0) {
    return (
      <section id="streams" className="py-16 bg-dark-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Stream Channels</h2>
            <p className="mt-4 text-xl text-gray-300">No streams available at the moment</p>
          </div>
        </div>
      </section>
    );
  }

  const getStreamImage = (type: string) => {
    if (type.toLowerCase() === 'gaming') {
      return "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    } else {
      return "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    }
  };

  const getBadgeColor = (type: string) => {
    if (type.toLowerCase() === 'gaming') {
      return "bg-accent-purple";
    } else {
      return "bg-primary";
    }
  };

  return (
    <section id="streams" className="py-16 bg-dark-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Stream Channels</h2>
          <p className="mt-4 text-xl text-gray-300">Check out both RENNSZ channels for different content</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {streams.map((stream) => (
            <div key={stream.id} className="bg-dark rounded-xl overflow-hidden shadow-lg border border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-video relative">
                <img src={getStreamImage(stream.type)} alt={stream.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(stream.type)} text-white`}>
                    {stream.type} Channel
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{stream.name}</h3>
                <p className="mt-2 text-gray-400">{stream.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <a 
                    href={stream.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-accent-teal hover:text-accent-teal/80 font-medium flex items-center"
                  >
                    <FaTwitch className="mr-2" /> Follow on Twitch
                  </a>
                  <Button className={`px-4 py-2 ${
                    stream.type.toLowerCase() === 'gaming' 
                      ? 'bg-gradient-to-r from-accent-purple to-primary hover:from-primary hover:to-accent-purple' 
                      : 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary'
                    } text-white rounded-md transition-all duration-300`}
                    onClick={() => window.open(stream.url, '_blank')}
                  >
                    Watch Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
