
import React from 'react';
import { Palette } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

const fashionStyles = [
  { id: 'studio-soft-light', name: 'Studio with soft light', description: '' },
  { id: 'studio-minimal-backdrop', name: 'Studio with minimal backdrop', description: '' },
  { id: 'luxury-cafe', name: 'Luxurious outdoor cafe', description: '' },
  { id: 'shopping-mall', name: 'Shopping mall', description: '' },
  { id: 'garden', name: 'The garden', description: '' },
  { id: 'park', name: 'The park', description: '' },
  { id: 'mansion', name: 'The mansion', description: '' },
  { id: 'urban-street', name: 'Upscale urban street', description: '' },
  { id: 'sea', name: 'Beside the Sea', description: '' },
  { id: 'homestay', name: 'In door Homestay', description: '' },
  { id: 'apartment', name: 'Minimalist Apartment', description: '' },
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
        Select Fashion Scene
      </h2>
      
      <Select value={selectedStyle} onValueChange={onStyleChange}>
        <SelectTrigger className="w-full h-12 bg-white border-purple-200 focus:ring-purple-500">
          <SelectValue placeholder="Select a scene..." />
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
                {/* description được bỏ qua do yêu cầu mới */}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedStyle && (
        <div className="mt-3 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700">
            <span className="font-medium">Selected:</span> {getSelectedStyleName()}
          </p>
        </div>
      )}
    </Card>
  );
};

export default StyleSelector;
