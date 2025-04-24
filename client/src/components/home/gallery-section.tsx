import { useQuery } from "@tanstack/react-query";
import { GalleryImage } from "@shared/schema";
import { Loader2 } from "lucide-react";

export function GallerySection() {
  const { data: images, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  if (isLoading) {
    return (
      <section id="gallery" className="py-16 bg-dark-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Travel Gallery</h2>
            <p className="mt-4 text-xl text-gray-300">Highlights from our luxury destinations</p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (!images || images.length === 0) {
    return (
      <section id="gallery" className="py-16 bg-dark-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Travel Gallery</h2>
            <p className="mt-4 text-xl text-gray-300">No images available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-16 bg-dark-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Travel Gallery</h2>
          <p className="mt-4 text-xl text-gray-300">Highlights from our luxury destinations</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="relative group overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <img 
                src={image.imageUrl} 
                alt={image.title} 
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4">
                  <h3 className="text-white font-bold">{image.title}</h3>
                  <p className="text-gray-300 text-sm">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
