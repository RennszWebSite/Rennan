import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Stream, InsertStream } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, Edit, Trash } from "lucide-react";
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

export function StreamsManager() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<Stream | null>(null);

  const [formData, setFormData] = useState<InsertStream>({
    name: "",
    url: "",
    description: "",
    type: "IRL",
    isFeatured: false
  });

  const { data: streams, isLoading } = useQuery<Stream[]>({
    queryKey: ["/api/streams"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertStream) => {
      const response = await apiRequest("POST", "/api/admin/streams", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["/api/streams"]});
      queryClient.invalidateQueries({queryKey: ["/api/streams/featured"]});
      toast({
        title: "Stream created",
        description: "The stream has been successfully created.",
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error creating stream",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: InsertStream }) => {
      const response = await apiRequest("PUT", `/api/admin/streams/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["/api/streams"]});
      queryClient.invalidateQueries({queryKey: ["/api/streams/featured"]});
      toast({
        title: "Stream updated",
        description: "The stream has been successfully updated.",
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error updating stream",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const setFeaturedMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PUT", `/api/admin/streams/${id}/featured`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["/api/streams"]});
      queryClient.invalidateQueries({queryKey: ["/api/streams/featured"]});
      toast({
        title: "Featured stream updated",
        description: "The featured stream has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error setting featured stream",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/streams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["/api/streams"]});
      queryClient.invalidateQueries({queryKey: ["/api/streams/featured"]});
      toast({
        title: "Stream deleted",
        description: "The stream has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting stream",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      description: "",
      type: "IRL",
      isFeatured: false
    });
    setEditingStream(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isFeatured: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.url || !formData.type) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingStream) {
      updateMutation.mutate({ id: editingStream.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (stream: Stream) => {
    setEditingStream(stream);
    setFormData({
      name: stream.name,
      url: stream.url,
      description: stream.description || "",
      type: stream.type,
      isFeatured: stream.isFeatured
    });
    setIsDialogOpen(true);
  };

  const handleSetFeatured = (id: number) => {
    setFeaturedMutation.mutate(id);
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
        <h2 className="text-2xl font-bold">Manage Streams</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="flex items-center bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Stream
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-dark-light border-gray-700">
            <DialogHeader>
              <DialogTitle>{editingStream ? "Edit Stream" : "Add New Stream"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Stream Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter stream name"
                  className="bg-dark border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Stream URL</Label>
                <Input
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://www.twitch.tv/username"
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
                  placeholder="Enter stream description"
                  className="bg-dark border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Stream Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="bg-dark border-gray-700">
                    <SelectValue placeholder="Select stream type" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-light border-gray-700">
                    <SelectItem value="IRL">IRL</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="isFeatured">Set as featured stream</Label>
              </div>
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
                  {editingStream ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-dark-light rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Streams</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="pb-2">Name</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {streams && streams.length > 0 ? (
                streams.map((stream) => (
                  <tr key={stream.id} className="border-b border-gray-800">
                    <td className="py-3">{stream.name}</td>
                    <td className="py-3">{stream.type}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        stream.isFeatured 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-gray-700 text-gray-300"
                      }`}>
                        {stream.isFeatured ? "Featured" : "Regular"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2 bg-dark border-gray-700 hover:bg-gray-800"
                          onClick={() => handleEdit(stream)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!stream.isFeatured && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-2 bg-dark border-green-700 text-green-500 hover:bg-green-900/30"
                            onClick={() => handleSetFeatured(stream.id)}
                          >
                            Set Featured
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 px-2 bg-dark border-red-700 text-red-500 hover:bg-red-900/30"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-dark-light border-gray-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Stream</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this stream? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-dark border-gray-700 hover:bg-gray-800">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(stream.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400">
                    No streams available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
