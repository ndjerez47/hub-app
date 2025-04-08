import { ReactNode } from 'react';
import { classNames } from '@/app/lib/utils';

interface NavTabProps {
  label: string;
  icon: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export const NavTab = ({ label, icon, isActive = false, onClick }: NavTabProps) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'flex items-center space-x-2 px-4 py-2 rounded-md transition-colors',
        isActive 
          ? 'bg-white/10 text-white' 
          : 'hover:bg-white/5 text-white/80'
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
