import React, { useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  selectedImage: string | null;
  onImageSelect: (image: string | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ selectedImage, onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File quá lớn",
          description: "Vui lòng chọn ảnh nhỏ hơn 10MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('DEBUG: Base64 string header:', String(e.target?.result).slice(0, 30));
        onImageSelect(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          console.log('DEBUG (Drop): Base64 string header:', String(event.target?.result).slice(0,30));
          onImageSelect(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Optional: Debug log outside JSX for devs
  if (selectedImage) {
    console.log('DEBUG: Render selectedImage src:', selectedImage.slice(0, 30));
  }

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelect(null);
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Camera className="h-5 w-5 text-purple-600" />
        Tải ảnh lên
      </h2>
      
      <div
        className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {selectedImage ? (
          <div className="relative flex flex-col items-center justify-center space-y-4">
            {/* Bọc ảnh trong div để làm mốc vị trí cho button */}
            <div className="relative inline-block">
              <img
                src={selectedImage}
                alt="Selected"
                className="max-h-64 mx-auto rounded-lg shadow-lg"
              />
              <button
                className="absolute top-0 right-0 z-10 opacity-80 bg-white/80 rounded-full p-1 m-[-10px] translate-x-1/2 -translate-y-1/2 transition hover:bg-red-100 hover:text-red-600 text-gray-500"
                onClick={handleRemoveImage}
                type="button"
                aria-label="Xoá ảnh"
                tabIndex={0}
                style={{
                  boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
                  lineHeight: 0,
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">Nhấp để thay đổi ảnh</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-purple-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Kéo thả ảnh vào đây hoặc nhấp để chọn
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Hỗ trợ JPG, PNG (tối đa 10MB)
              </p>
            </div>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </Card>
  );
};

export default ImageUpload;
