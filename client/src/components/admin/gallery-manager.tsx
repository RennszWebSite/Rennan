import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GalleryImage, InsertGalleryImage } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit, Trash, Image } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function GalleryManager() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  const [formData, setFormData] = useState<InsertGalleryImage>({
    title: "",
    description: "",
    imageUrl: "",
    category: "Travel Destinations"
  });

  const { data: images, isLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertGalleryImage) => {
      const response = await apiRequest("POST", "/api/admin/gallery", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["/api/gallery"]});
      toast({
        title: "Image added",
        description: "The image has been successfully added to the gallery.",
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error adding image",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: InsertGalleryImage }) => {
      const response = await apiRequest("PUT", `/api/admin/gallery/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["/api/gallery"]});
      toast({
        title: "Image updated",
        description: "The gallery image has been successfully updated.",
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error updating image",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["/api/gallery"]});
      toast({
        title: "Image deleted",
        description: "The image has been successfully removed from the gallery.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting image",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      category: "Travel Destinations"
    });
    setEditingImage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.imageUrl || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingImage) {
      updateMutation.mutate({ id: editingImage.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description || "",
      imageUrl: image.imageUrl,
      category: image.category
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Gallery</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="flex items-center bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-dark-light border-gray-700">
            <DialogHeader>
              <DialogTitle>{editingImage ? "Edit Gallery Image" : "Add New Gallery Image"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Image Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter image title"
                  className="bg-dark border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter image description"
                  className="bg-dark border-gray-700"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="bg-dark border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="bg-dark border-gray-700">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-light border-gray-700">
                    <SelectItem value="Travel Destinations">Travel Destinations</SelectItem>
                    <SelectItem value="Luxury Accommodations">Luxury Accommodations</SelectItem>
                    <SelectItem value="Streaming Equipment">Streaming Equipment</SelectItem>
                    <SelectItem value="Behind the Scenes">Behind the Scenes</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.imageUrl && (
                <div className="mt-2">
                  <Label className="text-sm text-gray-400 mb-2 block">Preview</Label>
                  <div className="relative h-32 w-full overflow-hidden rounded-md border border-gray-700">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="h-full w-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjMjEyMTIxIi8+CjxwYXRoIGQ9Ik01Ni42NjY3IDg2LjY2NjdMNzAuMDAwMSA3My4zMzM0TDgzLjMzMzQgODYuNjY2N0w5Ni42NjY3IDczLjMzMzQiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEwNi42NjcgNjBINTMuMzMzM0M0OC45MTEgNjAgNDUuMzMzMyA2My41Nzc3IDQ1LjMzMzMgNjhWOTJDNDUuMzMzMyA5Ni40MjIzIDQ4LjkxMSAxMDAgNTMuMzMzMyAxMDBIMTA2LjY2N0MxMTEuMDg5IDEwMCAxMTQuNjY3IDk2LjQyMjMgMTE0LjY2NyA5MlY2OEMxMTQuNjY3IDYzLjU3NzcgMTExLjA4OSA2MCAxMDYuNjY3IDYwWiIgc3Ryb2tlPSIjNkI3MjgwIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K";
                      }}
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                  className="bg-dark border-gray-700 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {editingImage ? "Update" : "Add to Gallery"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-dark-light rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Gallery Images</h3>
        
        {images && images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="rounded-md overflow-hidden">
                  <img 
                    src={image.imageUrl} 
                    alt={image.title} 
                    className="h-32 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjMjEyMTIxIi8+CjxwYXRoIGQ9Ik01Ni42NjY3IDg2LjY2NjdMNzAuMDAwMSA3My4zMzM0TDgzLjMzMzQgODYuNjY2N0w5Ni42NjY3IDczLjMzMzQiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEwNi42NjcgNjBINTMuMzMzM0M0OC45MTEgNjAgNDUuMzMzMyA2My41Nzc3IDQ1LjMzMzMgNjhWOTJDNDUuMzMzMyA5Ni40MjIzIDQ4LjkxMSAxMDAgNTMuMzMzMyAxMDBIMTA2LjY2N0MxMTEuMDg5IDEwMCAxMTQuNjY3IDk2LjQyMjMgMTE0LjY2NyA5MlY2OEMxMTQuNjY3IDYzLjU3NzcgMTExLjA4OSA2MCAxMDYuNjY3IDYwWiIgc3Ryb2tlPSIjNkI3MjgwIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K";
                    }}
                  />
                </div>
                <div className="mt-1">
                  <h4 className="text-sm font-medium truncate">{image.title}</h4>
                  <p className="text-xs text-gray-400">{image.category}</p>
                </div>
                <div className="absolute inset-0 bg-dark/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
                    onClick={() => handleEdit(image)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/20 rounded-full"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-dark-light border-gray-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Image</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this image? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-dark border-gray-700 hover:bg-gray-800">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDelete(image.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Image className="h-16 w-16 mb-4 text-gray-500" />
            <p className="text-lg font-medium">No images in gallery</p>
            <p className="text-sm mt-1">Add images to showcase luxury destinations and experiences</p>
          </div>
        )}
      </div>
    </div>
  );
}
