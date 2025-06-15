
import React, { useState } from 'react';
import { Wand2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';
import StyleSelector from '@/components/StyleSelector';
import QuantitySelector from '@/components/QuantitySelector';
import ResultGrid from '@/components/ResultGrid';
import ImageModal from '@/components/ImageModal';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [imageQuantity, setImageQuantity] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImages, setResultImages] = useState<string[]>([]);
  const [expandedImage, setExpandedImage] = useState<{ src: string; index: number } | null>(null);

  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
    setResultImages([]);
  };

  const processImage = async () => {
    if (!selectedImage || !selectedStyle) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn ảnh và phong cách",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing for multiple images
    setTimeout(() => {
      // Generate multiple images based on quantity
      const images = Array.from({ length: imageQuantity }, () => selectedImage);
      setResultImages(images);
      setIsProcessing(false);
      toast({
        title: "Hoàn thành!",
        description: `${imageQuantity} ảnh thời trang đã được tạo thành công`,
      });
    }, 3000);
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `fashion-${selectedStyle}-${index + 1}-${Date.now()}.jpg`;
    link.click();
  };

  const downloadAllImages = () => {
    resultImages.forEach((image, index) => {
      setTimeout(() => downloadImage(image, index), index * 500);
    });
  };

  const openImageModal = (src: string, index: number) => {
    setExpandedImage({ src, index });
  };

  const closeImageModal = () => {
    setExpandedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Fashion Style Transfer
              </h1>
              <p className="text-sm text-gray-600">Biến đổi ảnh thành người mẫu thời trang</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <ImageUpload selectedImage={selectedImage} onImageSelect={handleImageSelect} />
            <StyleSelector selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} />
            <QuantitySelector imageQuantity={imageQuantity} onQuantityChange={setImageQuantity} />

            {/* Process Button */}
            <Button
              onClick={processImage}
              disabled={!selectedImage || !selectedStyle || isProcessing}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Đang xử lý...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  Tạo {imageQuantity} ảnh thời trang
                </div>
              )}
            </Button>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            <ResultGrid
              resultImages={resultImages}
              selectedStyle={selectedStyle}
              isProcessing={isProcessing}
              imageQuantity={imageQuantity}
              onDownloadImage={downloadImage}
              onDownloadAll={downloadAllImages}
              onImageClick={openImageModal}
            />

            {/* Tips */}
            <Card className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3">💡 Gợi ý để có kết quả tốt nhất:</h3>
              <ul className="text-sm text-purple-700 space-y-2">
                <li>• Chọn ảnh có ánh sáng tốt và rõ nét</li>
                <li>• Tránh ảnh quá tối hoặc quá sáng</li>
                <li>• Ảnh chụp toàn thân sẽ cho kết quả tốt hơn</li>
                <li>• Thử nghiệm với nhiều phong cách khác nhau</li>
                <li>• Tạo nhiều ảnh để có nhiều lựa chọn</li>
                <li>• <strong>Nhấp vào ảnh kết quả để xem phóng to</strong></li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        expandedImage={expandedImage}
        selectedStyle={selectedStyle}
        onClose={closeImageModal}
        onDownload={downloadImage}
      />
    </div>
  );
};

export default Index;
