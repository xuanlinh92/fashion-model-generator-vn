
import React from 'react';
import { Download, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ImageModalProps {
  expandedImage: { src: string; index: number } | null;
  selectedStyle: string;
  onClose: () => void;
  onDownload: (imageUrl: string, index: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  expandedImage,
  selectedStyle,
  onClose,
  onDownload,
}) => {
  return (
    <Dialog open={!!expandedImage} onOpenChange={(open) => !open && onClose()}>
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
              
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium">Ảnh #{expandedImage.index + 1}</p>
                  <p className="text-sm text-gray-300">Phong cách: {selectedStyle}</p>
                </div>
                <Button
                  onClick={() => onDownload(expandedImage.src, expandedImage.index)}
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
  );
};

export default ImageModal;
