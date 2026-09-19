import React from 'react';
import { 
  Utensils, 
  ShoppingBag, 
  Receipt, 
  Car, 
  Film, 
  HeartPulse, 
  Plane, 
  GraduationCap, 
  MoreHorizontal,
  type LucideProps
} from 'lucide-react';
import type { Category } from '../types/expense';

interface CategoryIconProps extends LucideProps {
  category: Category | string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, ...props }) => {
  switch (category) {
    case 'Food & Dining':
      return <Utensils {...props} />;
    case 'Shopping':
      return <ShoppingBag {...props} />;
    case 'Bills & Utilities':
      return <Receipt {...props} />;
    case 'Transportation':
      return <Car {...props} />;
    case 'Entertainment':
      return <Film {...props} />;
    case 'Healthcare':
      return <HeartPulse {...props} />;
    case 'Travel':
      return <Plane {...props} />;
    case 'Education':
      return <GraduationCap {...props} />;
    default:
      return <MoreHorizontal {...props} />;
  }
};
