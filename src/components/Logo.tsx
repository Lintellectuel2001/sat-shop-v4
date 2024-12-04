import React from 'react';
import { Tv, Radio } from 'lucide-react';

interface LogoProps {
  customIcon?: string;
  text?: string;
  theme?: 'gradient' | 'solid' | 'outline';
  textColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const Logo = ({ 
  customIcon, 
  text = 'SAT-SHOP', 
  theme = 'gradient',
  textColor = 'white',
  gradientFrom = 'white',
  gradientTo = 'red-500'
}: LogoProps) => {
  const getTextStyles = () => {
    switch (theme) {
      case 'gradient':
        return `bg-gradient-to-r from-${gradientFrom} to-${gradientTo} bg-clip-text text-transparent`;
      case 'solid':
        return textColor === 'white' ? 'text-white' : `text-${textColor}`;
      case 'outline':
        return `text-transparent border-2 px-2 ${
          textColor === 'white' 
            ? 'border-white/50 bg-white/5' 
            : `border-${textColor}/50 bg-${textColor}/5`
        }`;
      default:
        return `bg-gradient-to-r from-${gradientFrom} to-${gradientTo} bg-clip-text text-transparent`;
    }
  };

  if (customIcon) {
    return (
      <div className="flex items-center space-x-2">
        <img src={customIcon} alt="Logo" className="w-8 h-8 object-contain" />
        <span className={`text-xl font-bold ${getTextStyles()}`}>
          {text}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Tv size={32} className="text-white" />
        <Radio size={16} className="text-red-500 absolute -bottom-1 -right-1" />
      </div>
      <span className={`text-xl font-bold ${getTextStyles()}`}>
        {text}
      </span>
    </div>
  );
};

export default Logo;