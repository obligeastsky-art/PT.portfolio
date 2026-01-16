
import React from 'react';

interface HeaderProps {
  isAdmin: boolean;
  onAdminToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onAdminToggle }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md shadow-lg z-50 border-b border-white/5">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <a 
          href="#" 
          onClick={(e) => handleNavClick(e, 'top')}
          className="text-2xl font-bold tracking-tighter text-white"
        >
          PT.<span className="text-teal-400">PORTFOLIO</span>
        </a>
        
        <nav className="hidden md:flex space-x-8 items-center">
          <a 
            href="#about" 
            onClick={(e) => handleNavClick(e, 'about')}
            className="font-medium text-gray-300 hover:text-white transition-colors"
          >
            프로필
          </a>
          <a 
            href="#credentials" 
            onClick={(e) => handleNavClick(e, 'credentials')}
            className="font-medium text-gray-300 hover:text-white transition-colors"
          >
            경력/자격
          </a>
          <a 
            href="#portfolio" 
            onClick={(e) => handleNavClick(e, 'portfolio')}
            className="font-medium text-gray-300 hover:text-white transition-colors"
          >
            활동
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleNavClick(e, 'contact')}
            className="font-medium text-gray-300 hover:text-white transition-colors"
          >
            문의하기
          </a>
          
          <button 
            onClick={onAdminToggle}
            className="ml-4 px-4 py-1.5 rounded-full text-sm font-bold bg-white/5 text-gray-400 border border-white/10 hover:bg-white hover:text-navy transition-all uppercase tracking-widest"
          >
            Admin
          </button>
        </nav>

        <a 
          href="#contact" 
          onClick={(e) => handleNavClick(e, 'contact')}
          className="md:hidden bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
        >
          문의하기
        </a>
      </div>
    </header>
  );
};

export default Header;
