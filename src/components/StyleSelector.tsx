
import React from 'react';
import { Palette } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

// Việt hóa các lựa chọn phong cách
const fashionStyles = [
  { id: 'studio-soft-light', name: 'Phòng studio ánh sáng nhẹ', description: '' },
  { id: 'studio-minimal-backdrop', name: 'Studio nền tối giản', description: '' },
  { id: 'luxury-cafe', name: 'Quán cà phê sang trọng', description: '' },
  { id: 'shopping-mall', name: 'Trung tâm thương mại', description: '' },
  { id: 'garden', name: 'Khu vườn', description: '' },
  { id: 'park', name: 'Công viên', description: '' },
  { id: 'mansion', name: 'Biệt thự sang trọng', description: '' },
  { id: 'urban-street', name: 'Phố đi bộ cao cấp', description: '' },
  { id: 'sea', name: 'Bên bờ biển', description: '' },
  { id: 'homestay', name: 'Homestay trong nhà', description: '' },
  { id: 'apartment', name: 'Căn hộ tối giản', description: '' },
];

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange }) => {
  const getSelectedStyleName = () => {
    const style = fashionStyles.find(s => s.id === selectedStyle);
    return style ? `${style.name}` : '';
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Palette className="h-5 w-5 text-purple-600" />
        Chọn Bối Cảnh Thời Trang
      </h2>
      
      <Select value={selectedStyle} onValueChange={onStyleChange}>
        <SelectTrigger className="w-full h-12 bg-white border-purple-200 focus:ring-purple-500">
          <SelectValue placeholder="Chọn bối cảnh..." />
        </SelectTrigger>
        <SelectContent className="bg-white border-purple-200 shadow-xl z-50">
          {fashionStyles.map((style) => (
            <SelectItem
              key={style.id}
              value={style.id}
              className="cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">{style.name}</span>
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

