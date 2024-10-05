import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Pencil, Trash2 } from 'lucide-react';
import EditImageModal from './EditImageModal';
import { images } from '../lib/api';
import { toast } from 'sonner';

const ItemType = 'IMAGE';

function ImageGrid({ imageList, onReorder, onImageUpdate }) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const moveImage = (dragIndex, hoverIndex) => {
    const items = [...imageList];
    const draggedItem = items[dragIndex];
    items.splice(dragIndex, 1);
    items.splice(hoverIndex, 0, draggedItem);
    onReorder(items);
  };

  const handleDelete = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await images.delete(imageId);
        toast.success('Image deleted successfully');
        onImageUpdate(); 
      } catch (error) {
        toast.error('Error deleting image:', error);
        console.error('Error deleting image:', error);
      }
    }
  };

  const handleEdit = (image) => {
    setSelectedImage(image);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (imageId, formData) => {
    const savePromise = () => new Promise(async (resolve, reject) => {
      try {
        await images.update(imageId, formData);
        resolve({ name: 'Image' });
      } catch (error) {
        reject(error);
      }
    });
    
    toast.promise(savePromise(), {
      loading: 'Updating image...',
      success: (data) => `${data.name} updated successfully!`,
      error: (error) => `Error updating image: ${error}`,
    });

    try {
      await savePromise();
      onImageUpdate(); 
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {imageList.map((image, index) => (
          <ImageCard
            key={image._id}
            index={index}
            image={image}
            moveImage={moveImage}
            onEdit={() => handleEdit(image)}
            onDelete={() => handleDelete(image._id)}
          />
        ))}
      </div>
      {selectedImage && (
        <EditImageModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
          image={selectedImage}
          
        />
      )}
    </>
  );
}

function ImageCard({ image, index, moveImage, onEdit, onDelete }) {
  const [, ref] = useDrop({
    accept: ItemType,
    hover(item) {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div 
      ref={(node) => drag(ref(node))} 
      style={{ opacity }} 
      className="relative group"
    >
      <img
        className="h-auto max-w-full rounded-lg transition-opacity duration-300 group-hover:opacity-75"
        src={image.imagePath}
        alt={image.title || 'Image'}
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-sm px-2 py-1 bg-black bg-opacity-50 rounded">
          {image.title || 'Untitled'}
        </p>
      </div>
      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
        >
          <Pencil size={20} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}

export default ImageGrid;