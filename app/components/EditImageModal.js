import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function EditImageModal({ isOpen, onClose, onSave, image }) {
  const [title, setTitle] = useState(image?.title || '');
  const [newImage, setNewImage] = useState(null);

  if (!isOpen) return null;

  const handleSave = () => {
    const formData = new FormData();
    if (title !== image.title) formData.append('title', title);
    if (newImage) formData.append('image', newImage);
    onSave(image._id, formData);
    setTitle('');
    // setNewImage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Image</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter image title"
            />
          </div>
          
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              New Image (optional)
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) => setNewImage(e.target.files[0])}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          
          <img
            src={image.imagePath}
            alt={image.title || 'Preview'}
            className="w-full h-40 object-cover rounded-md"
          />
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}