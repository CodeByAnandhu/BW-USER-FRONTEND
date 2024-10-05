"'use client'";

import { useState, useEffect } from "'react'";
import { useRouter } from "'next/navigation'";
import { images } from "'@/app/lib/api'";
import ImageGrid from "'../components/ImageGrid'";
import UploadForm from "'../components/UploadForm'";
import { toast } from "@/components/ui/use-toast";

export function DashboardJsx() {
  const [imageList, setImageList] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await images.getAll();
      console.log("response", response);
      setImageList(response.data);
      setHasChanges(false);
    } catch (error) {
      console.error("'Error fetching images:'", error);
    }
  };

  const handleReorder = (newOrder) => {
    setImageList(newOrder);
    setHasChanges(true);
  };

  const handleSaveOrder = async () => {
    try {
      // Assuming your API has a method to update the order
      await images.updateOrder(imageList.map(img => img.id));
      setHasChanges(false);
      toast({
        title: "Order Saved",
        description: "Your new image order has been saved successfully.",
      });
    } catch (error) {
      console.error("'Error saving image order:'", error);
      toast({
        title: "Error",
        description: "Failed to save the new image order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("'token'");
    document.cookie = "'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'";
    router.push("'/auth/login'");
  };

  return (
    (<div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Images</h1>
        <div className="space-x-4">
          {hasChanges && (
            <button
              onClick={handleSaveOrder}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Save Order
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
      <UploadForm onUploadSuccess={fetchImages} />
      <div className="mt-8">
        <ImageGrid imageList={imageList} onReorder={handleReorder} />
      </div>
    </div>)
  );
}