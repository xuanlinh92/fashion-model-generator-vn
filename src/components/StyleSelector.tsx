
import React from 'react';
import { Palette } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

const fashionStyles = [
  { id: 'vintage', name: 'Vintage', description: 'Cổ điển, retro' },
  { id: 'modern', name: 'Modern', description: 'Hiện đại, tối giản' },
  { id: 'casual', name: 'Casual', description: 'Thoải mái, đời thường' },
  { id: 'formal', name: 'Formal', description: 'Trang trọng, lịch sự' },
  { id: 'bohemian', name: 'Bohemian', description: 'Tự do, nghệ thuật' },
  { id: 'gothic', name: 'Gothic', description: 'Bí ẩn, cá tính' },
  { id: 'minimalist', name: 'Minimalist', description: 'Tối giản, tinh tế' },
  { id: 'street', name: 'Street Style', description: 'Đường phố, năng động' }
];

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange }) => {
  const getSelectedStyleName = () => {
    const style = fashionStyles.find(s => s.id === selectedStyle);
    return style ? `${style.name} - ${style.description}` : '';
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Palette className="h-5 w-5 text-purple-600" />
        Chọn phong cách thời trang
      </h2>
      
      <Select value={selectedStyle} onValueChange={onStyleChange}>
        <SelectTrigger className="w-full h-12 bg-white border-purple-200 focus:ring-purple-500">
          <SelectValue placeholder="Chọn phong cách thời trang..." />
        </SelectTrigger>
        <SelectContent className="bg-white border-purple-200 shadow-xl z-50">
          {fashionStyles.map((style) => (
            <SelectItem key={style.id} value={style.id} className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50">
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">{style.name}</span>
                <span className="text-xs text-gray-600">{style.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedStyle && (
        <div className="mt-3 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700">
            <span className="font-medium">Đã chọn:</span> {getSelectedStyleName()}
          </p>
        </div>
      )}
    </Card>
  );
};

export default StyleSelector;
