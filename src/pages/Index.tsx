import React, { useState, useRef } from 'react';
import { Upload, Wand2, Download, Sparkles, Camera, Palette, Hash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [imageQuantity, setImageQuantity] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImages, setResultImages] = useState<string[]>([]);
  const [expandedImage, setExpandedImage] = useState<{ src: string; index: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fashionStyles = [
    { id: 'vintage', name: 'Vintage', description: 'Cổ điển, retro', color: 'from-amber-400 to-orange-500' },
    { id: 'modern', name: 'Modern', description: 'Hiện đại, tối giản', color: 'from-gray-400 to-gray-600' },
    { id: 'casual', name: 'Casual', description: 'Thoải mái, đời thường', color: 'from-blue-400 to-blue-600' },
    { id: 'formal', name: 'Formal', description: 'Trang trọng, lịch sự', color: 'from-purple-400 to-purple-600' },
    { id: 'bohemian', name: 'Bohemian', description: 'Tự do, nghệ thuật', color: 'from-pink-400 to-pink-600' },
    { id: 'gothic', name: 'Gothic', description: 'Bí ẩn, cá tính', color: 'from-gray-700 to-black' },
    { id: 'minimalist', name: 'Minimalist', description: 'Tối giản, tinh tế', color: 'from-green-400 to-green-600' },
    { id: 'street', name: 'Street Style', description: 'Đường phố, năng động', color: 'from-red-400 to-red-600' }
  ];

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
        setSelectedImage(e.target?.result as string);
        setResultImages([]);
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
          setSelectedImage(event.target?.result as string);
          setResultImages([]);
        };
        reader.readAsDataURL(file);
      }
    }
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
                  <div className="space-y-4">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="max-h-64 mx-auto rounded-lg shadow-lg"
                    />
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

            {/* Style Selection */}
            <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-600" />
                Chọn phong cách thời trang
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                {fashionStyles.map((style) => (
                  <div
                    key={style.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all transform hover:scale-105 ${
                      selectedStyle === style.id
                        ? 'ring-2 ring-purple-500 shadow-lg'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedStyle(style.id)}
                  >
                    <div className={`h-16 bg-gradient-to-r ${style.color} rounded-lg mb-3 flex items-center justify-center`}>
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium text-gray-800">{style.name}</h3>
                    <p className="text-xs text-gray-600">{style.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quantity Selection */}
            <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Hash className="h-5 w-5 text-purple-600" />
                Số lượng ảnh ({imageQuantity})
              </h2>
              
              <div className="space-y-4">
                <Slider
                  value={[imageQuantity]}
                  onValueChange={(value) => setImageQuantity(value[0])}
                  max={6}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1 ảnh</span>
                  <span>6 ảnh</span>
                </div>
              </div>
            </Card>

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
            <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Kết quả {resultImages.length > 0 && `(${resultImages.length} ảnh)`}
                </h2>
                {resultImages.length > 1 && (
                  <Button
                    onClick={downloadAllImages}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Tải tất cả
                  </Button>
                )}
              </div>
              
              <div className="min-h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                {isProcessing ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-700">Đang xử lý...</p>
                        <p className="text-sm text-gray-500">AI đang tạo {imageQuantity} ảnh thời trang cho bạn</p>
                      </div>
                    </div>
                  </div>
                ) : resultImages.length > 0 ? (
                  <div className="p-4">
                    <div className={`grid gap-4 ${
                      resultImages.length === 1 ? 'grid-cols-1' :
                      resultImages.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' :
                      'grid-cols-2 lg:grid-cols-3'
                    }`}>
                      {resultImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Result ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg shadow-lg transition-transform group-hover:scale-105 cursor-pointer"
                            style={{
                              filter: selectedStyle === 'vintage' ? 'sepia(0.5) contrast(1.2)' :
                                     selectedStyle === 'modern' ? 'contrast(1.1) brightness(1.1)' :
                                     selectedStyle === 'gothic' ? 'contrast(1.3) brightness(0.8)' :
                                     'none'
                            }}
                            onClick={() => openImageModal(image, index)}
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadImage(image, index);
                              }}
                              size="sm"
                              className="bg-white/90 text-purple-600 hover:bg-white shadow-lg"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            #{index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Ảnh thời trang sẽ xuất hiện tại đây</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

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
      <Dialog open={!!expandedImage} onOpenChange={(open) => !open && closeImageModal()}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-none shadow-none">
          <div className="relative">
            <DialogClose className="absolute -top-10 right-0 z-50 bg-white/90 rounded-full p-2 hover:bg-white transition-colors">
              <X className="h-4 w-4 text-gray-800" />
              <span className="sr-only">Đóng</span>
            </DialogClose>
            
            {expandedImage && (
              <div className="relative">
                <img
                  src={expandedImage.src}
                  alt={`Expanded Result ${expandedImage.index + 1}`}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
                  style={{
                    filter: selectedStyle === 'vintage' ? 'sepia(0.5) contrast(1.2)' :
                           selectedStyle === 'modern' ? 'contrast(1.1) brightness(1.1)' :
                           selectedStyle === 'gothic' ? 'contrast(1.3) brightness(0.8)' :
                           'none'
                  }}
                />
                
                {/* Image info and download */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">Ảnh #{expandedImage.index + 1}</p>
                    <p className="text-sm text-gray-300">Phong cách: {selectedStyle}</p>
                  </div>
                  <Button
                    onClick={() => downloadImage(expandedImage.src, expandedImage.index)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
