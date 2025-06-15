
import React, { useState, useRef } from 'react';
import { Upload, Wand2, Download, Sparkles, Camera, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
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
        setResultImage(null);
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
          setResultImage(null);
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
    
    // Simulate AI processing
    setTimeout(() => {
      // For demo purposes, we'll show the same image with a filter effect
      setResultImage(selectedImage);
      setIsProcessing(false);
      toast({
        title: "Hoàn thành!",
        description: "Ảnh thời trang của bạn đã được tạo thành công",
      });
    }, 3000);
  };

  const downloadResult = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `fashion-${selectedStyle}-${Date.now()}.jpg`;
      link.click();
    }
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
                  Tạo ảnh thời trang
                </div>
              )}
            </Button>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Kết quả
              </h2>
              
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                {isProcessing ? (
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-700">Đang xử lý...</p>
                      <p className="text-sm text-gray-500">AI đang tạo ảnh thời trang cho bạn</p>
                    </div>
                  </div>
                ) : resultImage ? (
                  <div className="w-full h-full relative">
                    <img
                      src={resultImage}
                      alt="Result"
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                      style={{
                        filter: selectedStyle === 'vintage' ? 'sepia(0.5) contrast(1.2)' :
                               selectedStyle === 'modern' ? 'contrast(1.1) brightness(1.1)' :
                               selectedStyle === 'gothic' ? 'contrast(1.3) brightness(0.8)' :
                               'none'
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        onClick={downloadResult}
                        size="sm"
                        className="bg-white/90 text-purple-600 hover:bg-white shadow-lg"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Ảnh thời trang sẽ xuất hiện tại đây</p>
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
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
