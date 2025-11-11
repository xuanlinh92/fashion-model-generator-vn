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

const N8N_WEBHOOK_URL = "https://auto.workflowfree.com/webhook/4f6511ec-1368-4a92-bf43-52b78ddee93b";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80";

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

  // --- HÀM GỬI WEBHOOK VÀ NHẬN KẾT QUẢ TRỰC TIẾP ---
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
    setResultImages([]);

    const waitingToast = toast({
      title: "Đang xử lý...",
      description: "AI đang tạo ảnh thời trang cho bạn, vui lòng chờ trong giây lát.",
    });

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedImage,
          style: selectedStyle,
          quantity: imageQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Webhook trả về lỗi");
      }

      // Parse response safely (supports JSON, text, base64 image or URL)
      const contentType = response.headers.get("content-type") || "";
      let data: any = null;
      let rawText = "";
      try {
        if (contentType.includes("application/json")) {
          data = await response.json();
        } else {
          rawText = await response.text();
        }
      } catch (parseErr) {
        try {
          rawText = await response.clone().text();
        } catch {}
      }
      console.log("[DEBUG] webhook rawText:", rawText?.slice(0, 200));
      console.log("[DEBUG] webhook data:", data);

      let webhookArray: any[] = [];

      const pushFromData = (d: any) => {
        if (Array.isArray(d?.data)) {
          webhookArray = d.data;
        } else if (Array.isArray(d)) {
          webhookArray = d;
        } else if (typeof d?.data === "object" && d.data !== null) {
          webhookArray = [d.data];
        } else if (typeof d === "object" && d !== null) {
          webhookArray = [d];
        }
      };

      if (data !== null) {
        pushFromData(data);
      } else {
        const trimmed = (rawText || "").trim();
        if (!trimmed) {
          throw new Error("Webhook trả về rỗng (empty body)");
        }
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          try {
            const parsed = JSON.parse(trimmed);
            pushFromData(parsed);
          } catch (e) {
            throw new Error("Webhook trả về JSON không hợp lệ");
          }
        } else if (/^data:image/i.test(trimmed) || /^https?:\/\//i.test(trimmed)) {
          webhookArray = [trimmed];
        } else {
          throw new Error("Webhook trả về định dạng không hỗ trợ");
        }
      }

      if (!Array.isArray(webhookArray) || webhookArray.length === 0) {
        throw new Error("Không tìm thấy ảnh trong phản hồi webhook");
      }

      const prefix = "data:image";
      let images: string[] = [];

      // NEW: flatten mọi ảnh xuất hiện trong object/mảng lồng nhau
      const extractImages = (item: any): string[] => {
        let arr: string[] = [];
        if (!item) return arr;
        // Nếu là string
        if (typeof item === "string") {
          arr.push(item.trim());
        }
        // Nếu là array lồng - đệ quy
        else if (Array.isArray(item)) {
          item.forEach((sub) => {
            arr = arr.concat(extractImages(sub));
          });
        }
        // Nếu là object
        else if (typeof item === "object") {
          // Lặp qua các trường phổ biến có thể chứa ảnh
          ["Image", "image", "url", "base64", "data", "images", "output"].forEach((field) => {
            if (item[field]) {
              arr = arr.concat(extractImages(item[field]));
            }
          });
        }
        return arr;
      };

      // Lấy tất cả ảnh từ toàn bộ array
      images = webhookArray.flatMap((item) => extractImages(item));

      // Xử lý prefix cho từng ảnh
      images = images.map((imgStr, idx) => {
        // Remove repeated base64 prefix nếu có
        while (
          imgStr.startsWith("data:image") &&
          imgStr.slice(20, 36).includes("data:image")
        ) {
          const repPos = imgStr.indexOf("data:image", 10);
          if (repPos > 0) imgStr = imgStr.slice(repPos);
          else break;
        }
        const isPublicUrl = /^https?:\/\//i.test(imgStr);
        let displayImg = imgStr;
        if (!isPublicUrl) {
          displayImg = imgStr.startsWith(prefix) ? imgStr : "data:image/png;base64," + imgStr;
        }
        // Log
        console.log(`[DEBUG][array] Ảnh [${idx}]:`, displayImg ? displayImg.substring(0, 40) : "EMPTY", "(length:", displayImg.length, ")");
        // Kiểm tra hợp lệ
        if (
          (!displayImg || displayImg.length < 100) ||
          (!isPublicUrl && !displayImg.startsWith(prefix))
        ) {
          toast({
            title: "Ảnh trả về lỗi",
            description: `Ảnh #${idx + 1} từ webhook không hợp lệ, dùng ảnh thay thế.`,
            variant: "destructive",
          });
          return PLACEHOLDER_IMAGE;
        }
        return displayImg;
      });

      setResultImages(images);

      waitingToast.dismiss();

      toast({
        title: "Hoàn thành!",
        description: `${images.length} ảnh thời trang đã được tạo thành công`,
      });
    } catch (err: any) {
      console.error(err);
      waitingToast.dismiss();
      toast({
        title: "Lỗi",
        description: `Không thể nhận kết quả từ webhook: ${err?.message || 'Lỗi không xác định'}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `fashion-${selectedStyle}-${index + 1}-${Date.now()}.png`;
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
