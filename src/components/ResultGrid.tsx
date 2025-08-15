
import React from 'react';
import { Sparkles, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ResultGridProps {
  resultImages: string[];
  selectedStyle: string;
  isProcessing: boolean;
  imageQuantity: number;
  onDownloadImage: (imageUrl: string, index: number) => void;
  onDownloadAll: () => void;
  onImageClick: (src: string, index: number) => void;
}

const ResultGrid: React.FC<ResultGridProps> = ({
  resultImages,
  selectedStyle,
  isProcessing,
  imageQuantity,
  onDownloadImage,
  onDownloadAll,
  onImageClick,
}) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Kết quả {resultImages.length > 0 && `(${resultImages.length} ảnh)`}
        </h2>
        {resultImages.length > 1 && (
          <Button
            onClick={onDownloadAll}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Tải tất cả
          </Button>
        )}
      </div>
      
      <div className="min-h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl relative">
        {isProcessing ? (
          <div className="absolute inset-0 flex items-center justify-center">
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
                <div key={index} className="relative group flex justify-center items-center bg-white rounded-lg shadow-lg min-h-[240px] min-w-[150px]">
                  <img
                    src={image}
                    alt={`Result ${index + 1}`}
                    className="max-w-full max-h-[350px] object-contain rounded-lg transition-transform group-hover:scale-105 cursor-pointer bg-gray-100"
                    style={{
                      background: "#f3f4f6",
                      display: "block",
                      margin: "auto",
                      filter: selectedStyle === 'vintage' ? 'sepia(0.5) contrast(1.2)' :
                             selectedStyle === 'modern' ? 'contrast(1.1) brightness(1.1)' :
                             selectedStyle === 'gothic' ? 'contrast(1.3) brightness(0.8)' :
                             'none'
                    }}
                    onClick={() => onImageClick(image, index)}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadImage(image, index);
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
          // Căn giữa icon và text cả dọc lẫn ngang, chiếm toàn bộ height khung kết quả
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center pointer-events-none">
            <Sparkles className="h-16 w-16 mb-4 text-gray-400" />
            <p className="text-base text-gray-500">Ảnh thời trang sẽ xuất hiện tại đây</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResultGrid;

