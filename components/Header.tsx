import React from 'react';

interface HeaderProps {
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="sticky top-0 z-[100] flex items-center gap-4 bg-osmak-green text-white px-4 py-3 shadow-md">
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
          Quality Assurance Division OnBoarding Portal
        </span>
      </div>
    </header>
  );
};

export default Header;