'use client';

import { useState } from 'react';
import { images } from '@/app/lib/api';
import { toast } from 'sonner';
import { Upload } from 'lucide-react'

export default function UploadForm({ onUploadSuccess }) {
  const [isClickUploadBtn, setIsClickUploadBtn] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [titles, setTitles] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
    const newTitles = {};
    Array.from(e.target.files).forEach((file, index) => {
      newTitles[index] = '';
    });
    setTitles(newTitles);
  };

  const handleTitleChange = (index, value) => {
    setTitles(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    
    const missingTitles = Object.values(titles).some(title => title.trim() === '');
    if (missingTitles) {
      toast.error('Please provide titles for all images.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append('images', file);
    });
    formData.append('titles', JSON.stringify(Object.values(titles)));

    try {
      await images.upload(formData);
      toast.success('Images uploaded successfully');
      onUploadSuccess();
      setSelectedFiles([]);
      setTitles({});
      setIsClickUploadBtn(false);
    } catch (error) {
      toast.error('Error uploading images:', error);
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
    {isClickUploadBtn?<form onSubmit={handleUpload} className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <label htmlFor="file-upload" className="flex justify-between  text-sm font-medium text-gray-700">
          Choose Images <button
      onClick={() => setIsClickUploadBtn(false)}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
    >
      Cancel
    </button>
        </label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
      </div>

      {selectedFiles.map((file, index) => (
        <div key={index} className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 truncate flex-1">{file.name}</span>
          <input
            type="text"
            placeholder="Enter title"
            value={titles[index] || ''}
            onChange={(e) => handleTitleChange(index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      ))}

      {selectedFiles.length > 0 && (
        <button
          type="submit"
          className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
            uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
      )}

      {selectedFiles.length === 0 && !uploading && (
        <p className="text-sm text-center text-gray-500">No files selected</p>
      )}
    </form> : <button
      className="flex px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      onClick={() => setIsClickUploadBtn(true)}
    >
      <Upload className="w-4 h-4 mr-2" />
      Upload Images
    </button>}
    </>
    
  );
}