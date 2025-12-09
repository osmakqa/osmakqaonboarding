import React from 'react';
import { UserRole } from '../types';
import { LogOut, User } from 'lucide-react';

interface HeaderProps {
  onLogoClick?: () => void;
  userRole?: UserRole | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, userRole, onLogout }) => {
  return (
    <header className="sticky top-0 z-[100] flex items-center justify-between gap-4 bg-osmak-green text-white px-4 py-3 shadow-md">
      <div className="flex items-center gap-4">
        <img 
          src="https://maxterrenal-hash.github.io/justculture/osmak-logo.png" 
          alt="OsMak Logo" 
          className="h-12 w-auto cursor-pointer"
          onClick={onLogoClick}
        />
        <div className="flex flex-col">
          <h1 className="m-0 text-[1.05rem] tracking-wide uppercase font-bold leading-tight">
            OSPITAL NG MAKATI
          </h1>
          <span className="text-[0.8rem] opacity-90 font-light">
            Quality Assurance Division Training Portal
          </span>
        </div>
      </div>

      {userRole && onLogout && (
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
            <User size={16} className="opacity-80" />
            <span className="text-sm font-medium">{userRole}</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded shadow-md font-bold text-sm hover:bg-red-700 transition-colors border border-red-700"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;