'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { images } from '@/app/lib/api';
import ImageGrid from '../components/ImageGrid';
import UploadForm from '../components/UploadForm';  
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';

export default function DashboardPage() {
  const [imageList, setImageList] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await images.getAll();
      setImageList(response.data);
      setHasChanges(false);
    } catch (error) {
      toast.error('Error fetching images:', error);
      console.error('Error fetching images:', error);
    }
  };

  const handleReorder = (newOrder) => {
    setImageList(newOrder);
    setHasChanges(true);
  };

  const handleSaveOrder = async () => {
    try {
      const imageOrders = imageList.map((image, index) => ({
        imageId: image._id,
        newOrder: index
      }));
      await images.reorder(imageOrders);
      toast.success('Image order saved successfully');
      setHasChanges(false);
    } catch (error) {
      toast.error('Error saving image order:', error);
      console.error('Error saving image order:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/auth/login');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-8 font-poppins">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 font-poppins">Gallery</h1>
          <div className="space-x-4 flex items-center justify-center">
            {hasChanges && (
              <button
                onClick={handleSaveOrder}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-400 bg-white border border-emerald-200-200 rounded-md shadow-sm hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
              >
                Save Order
              </button>
            )}
            <button
      onClick={handleLogout}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </button>
          </div>
        </div>
        
        <UploadForm onUploadSuccess={fetchImages} />
        
        <div className="mt-8">
          {imageList.length > 0 ? (
            <ImageGrid 
              imageList={imageList} 
              onReorder={handleReorder}
              onImageUpdate={fetchImages}
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-2xl font-light text-gray-600 mb-4">
                Your gallery is empty
              </p>
              <p className="text-gray-500">
                Upload your first image to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}