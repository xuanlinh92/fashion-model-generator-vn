
import React from 'react';
import { Hash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface QuantitySelectorProps {
  imageQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ imageQuantity, onQuantityChange }) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Hash className="h-5 w-5 text-purple-600" />
        Số lượng ảnh ({imageQuantity})
      </h2>
      
      <div className="space-y-4">
        <Slider
          value={[imageQuantity]}
          onValueChange={(value) => onQuantityChange(value[0])}
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
  );
};

export default QuantitySelector;
